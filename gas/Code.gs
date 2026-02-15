// ============================================================
// Google Apps Script — PURE CRUD Backend
// PT Tunggal Mandiri Logistik Invoice System
// ============================================================
// All business logic (terbilang, schema, calculate) lives in React.
// GAS only does: SAVE raw data & READ all data.
// Deploy as Web App: Execute as Me, Access: Anyone

// ── Configuration ─────────────────────────────────────────────
const SPREADSHEET_ID = ''; // <-- Set your Google Sheets ID here
const SHEET_TRANSACTIONS = 'Transactions';
const SHEET_ITEMS = 'InvoiceItems'; // <--- NEW: Detailed Items Sheet
const SHEET_COUNTER = 'InvoiceCounter';

// ── JSON Response Helper ──────────────────────────────────────
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Initialize Database (run once) ────────────────────────────
function initDatabase() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // 1. Master Sheet (Headers)
  var txSheet = ss.getSheetByName(SHEET_TRANSACTIONS);
  if (!txSheet) {
    txSheet = ss.insertSheet(SHEET_TRANSACTIONS);
    txSheet.appendRow([
      'InvoiceNumber', 'CustomerName', 'SchemaType', 'BankGroup',
      'InvoiceDate', 'PeriodeStart', 'PeriodeEnd',
      'RowData_JSON', 'TotalAmount', 'Terbilang', 'CreatedAt'
    ]);
    txSheet.getRange('1:1').setFontWeight('bold');
    txSheet.setFrozenRows(1);
  }

  // 2. Detail Sheet (Items)
  var itemSheet = ss.getSheetByName(SHEET_ITEMS);
  if (!itemSheet) {
    itemSheet = ss.insertSheet(SHEET_ITEMS);
    itemSheet.appendRow([
      'InvoiceNumber', 'No', 'Tanggal', 'Consignee', 
      'NoMobil', 'NoContainer', 'Tujuan', 'Depo', 'Status', 'Size', 'PickUp',
      'Harga', 'GatePass', 'LiftOff', 'Bongkar', 'Cleaning', 
      'Stuffing', 'Storage', 'Demurrage', 'Seal', 'Others'
    ]);
    itemSheet.getRange('1:1').setFontWeight('bold');
    itemSheet.setFrozenRows(1);
  }

  // 3. Counter Sheet
  var counterSheet = ss.getSheetByName(SHEET_COUNTER);
  if (!counterSheet) {
    counterSheet = ss.insertSheet(SHEET_COUNTER);
    counterSheet.appendRow(['Year', 'LastNumber']);
    counterSheet.appendRow([new Date().getFullYear(), 0]);
    counterSheet.getRange('1:1').setFontWeight('bold');
  }

  // 4. Master Data: Customers (Future Proofing)
  var customerSheet = ss.getSheetByName('Customers');
  if (!customerSheet) {
    customerSheet = ss.insertSheet('Customers');
    customerSheet.appendRow(['CustomerName', 'Address', 'NPWP', 'PIC', 'Phone']);
    customerSheet.getRange('1:1').setFontWeight('bold');
  }

  // 5. Master Data: Price List (Future Proofing)
  var priceSheet = ss.getSheetByName('PriceList');
  if (!priceSheet) {
    priceSheet = ss.insertSheet('PriceList');
    priceSheet.appendRow(['Destination', 'VehicleSize', 'Price', 'Description']);
    priceSheet.getRange('1:1').setFontWeight('bold');
  }

  // Cleanup default Sheet1 if exists
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet) ss.deleteSheet(defaultSheet);

  Logger.log('Database initialized successfully.');
}

// ── Auto-Increment Invoice Number (atomic on server) ──────────
function getNextInvoiceNumber() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_COUNTER);
  var currentYear = new Date().getFullYear();

  var data = sheet.getDataRange().getValues();
  var yearRow = -1;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == currentYear) {
      yearRow = i + 1;
      break;
    }
  }

  var lastNumber = 0;
  if (yearRow === -1) {
    sheet.appendRow([currentYear, 1]);
    lastNumber = 1;
  } else {
    lastNumber = data[yearRow - 1][1] + 1;
    sheet.getRange(yearRow, 2).setValue(lastNumber);
  }

  var paddedNumber = ('0000' + lastNumber).slice(-4);
  return paddedNumber + '/TML/IMP/' + currentYear;
}

// ── doPost — Save Master & Detail Data ────────────────────────
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    // Use Client-provided Invoice Number (Logic in React) overrides Server Logic
    var invoiceNumber = payload.invoiceNumber || getNextInvoiceNumber();

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // 1. Save Header to Transactions
    var sheet = ss.getSheetByName(SHEET_TRANSACTIONS);
    sheet.appendRow([
      invoiceNumber,
      payload.customerName || '',
      payload.schemaType || '',
      payload.bankGroup || '',
      payload.invoiceDate || new Date().toISOString().split('T')[0],
      payload.periodeStart || '',
      payload.periodeEnd || '',
      JSON.stringify(payload.rows || []), // Keep JSON as backup
      payload.totalAmount || 0,
      payload.terbilang || '',
      new Date().toISOString()
    ]);

    // 2. Save Items to InvoiceItems
    var itemSheet = ss.getSheetByName(SHEET_ITEMS);
    var rows = payload.rows || [];
    
    // Batch append is faster, but simple loop is safer for varied columns
    // We map the row object to our fixed column structure
    var itemRows = rows.map(function(r, index) {
      return [
        invoiceNumber,
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
        r.cleaning || 0,
        r.stuffing || 0,
        r.storage || 0,
        r.demurrage || 0,
        r.seal || 0,
        r.others || 0
      ];
    });

    if (itemRows.length > 0) {
      // Append all items at once
      var lastRow = itemSheet.getLastRow();
      itemSheet.getRange(lastRow + 1, 1, itemRows.length, itemRows[0].length).setValues(itemRows);
    }

    return jsonResponse({
      success: true,
      invoiceNumber: invoiceNumber
    });

  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

// ── doGet — Return ALL Transactions as JSON ───────────────────
function doGet() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_TRANSACTIONS);
    var data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return jsonResponse({ success: true, data: [] });
    }

    var headers = data[0];
    var records = [];

    // Simple parser for Master sheet
    for (var i = 1; i < data.length; i++) {
      var record = {};
      for (var j = 0; j < headers.length; j++) {
        record[headers[j]] = data[i][j];
      }
      records.push(record);
    }

    return jsonResponse({ success: true, data: records });

  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}
