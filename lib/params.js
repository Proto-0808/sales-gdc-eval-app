// Struktur aspek penilaian & pertanyaan turunan.
// Ubah/tambah di sini saja — form, kalkulasi skor, dan tampilan rekap
// otomatis menyesuaikan karena semuanya dibaca dari array ini.
export const PARAMS = [
  {
    name: "1. Kedisiplinan Leads Harian",
    weight: 0.4,
    kpi: "KPI: Kedisiplinan & konsistensi mencapai target Leads prospeksi harian (evaluasi OJT 1 Minggu — bukan hasil Booking/Closing akhir)",
    notes: [
      "Fokus penilaian: rutinitas & kualitas mencari Leads baru setiap hari kerja sesuai target harian, bukan hasil akhir penjualan.",
    ],
    scaleHints: [
      "1 = Sangat jarang mencapai target Leads harian (<40%); tidak disiplin melakukan prospeksi harian",
      "2 = Pencapaian Leads harian rendah (40–59%); disiplin prospeksi masih perlu arahan aktif",
      "3 = Pencapaian Leads harian cukup (60–79%); disiplin prospeksi mulai terbentuk namun belum konsisten",
      "4 = Pencapaian Leads harian baik (80–99%); disiplin prospeksi konsisten hampir setiap hari",
      "5 = Pencapaian Leads harian sangat baik (≥100%); disiplin prospeksi penuh dan konsisten setiap hari kerja",
    ],
    questions: [
      "Capaian jumlah Leads harian dibanding target yang ditetapkan",
      "Konsistensi mencapai target Leads di setiap hari kerja selama masa OJT",
      "Kualitas Leads yang diperoleh (kesesuaian dengan kriteria calon konsumen)",
      "Ketepatan waktu pencatatan/pelaporan Leads harian",
    ],
  },
  {
    name: "2. Keterampilan Teknis Sales",
    weight: 0.2,
    kpi: "KPI: Penawaran, follow up, dan closing berjalan efektif",
    questions: [
      "Praktik teknik penawaran ke calon konsumen (online maupun offline)",
      "Ketekunan dan kualitas follow up ke calon konsumen",
      "Penerapan teknik closing hingga transaksi terjadi",
    ],
  },
  {
    name: "3. Penguasaan SOP & Sistem",
    weight: 0.15,
    kpi: "KPI: Update CRM tepat waktu, dokumen tertib, paham serah terima unit",
    questions: [
      "Kedisiplinan update data di CRM (leads, visit, status booking)",
      "Kecepatan memahami materi atau SOP baru",
      "Konsistensi penerapan SOP dalam pekerjaan sehari-hari",
      "Kelancaran menggunakan sistem/tools/aplikasi yang diperkenalkan perusahaan",
    ],
  },
  {
    name: "4. Sikap Kerja & Komunikasi",
    weight: 0.15,
    kpi: "KPI: Komunikasi efektif, integritas, dan inisiatif mencari leads",
    questions: [
      "Cara berkomunikasi dengan konsumen (profesional & persuasif)",
      "Integritas dalam bekerja (kejujuran data, komitmen ke konsumen)",
      "Inisiatif mencari leads baru di luar yang diberikan perusahaan",
      "Rasa tanggung jawab terhadap tugas yang diberikan",
      "Kolaborasi aktif dalam tim",
    ],
  },
  {
    name: "5. Kehadiran & Disiplin",
    weight: 0.1,
    kpi: "KPI: Kehadiran shift sesuai jadwal",
    questions: [
      "Kehadiran harian sesuai jadwal shift yang ditetapkan",
      "Ketepatan waktu memulai dan mengakhiri shift",
    ],
  },
];

export const TOTAL_QUESTIONS = PARAMS.reduce((sum, p) => sum + p.questions.length, 0);

export const KATEGORI_OPTIONS = [
  { value: "90-100", label: "90–100 (Sangat Memuaskan) — siap bekerja mandiri penuh", min: 90 },
  { value: "80-89", label: "80–89 (Memuaskan) — siap bekerja mandiri dengan monitoring ringan", min: 80 },
  { value: "70-79", label: "70–79 (Cukup) — perlu bimbingan & coaching tambahan intensif", min: 70 },
  { value: "<70", label: "<70 (Belum Memenuhi) — perlu coaching intensif / evaluasi ulang target", min: 0 },
];

export function categoryFor(score100) {
  return KATEGORI_OPTIONS.find((c) => score100 >= c.min) || KATEGORI_OPTIONS[KATEGORI_OPTIONS.length - 1];
}

export const REKOMENDASI_LABELS = {
  lanjut: "Lanjut",
  "tidak-lanjut": "Tidak Lanjut",
};

export const PERIODE_OPTIONS = [
  "Evaluasi OJT — Minggu ke-1",
  "Evaluasi OJT — Minggu ke-2",
  "Evaluasi OJT — Minggu ke-3",
  "Evaluasi OJT — Minggu ke-4",
  "Evaluasi Akhir Masa OJT",
];

export const DIVISI_OPTIONS = ["Sales (GDC)", "Sales (NGT)"];
