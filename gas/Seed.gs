// ============================================================
// Data Seeding Script for Google Apps Script
// PT Tunggal Mandiri Logistik Invoice System
// ============================================================

/**
 * Generate dummy invoices for testing purposes
 */
function seedDatabase() {
  // Clear existing data first to avoid duplicates
  clearAllData();
  
  var ss = SpreadsheetApp.openById('1F9tpdxpWq-qffXYDQrSINW3URjmsX5MCysDMZdTr9PY');
  
  // Sample customers for testing
  var customers = ['PT ISL', 'Bpk Dwi', 'Bpk William', 'Bpk Ryan', 'PT CSL', 'PT BISMA LOGISTIK'];
  
  // Sample destinations
  var destinations = ['SURABAYA', 'MEDAN', 'SEMARANG', 'BALIKPAPAN', 'MAKASSAR', 'BANJARMASIN'];
  
  // Sample vehicles
  var vehicles = ['B 9151 FEH', 'B 9005 UWX', 'B 980 0 J', 'B 1851 FB', 'B 2586 SU'];
  
  // Sample containers
  var containers = ['HDMU4562312', 'DRYU9192674', 'ONEU6331390', 'CSMU8542667', 'OOCU8541717'];
  
  for (var i = 0; i < 5; i++) {
    var payload = {
      action: 'create',
      invoiceTypeName: 'OB - PT ISL',
      customerName: 'PT ISL',
      invoiceTypeId: 1,
      bankGroup: 'A',
      isFee: false,
      invoiceDate: new Date().toISOString().split('T')[0],
      periodeStart: '',
      periodeEnd: '',
      rows: [{
        no: 1,
        tanggal: new Date().toISOString().split('T')[0],
        consigne: 'PT. EXAMPLE COMPANY',
        noMobil: vehicles[Math.floor(Math.random() * vehicles.length)],
        noContainer: containers[Math.floor(Math.random() * containers.length)],
        status: 'DRY',
        size: '20',
        pickup: 'PELABUHAN',
        tujuan: destinations[Math.floor(Math.random() * destinations.length)],
        harga: Math.floor(Math.random() * 10000000) + 5000000, // Random amount between 5-15M
        gatePass: 20000
      }],
      totalAmount: 0,
      dp: 0,
      jumlah: 0,
      terbilang: 'Terbilang example'
    };
    
    // Calculate total
    var total = 0;
    payload.rows.forEach(function(row) {
      total += (row.harga || 0) + (row.gatePass || 0);
    });
    payload.totalAmount = total;
    payload.jumlah = total;
    
    saveInvoice(ss, payload, false);
  }
  
  Logger.log('✅ Seeded 5 dummy invoices for testing');
}

/**
 * Clear all existing data from sheets
 */
function clearAllData() {
  var ss = SpreadsheetApp.openById('1F9tpdxpWq-qffXYDQrSINW3URjmsX5MCysDMZdTr9PY');
  
  // Clear Transactions sheet (keep header row)
  var txSheet = ss.getSheetByName('Transactions');
  if (txSheet) {
    var lastRow = txSheet.getLastRow();
    if (lastRow > 1) {  // If there's data beyond the header
      txSheet.getRange(2, 1, lastRow - 1, txSheet.getLastColumn()).clear();
    }
  }
  
  // Clear InvoiceItems sheet (keep header row)
  var itemSheet = ss.getSheetByName('InvoiceItems');
  if (itemSheet) {
    var lastRow = itemSheet.getLastRow();
    if (lastRow > 1) {  // If there's data beyond the header
      itemSheet.getRange(2, 1, lastRow - 1, itemSheet.getLastColumn()).clear();
    }
  }
  
  // Clear Counter sheet and reset to default
  var counterSheet = ss.getSheetByName('InvoiceCounter');
  if (counterSheet) {
    counterSheet.clear();
    counterSheet.appendRow(['Year', 'LastNumber']);
    counterSheet.appendRow([new Date().getFullYear(), 0]);
  }
  
  // Clear SystemLogs sheet (keep header row)
  var logSheet = ss.getSheetByName('SystemLogs');
  if (logSheet) {
    var lastRow = logSheet.getLastRow();
    if (lastRow > 1) {  // If there's data beyond the header
      logSheet.getRange(2, 1, lastRow - 1, logSheet.getLastColumn()).clear();
    }
  }
  
  
  Logger.log('✅ All existing data cleared');
}

/**
 * Generate 10 invoices for EACH of the 16 invoice types
 */
function seedAllTypes() {
  // Clear existing data first to avoid duplicates
  clearAllData();
  
  var ss = SpreadsheetApp.openById('1F9tpdxpWq-qffXYDQrSINW3URjmsX5MCysDMZdTr9PY');

  // Define all 16 invoice types with their configurations
  var invoiceTypes = [
    { id: 1, name: 'OB - PT ISL', customerName: 'PT ISL', bankGroup: 'A', isFee: false },
    { id: 2, name: 'Imp/Exp - PT ISL', customerName: 'PT ISL', bankGroup: 'A', isFee: false },
    { id: 3, name: 'OB - Bpk Dwi', customerName: 'Bpk Dwi', bankGroup: 'A', isFee: false },
    { id: 4, name: 'Import - Bpk Dwi', customerName: 'Bpk Dwi', bankGroup: 'A', isFee: false },
    { id: 5, name: '🔶 Import FEE - Bpk Dwi', customerName: 'Bpk Dwi', bankGroup: 'A', isFee: true },
    { id: 6, name: 'Import - Bpk William', customerName: 'Bpk William', bankGroup: 'A', isFee: false },
    { id: 7, name: '🔶 Import FEE - Bpk William', customerName: 'Bpk William', bankGroup: 'A', isFee: true },
    { id: 8, name: 'Pribadi Import - Bpk Dwi', customerName: 'Bpk Dwi', bankGroup: 'A', isFee: false },
    { id: 9, name: '🔶 Pribadi Import FEE - Bpk Dwi', customerName: 'Bpk Dwi', bankGroup: 'A', isFee: true },
    { id: 10, name: 'Transport - Bpk Ryan', customerName: 'Bpk Ryan', bankGroup: 'A', isFee: false },
    { id: 11, name: 'Transport - PT CSL', customerName: 'PT CSL', bankGroup: 'A', isFee: false },
    { id: 12, name: 'Transport - PT BISMA LOGISTIK', customerName: 'PT BISMA LOGISTIK', bankGroup: 'A', isFee: false },
    { id: 13, name: 'Transport - PT LANJAKAR SUKSES MAKMUR', customerName: 'PT LANJAKAR SUKSES MAKMUR - Mba Amel', bankGroup: 'A', isFee: false },
    { id: 14, name: 'Transport - PT LANCAR JAYA KARGO', customerName: 'PT LANCAR JAYA KARGO - Mba Amel', bankGroup: 'B', isFee: false },
    { id: 15, name: 'Transport - PT HIRO PERMATA ABADI', customerName: 'PT HIRO PERMATA ABADI', bankGroup: 'B', isFee: false },
    { id: 16, name: 'Transport - PT ROCKET SALES MAKMUR', customerName: 'PT ROCKET SALES MAKMUR', bankGroup: 'B', isFee: false }
  ];
  
  // Sample data
  var destinations = ['SURABAYA', 'MEDAN', 'SEMARANG', 'BALIKPAPAN', 'MAKASSAR', 'BANJARMASIN', 'JAKARTA', 'BANDUNG', 'SOLO', 'YOGYAKARTA', 'DENPASAR', 'MANADO', 'PADANG', 'PALEMBANG', 'BONTANG', 'KENDARI'];
  var vehicles = ['B 9151 FEH', 'B 9005 UWX', 'B 980 0 J', 'B 1851 FB', 'B 2586 SU', 'B 8992 RO', 'B 9006 UWX', 'B 9012 UEA', 'B 1234 ABC', 'B 5678 DEF', 'B 9012 GHI', 'B 3456 JKL', 'B 7890 MNO', 'B 2468 PQR', 'B 1357 STU'];
  var containers = ['HDMU4562312', 'DRYU9192674', 'ONEU6331390', 'CSMU8542667', 'OOCU8541717', 'MRSU9090064', 'MRSU8002541', 'TEMU1234567', 'TLLU8765432', 'CAIU9876543', 'ECMU4567890', 'HCIU3456789', 'HLXU2345678', 'HMCU1234567', 'HMMU9876543'];
  var consignees = ['PT. EXAMPLE COMPANY', 'CV. TEST CONSIGNEE', 'PT. DEMO CLIENT', 'CV. SAMPLE RECEIVER', 'PT. MAJU JAYA', 'CV. SEJAHTERA ABADI', 'PT. PRIMA MANDIRI', 'CV. CIPTA KARYA', 'PT. GLOBAL LOGISTICS', 'CV. MITRA USAHA', 'PT. DHARMA JAYA', 'CV. SENTOSA JAYA', 'PT. CIPTA MUDA', 'CV. BINTANG TIMUR', 'PT. SARANA UTAMA'];
  var depots = ['PELABUHAN', 'APW', 'BIMARUNA', 'BPL', 'BRJ', 'BSA', 'CCIS', 'JICT', 'KCJ', 'TPS', 'KCT', 'NSCT', 'MSC', 'PSA', 'DPWH'];
  var pickupLocations = ['PELABUHAN', 'NPCT1', 'UTPKI1', 'UTPK1', 'PRIMANATA', 'JICT', 'KCJ', 'TPS', 'KCT', 'NSCT', 'MSC', 'PSA', 'DPWH', 'MULTIPERKASA', 'SUMBER ALFA'];
  
  // For each invoice type, create 10 sample invoices
  for (var typeIdx = 0; typeIdx < invoiceTypes.length; typeIdx++) {
    var type = invoiceTypes[typeIdx];

    for (var i = 0; i < 10; i++) {
      // Generate random date within the last 30 days
      var randomDaysAgo = Math.floor(Math.random() * 30);
      var date = new Date();
      date.setDate(date.getDate() - randomDaysAgo);
      var invoiceDate = date.toISOString().split('T')[0];

      // Generate rows based on the type's columns
      var rows = [];
      // Increase the number of rows to make it more realistic (2-8 rows per invoice)
      var numRows = Math.floor(Math.random() * 7) + 2; // 2-8 rows

      for (var r = 0; r < numRows; r++) {
        // Adjust pricing based on invoice type for more realistic data
        var basePrice;
        if (type.id <= 3) { // OB types - typically lower amounts
          basePrice = Math.floor(Math.random() * 5000000) + 2000000; // 2-7M
        } else if (type.id <= 13) { // Import types - medium to high amounts
          basePrice = Math.floor(Math.random() * 10000000) + 5000000; // 5-15M
        } else { // Transport types - variable amounts
          basePrice = Math.floor(Math.random() * 12000000) + 3000000; // 3-15M
        }

        var row = {
          no: r + 1,
          tanggal: invoiceDate,
          consigne: consignees[Math.floor(Math.random() * consignees.length)],
          noMobil: vehicles[Math.floor(Math.random() * vehicles.length)],
          noContainer: containers[Math.floor(Math.random() * containers.length)],
          status: ['DRY', 'BB', 'EMPTY'][Math.floor(Math.random() * 3)],
          size: ['20', '40'][Math.floor(Math.random() * 2)],
          tujuan: destinations[Math.floor(Math.random() * destinations.length)],
          harga: basePrice,
        };

        // Add type-specific fields
        if (type.id <= 3) { // OB types
          row.pickup = pickupLocations[Math.floor(Math.random() * pickupLocations.length)];
          row.gatePass = 20000;
        } else if (type.id <= 13) { // Import types
          row.depo = depots[Math.floor(Math.random() * depots.length)];
          row.pickup = pickupLocations[Math.floor(Math.random() * pickupLocations.length)];
          row.liftOff = Math.floor(Math.random() * 2000000) + 500000; // Higher base for import
          row.bongkar = Math.floor(Math.random() * 2000000) + 500000; // Higher base for import

          // Add extra fields for more complex types
          if (type.id === 4 || type.id === 5 || type.id === 8 || type.id === 9) {
            row.perbaikan = Math.floor(Math.random() * 1000000) + 200000;
            row.parkir = Math.floor(Math.random() * 500000) + 100000;
            row.demurrage = Math.floor(Math.random() * 3000000) + 500000;
          }
        } else { // Transport types
          row.depo = depots[Math.floor(Math.random() * depots.length)];
          row.pickup = pickupLocations[Math.floor(Math.random() * pickupLocations.length)];
          row.liftOff = Math.floor(Math.random() * 2000000) + 300000;
          row.repair = Math.floor(Math.random() * 1000000) + 200000;
          
          // Add additional transport-specific fields
          row.rsm = Math.floor(Math.random() * 800000) + 100000;
          row.ngemail = Math.floor(Math.random() * 600000) + 100000;
        }

        rows.push(row);
      }

      // Calculate totals
      var totalAmount = 0;
      rows.forEach(function(row) {
        var rowTotal = 0;
        // Sum all currency fields
        for (var key in row) {
          if (typeof row[key] === 'number' &&
              (key === 'harga' || key === 'gatePass' || key === 'liftOff' ||
               key === 'bongkar' || key === 'perbaikan' || key === 'parkir' ||
               key === 'demurrage' || key === 'pmp' || key === 'repair' ||
               key === 'ngemail' || key === 'rsm')) {
            if (type.isFee && key === 'harga') {
              rowTotal += Math.max(0, row[key] - 150000); // Apply FEE discount to harga
            } else {
              rowTotal += row[key];
            }
          }
        }
        totalAmount += rowTotal;
      });

      var dp = type.isFee ? Math.min(totalAmount, Math.floor(Math.random() * 5000000)) : 0;
      var jumlah = type.isFee ? totalAmount - dp : totalAmount;

      var payload = {
        action: 'create',
        invoiceTypeName: type.name,
        customerName: type.customerName,
        invoiceTypeId: type.id,
        bankGroup: type.bankGroup,
        isFee: type.isFee,
        invoiceDate: invoiceDate,
        periodeStart: invoiceDate,
        periodeEnd: invoiceDate,
        rows: rows,
        totalAmount: totalAmount,
        dp: dp,
        jumlah: jumlah,
        terbilang: 'Terbilang example for seeded data'
      };

      try {
        saveInvoice(ss, payload, false);
        Logger.log('✅ Seeded invoice #' + (i+1) + ' for type: ' + type.name + ' with ' + numRows + ' rows');
      } catch (e) {
        Logger.log('❌ Error seeding invoice for type ' + type.name + ': ' + e);
      }
    }

    Logger.log('✅ Completed seeding for type: ' + type.name + ' (' + type.customerName + ')');
  }

  Logger.log('✅ Seeding completed for all 16 invoice types (10 each)');
}