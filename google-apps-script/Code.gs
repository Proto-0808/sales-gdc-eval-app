/**
 * Backend penyimpanan untuk Formulir Evaluasi Sales GDC.
 * Paste seluruh isi file ini ke Extensions > Apps Script pada Google Sheet
 * yang akan dipakai sebagai database. Lihat README.md untuk langkah lengkap.
 */

// Nama tab/sheet tempat data disimpan. Akan dibuat otomatis kalau belum ada.
const SHEET_NAME = 'Rekap';

// GANTI dengan kode rahasia bebas (string apa saja).
// Harus SAMA PERSIS dengan GOOGLE_SCRIPT_SECRET di environment variable Vercel.
const SECRET = 'ganti-dengan-kode-rahasia-anda';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.secret !== SECRET) {
      return jsonResponse({ ok: false, error: 'Unauthorized' });
    }
    const sheet = getSheet();
    sheet.appendRow([
      new Date().toISOString(),
      body.namaPeserta || '',
      body.divisi || '',
      body.periode || '',
      body.namaMentor || '',
      body.skor || '',
      body.kategori || '',
      body.rekomendasi || '',
      body.catatan || '',
    ]);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    const secret = e.parameter.secret;
    if (secret !== SECRET) {
      return jsonResponse({ ok: false, error: 'Unauthorized' });
    }
    const sheet = getSheet();
    const values = sheet.getDataRange().getValues();
    const rows = values.slice(1).map((r) => ({
      waktu: r[0],
      namaPeserta: r[1],
      divisi: r[2],
      periode: r[3],
      namaMentor: r[4],
      skor: r[5],
      kategori: r[6],
      rekomendasi: r[7],
      catatan: r[8],
    }));
    return jsonResponse({ ok: true, rows: rows });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Waktu', 'Nama Sales', 'Divisi', 'Periode', 'Manager',
      'Skor', 'Kategori', 'Rekomendasi', 'Catatan',
    ]);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
