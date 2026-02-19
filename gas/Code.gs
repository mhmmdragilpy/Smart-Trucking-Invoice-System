// ============================================================
// Google Apps Script — PURE CRUD Backend
// PT Tunggal Mandiri Logistik Invoice System
// ============================================================

// ── Configuration ─────────────────────────────────────────────
const SPREADSHEET_ID = '1F9tpdxpWq-qffXYDQrSINW3URjmsX5MCysDMZdTr9PY'; 
const SHEET_TRANSACTIONS = 'Transactions';
const SHEET_ITEMS = 'InvoiceItems';
const SHEET_COUNTER = 'InvoiceCounter';

// ── JSON Response Helper ──────────────────────────────────────
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Initialize Database ───────────────────────────────────────
function initDatabase() {
  if (!SPREADSHEET_ID) return;
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // 1. Master Sheet
    var txSheet = ss.getSheetByName(SHEET_TRANSACTIONS);
    if (!txSheet) {
      txSheet = ss.insertSheet(SHEET_TRANSACTIONS);
      txSheet.appendRow(['InvoiceNumber', 'CustomerName', 'InvoiceTypeName', 'BankGroup', 'IsFee', 'InvoiceDate', 'PeriodeStart', 'PeriodeEnd', 'RowData_JSON', 'TotalAmount', 'DP', 'Jumlah', 'Terbilang', 'CreatedAt', 'InvoiceTypeId']);
      txSheet.getRange('1:1').setFontWeight('bold'); txSheet.setFrozenRows(1);
    }

    // 2. Detail Sheet
    var itemSheet = ss.getSheetByName(SHEET_ITEMS);
    if (!itemSheet) {
      itemSheet = ss.insertSheet(SHEET_ITEMS);
      itemSheet.appendRow(['InvoiceNumber', 'No', 'Tanggal', 'Consignee', 'NoMobil', 'NoContainer', 'Tujuan', 'Depo', 'Status', 'Size', 'PickUp', 'Harga', 'GatePass', 'LiftOff', 'Bongkar', 'Cleaning', 'Stuffing', 'Storage', 'Demurrage', 'Seal', 'Others']);
      itemSheet.getRange('1:1').setFontWeight('bold'); itemSheet.setFrozenRows(1);
    }

    // 3. Counter Sheet
    var counterSheet = ss.getSheetByName(SHEET_COUNTER);
    if (!counterSheet) {
      counterSheet = ss.insertSheet(SHEET_COUNTER);
      counterSheet.appendRow(['Year', 'LastNumber']);
      counterSheet.appendRow([new Date().getFullYear(), 0]);
    }

    // 4. Logs
    var logSheet = ss.getSheetByName('SystemLogs');
    if (!logSheet) { ss.insertSheet('SystemLogs').appendRow(['Timestamp', 'Action', 'Details', 'UserEmail']); }

    Logger.log('✅ Database Initialized Successfully for Sheet ID: ' + SPREADSHEET_ID);

  } catch (e) { Logger.log('❌ Error init: ' + e); }
}

// ── Auto-Increment ────────────────────────────────────────────
function getNextInvoiceNumber() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_COUNTER);
  var currentYear = new Date().getFullYear();
  var data = sheet.getDataRange().getValues();
  var yearRow = -1;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == currentYear) { yearRow = i + 1; break; }
  }

  var lastNumber = 0;
  if (yearRow === -1) {
    sheet.appendRow([currentYear, 1]);
    lastNumber = 1;
  } else {
    lastNumber = data[yearRow - 1][1] + 1;
    sheet.getRange(yearRow, 2).setValue(lastNumber);
  }

  return ('0000' + lastNumber).slice(-4) + '/TML/IMP/' + currentYear;
}

// ── Helper: Log Action ────────────────────────────────────────
function logAction(action, details) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    ss.getSheetByName('SystemLogs').appendRow([new Date(), action, details, Session.getActiveUser().getEmail()]);
  } catch (e) {}
}

// ── Helper: Get Specific Sheet (Customer Based) ────────────────
function getCustomerSheet(ss, customerName) {
    if (!customerName) return null;
    var safeName = customerName.replace(/[:\/\\?*\[\]]/g, "_").substring(0, 90);
    var sheet = ss.getSheetByName(safeName);
    if (!sheet) {
        sheet = ss.insertSheet(safeName);
        // [MODIFIED] Added 'InvoiceType' at the end or beginning? Let's add it after InvoiceNumber
        sheet.appendRow(['InvoiceNumber', 'InvoiceType', 'Periode', 'No', 'Tanggal', 'Consignee', 'NoMobil', 'NoContainer', 'Tujuan', 'Depo', 'Status', 'Size', 'PickUp', 'Harga', 'GatePass', 'LiftOff', 'Bongkar', 'Total']);
        sheet.getRange('1:1').setFontWeight('bold'); sheet.setFrozenRows(1);
    }
    return sheet;
}

// ── CORE: Delete Invoice ──────────────────────────────────────
function deleteInvoice(ss, invoiceNumber) {
    // 1. Master Transactions
    var txSheet = ss.getSheetByName(SHEET_TRANSACTIONS);
    var txData = txSheet.getDataRange().getValues();
    
    for (var i = txData.length - 1; i >= 1; i--) {
        if (txData[i][0] == invoiceNumber) {
            // [MODIFIED] Delete from Customer Sheet (Column 1 is CustomerName)
            var customerName = txData[i][1]; 
            if (customerName) {
                try {
                    var custSheet = getCustomerSheet(ss, customerName);
                    if (custSheet) {
                        var custData = custSheet.getDataRange().getValues();
                        for (var k = custData.length - 1; k >= 1; k--) {
                            if (custData[k][0] == invoiceNumber) custSheet.deleteRow(k + 1);
                        }
                    }
                } catch (e) {}
            }
            txSheet.deleteRow(i + 1);
        }
    }

    // 2. InvoiceItems
    var itemSheet = ss.getSheetByName(SHEET_ITEMS);
    var itemData = itemSheet.getDataRange().getValues();
    for (var j = itemData.length - 1; j >= 1; j--) {
        if (itemData[j][0] == invoiceNumber) itemSheet.deleteRow(j + 1);
    }
}

// ── CORE: Save Invoice ────────────────────────────────────────
function saveInvoice(ss, payload, isUpdate) {
    // Use existing number if update/provided, else generate
    var invoiceNumber = payload.invoiceNumber;
    if (!invoiceNumber && !isUpdate) invoiceNumber = getNextInvoiceNumber();
    
    var invoiceTypeName = payload.invoiceTypeName || payload.schemaType || 'Unknown';
    var customerName = payload.customerName || 'Unknown Customer';

    // 1. Save to Transactions
    var sheet = ss.getSheetByName(SHEET_TRANSACTIONS);
    sheet.appendRow([
      invoiceNumber,
      customerName,
      invoiceTypeName,
      payload.bankGroup || '',
      payload.isFee || false,
      payload.invoiceDate || new Date().toISOString().split('T')[0],
      payload.periodeStart || '',
      payload.periodeEnd || '',
      JSON.stringify(payload.rows || []),
      payload.totalAmount || 0,
      payload.dp || 0,
      payload.jumlah || 0,
      payload.terbilang || '',
      new Date().toISOString(),
      payload.invoiceTypeId || 0
    ]);

    // 2. Save Item Rows
    var itemSheet = ss.getSheetByName(SHEET_ITEMS);
    var rows = payload.rows || [];
    var itemRows = rows.map(function(r, index) {
      return [
        invoiceNumber, index + 1, r.tanggal || '', r.consigne || '', r.noMobil || '', r.noContainer || '', r.tujuan || '', r.depo || '', r.status || '', r.size || '', r.pickup || '', r.harga || 0, r.gatePass || 0, r.liftOff || 0, r.bongkar || 0, r.cleaning || 0, r.stuffing || 0, r.storage || 0, r.demurrage || 0, r.seal || 0, r.others || 0
      ];
    });
    if (itemRows.length > 0) itemSheet.getRange(itemSheet.getLastRow() + 1, 1, itemRows.length, itemRows[0].length).setValues(itemRows);

    // 3. [MODIFIED] Save to Customer Sheet
    var custSheet = getCustomerSheet(ss, customerName);
    var custRows = rows.map(function(r, index) {
        var rowTotal = (r.harga || 0) + (r.gatePass || 0) + (r.liftOff || 0) + (r.bongkar || 0); 
        return [
            invoiceNumber, 
            invoiceTypeName, // [NEW] Added Invoice Type column
            (payload.periodeStart || '') + ' - ' + (payload.periodeEnd || ''), 
            index + 1, 
            r.tanggal || '', 
            r.consigne || '', 
            r.noMobil || '', 
            r.noContainer || '', 
            r.tujuan || '', 
            r.depo || '', 
            r.status || '', 
            r.size || '', 
            r.pickup || '', 
            r.harga || 0, 
            r.gatePass || 0, 
            r.liftOff || 0, 
            r.bongkar || 0, 
            rowTotal
        ];
    });
    if (custRows.length > 0) custSheet.getRange(custSheet.getLastRow() + 1, 1, custRows.length, custRows[0].length).setValues(custRows);

    return invoiceNumber;
}

// ── doPost Main Handler ───────────────────────────────────────
function doPost(e) {
  if (!SPREADSHEET_ID) return jsonResponse({ success: false, error: "No SPREADSHEET_ID" });

  try {
    var payload = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var action = payload.action || 'create';

    if (action === 'delete') {
        if (!payload.invoiceNumber) return jsonResponse({ success: false, error: "Missing invoiceNumber" });
        deleteInvoice(ss, payload.invoiceNumber);
        logAction('DELETE', 'Deleted ' + payload.invoiceNumber);
        return jsonResponse({ success: true, message: 'Deleted' });
    }

    if (action === 'update') {
        // Warning: This expects 'originalInvoiceNumber' if ID changed, or just 'invoiceNumber' if same
        var targetId = payload.originalInvoiceNumber || payload.invoiceNumber;
        if (!targetId) return jsonResponse({ success: false, error: "Missing originalInvoiceNumber for update" });
        
        deleteInvoice(ss, targetId); // Remove old
        var newId = saveInvoice(ss, payload, true); // Save new
        
        logAction('UPDATE', 'Updated ' + targetId + ' to ' + newId);
        return jsonResponse({ success: true, message: 'Berhasil mengubah data', invoiceNumber: newId });
    }

    // Default: Create
    var newId = saveInvoice(ss, payload, false);
    logAction('CREATE', 'Created ' + newId);
    return jsonResponse({ success: true, message: 'Berhasil menyimpan data', invoiceNumber: newId });

  } catch (error) {
    logAction('ERROR', error.toString());
    return jsonResponse({ success: false, error: error.toString() });
  }
}

// ── doGet — Read All ──────────────────────────────────────────
function doGet() {
  if (!SPREADSHEET_ID) return jsonResponse({ success: false });
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_TRANSACTIONS);
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return jsonResponse({ success: true, data: [] });

    var headers = data[0];
    var records = [];
    for (var i = 1; i < data.length; i++) {
      var record = {};
      for (var j = 0; j < headers.length; j++) record[headers[j]] = data[i][j];

      // Map the fields to match what the frontend expects
      record['InvoiceTypeName'] = record['InvoiceTypeName'] || 'Unknown';
      record['InvoiceTypeId'] = parseInt(record['InvoiceTypeId']) || 0;
      record['BankGroup'] = record['BankGroup'] || 'A';
      record['IsFee'] = record['IsFee'] === true || record['IsFee'] === 'true';
      record['TotalAmount'] = parseFloat(record['TotalAmount']) || 0;
      record['DP'] = parseFloat(record['DP']) || 0;
      record['Jumlah'] = parseFloat(record['Jumlah']) || 0;

      records.push(record);
    }
    return jsonResponse({ success: true, data: records });
  } catch (e) { return jsonResponse({ success: false, error: e.toString() }); }
}

