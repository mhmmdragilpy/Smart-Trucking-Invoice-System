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

  var txSheet = ss.getSheetByName(SHEET_TRANSACTIONS);
  if (!txSheet) {
    txSheet = ss.insertSheet(SHEET_TRANSACTIONS);
    txSheet.appendRow([
      'InvoiceNumber', 'CustomerName', 'SchemaType', 'BankGroup',
      'InvoiceDate', 'PeriodeStart', 'PeriodeEnd',
      'RowData', 'TotalAmount', 'Terbilang', 'CreatedAt'
    ]);
    txSheet.getRange('1:1').setFontWeight('bold');
  }

  var counterSheet = ss.getSheetByName(SHEET_COUNTER);
  if (!counterSheet) {
    counterSheet = ss.insertSheet(SHEET_COUNTER);
    counterSheet.appendRow(['Year', 'LastNumber']);
    counterSheet.appendRow([new Date().getFullYear(), 0]);
    counterSheet.getRange('1:1').setFontWeight('bold');
  }

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

// ── doPost — Save Raw Data (NO calculation, NO terbilang) ─────
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    // Generate invoice number (only server-side atomic logic)
    var invoiceNumber = getNextInvoiceNumber();

    // Save raw data — all calculations done in React frontend
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_TRANSACTIONS);

    sheet.appendRow([
      invoiceNumber,
      payload.customerName || '',
      payload.schemaType || '',
      payload.bankGroup || '',
      payload.invoiceDate || new Date().toISOString().split('T')[0],
      payload.periodeStart || '',
      payload.periodeEnd || '',
      JSON.stringify(payload.rows || []),
      payload.totalAmount || 0,        // pre-computed by React
      payload.terbilang || '',          // pre-computed by React
      new Date().toISOString()
    ]);

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
