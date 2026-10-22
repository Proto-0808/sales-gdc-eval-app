"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { REKOMENDASI_LABELS } from "../../lib/params";

function categoryBadgeClass(kategori) {
  return kategori === "<70" || kategori === "70-79" ? "badge-cat warn" : "badge-cat";
}

function escapeCsv(v) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

export default function RekapPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastLoaded, setLastLoaded] = useState(null);

  async function loadRekap() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rekap", { cache: "no-store" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Gagal memuat data.");
      const rows = (data.rows || []).slice().sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
      setRecords(rows);
      setLastLoaded(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRekap();
  }, []);

  function exportCsv() {
    if (!records.length) {
      alert("Belum ada data untuk diekspor.");
      return;
    }
    const headers = ["Nama Sales", "Divisi", "Periode", "Manager", "Skor", "Kategori", "Rekomendasi", "Catatan", "Waktu Isi"];
    const rows = records.map((r) => [
      r.namaPeserta,
      r.divisi,
      r.periode,
      r.namaMentor,
      r.skor,
      r.kategori,
      REKOMENDASI_LABELS[r.rekomendasi] || r.rekomendasi,
      (r.catatan || "").replace(/\n/g, " "),
      r.waktu,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rekap-evaluasi-sales-gdc-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="sheet">
      <header className="masthead">
        <div className="eyebrow">Praja Sakti Group · GDC · Formulir Internal</div>
        <h1>Rekap Evaluasi Sales GDC</h1>
        <p className="sub">Seluruh evaluasi yang sudah disimpan Manager, diambil langsung dari Google Sheets.</p>
        <nav className="nav-row">
          <Link href="/">← Kembali ke Formulir</Link>
        </nav>
      </header>

      <section className="block" style={{ marginTop: 26 }}>
        <div className="block-head">
          <span className="numeral">✓</span>
          <h2>Rekap Seluruh Evaluasi</h2>
        </div>
        <div className="rekap-toolbar">
          <div className="rekap-count">
            {loading ? "Memuat data…" : error ? "Gagal memuat" : `${records.length} evaluasi tersimpan`}
          </div>
          <div className="rekap-actions">
            <button className="ghost-btn" onClick={loadRekap}>
              Muat Ulang
            </button>
            <button className="ghost-btn" onClick={exportCsv}>
              Ekspor CSV
            </button>
          </div>
        </div>

        <div className="grid-wrap rekap-wrap">
          <table className="rekap-table">
            <thead>
              <tr>
                <th>Sales</th>
                <th>Divisi</th>
                <th>Periode</th>
                <th>Manager</th>
                <th>Skor</th>
                <th>Kategori</th>
                <th>Rekomendasi</th>
                <th>Catatan</th>
                <th>Waktu Isi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="rekap-empty">
                    Memuat data…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="rekap-empty">
                    Gagal memuat data: {error}. Coba klik &quot;Muat Ulang&quot;.
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="rekap-empty">
                    Belum ada evaluasi yang tersimpan. Isian dari halaman Formulir akan muncul di sini.
                  </td>
                </tr>
              ) : (
                records.map((r, i) => (
                  <tr key={i}>
                    <td>{r.namaPeserta}</td>
                    <td>{r.divisi}</td>
                    <td>{r.periode}</td>
                    <td>{r.namaMentor}</td>
                    <td className="rekap-score">{r.skor}</td>
                    <td>
                      <span className={categoryBadgeClass(r.kategori)}>{r.kategori}</span>
                    </td>
                    <td>{REKOMENDASI_LABELS[r.rekomendasi] || r.rekomendasi}</td>
                    <td className="rekap-note">{r.catatan || "—"}</td>
                    <td>{r.waktu ? new Date(r.waktu).toLocaleString("id-ID") : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="foot">
        <span>Data diambil langsung dari Google Sheets internal</span>
        <span>{lastLoaded ? `Terakhir dimuat: ${lastLoaded.toLocaleString("id-ID")}` : ""}</span>
      </footer>
    </div>
  );
}
