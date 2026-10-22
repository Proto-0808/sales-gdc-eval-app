# Formulir Evaluasi Sales GDC — App

Versi standalone dari Formulir Evaluasi Sales GDC, di-deploy sebagai aplikasi web sendiri
(Next.js di Vercel) supaya bisa diisi banyak Manager berbeda dan datanya tersimpan
langsung ke Google Sheets — tidak lagi bergantung pada penyimpanan bawaan Claude
Artifacts yang butuh login akun Claude.

Ada 3 tahap setup: **(1) Google Sheet**, **(2) Google Apps Script**, **(3) Deploy ke Vercel**.
Ikuti urutan ini.

---

## 1. Siapkan Google Sheet

1. Buat Google Sheet baru (boleh judul apa saja, mis. "Database Evaluasi Sales GDC").
2. Sheet/tab-nya tidak perlu disiapkan manual — script di langkah 2 akan otomatis
   membuat tab bernama **Rekap** beserta header kolomnya saat pertama kali dipakai.

## 2. Deploy Google Apps Script

1. Di Google Sheet tadi, buka menu **Extensions → Apps Script**.
2. Hapus kode default di `Code.gs`, lalu copy-paste seluruh isi file
   `google-apps-script/Code.gs` dari folder project ini.
3. Di baris `const SECRET = 'ganti-dengan-kode-rahasia-anda';`, ganti dengan kode
   rahasia bebas buatan sendiri (contoh: `gdc-eval-2026-x7k`). **Catat kode ini**,
   nanti dipakai lagi di langkah 3.
4. Klik **Deploy → New deployment**.
5. Klik ikon gear di sebelah "Select type", pilih **Web app**.
6. Isi:
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Klik **Deploy**. Saat diminta otorisasi, izinkan akses ke akun Google kamu
   (klik "Advanced" → "Go to (nama project) (unsafe)" kalau muncul warning —
   ini normal karena script belum diverifikasi Google, wajar untuk script pribadi).
8. Setelah deploy selesai, **copy URL Web App**-nya (bentuknya
   `https://script.google.com/macros/s/xxxxxxxx/exec`). Simpan URL ini juga.

> Kalau nanti kamu edit `Code.gs` lagi, ingat harus **Deploy → Manage deployments →
> edit (pensil) → New version → Deploy** supaya perubahan aktif. Sekadar Save saja
> tidak cukup.

## 3. Deploy ke Vercel

1. Push folder project ini ke repo GitHub baru (atau upload manual lewat
   [vercel.com/new](https://vercel.com/new) tanpa GitHub kalau lebih simpel).
2. Di [vercel.com](https://vercel.com), klik **Add New → Project**, pilih repo ini.
3. Sebelum klik Deploy, buka bagian **Environment Variables**, tambahkan:

   | Key | Value |
   |---|---|
   | `GOOGLE_SCRIPT_URL` | URL Web App dari langkah 2.8 |
   | `GOOGLE_SCRIPT_SECRET` | Kode rahasia yang kamu isi di langkah 2.3 |

4. Klik **Deploy**. Setelah selesai, Vercel akan kasih URL publik
   (mis. `https://sales-gdc-eval.vercel.app`) — inilah link yang dibagikan ke
   Pak Prima, Pak Pendi, dan Manager lainnya.

### Menjalankan di komputer sendiri dulu (opsional, untuk testing)

```bash
npm install
cp .env.example .env.local   # lalu isi GOOGLE_SCRIPT_URL & GOOGLE_SCRIPT_SECRET
npm run dev
```

Buka `http://localhost:3000`.

---

## Struktur Project

```
app/
  page.js            → Formulir utama (5 aspek, 18 pertanyaan, skor otomatis)
  rekap/page.js       → Halaman rekap seluruh evaluasi + ekspor CSV
  api/submit/route.js → Kirim data ke Google Sheets (server-side, URL & secret tersembunyi)
  api/rekap/route.js  → Ambil data dari Google Sheets untuk halaman rekap
  globals.css         → Styling (tema navy/gold, sama seperti versi artifact)
lib/params.js          → Data 5 aspek & 18 pertanyaan penilaian — EDIT DI SINI
                          kalau mau ubah/tambah pertanyaan, bobot, atau kategori.
                          Form & kalkulasi skor otomatis menyesuaikan.
google-apps-script/
  Code.gs              → Kode backend yang di-paste ke Apps Script (langkah 2)
```

## Mengubah pertanyaan / bobot penilaian

Edit `lib/params.js` — array `PARAMS`. Tidak perlu ubah file lain; form,
perhitungan skor, dan progress bar semuanya dinamis mengikuti array ini,
persis seperti versi artifact sebelumnya.

## Kenapa tidak pakai penyimpanan bawaan Claude lagi?

Versi artifact sebelumnya pakai `window.storage`, API yang hanya berfungsi kalau
yang mengakses sedang login ke akun Claude di claude.ai. Saat dibagikan sebagai
link publik ke orang di luar Claude (seperti para Manager), penyimpanan ini
tidak bisa diandalkan. App ini menggantinya dengan Google Sheets sebagai
database sesungguhnya, diakses lewat API route Next.js yang berjalan di server
Vercel — jadi URL dan kode rahasia Apps Script tidak pernah terlihat oleh
browser pengguna.
