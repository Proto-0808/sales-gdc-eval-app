"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  PARAMS,
  TOTAL_QUESTIONS,
  KATEGORI_OPTIONS,
  categoryFor,
  PERIODE_OPTIONS,
  DIVISI_OPTIONS,
} from "../lib/params";

export default function FormPage() {
  const [namaPeserta, setNamaPeserta] = useState("");
  const [divisi, setDivisi] = useState("Sales (GDC)");
  const [periode, setPeriode] = useState("");
  const [namaMentor, setNamaMentor] = useState("");
  const [answers, setAnswers] = useState({}); // key `${gIdx}_${qIdx}` -> 1..5
  const [kategori, setKategori] = useState("");
  const [kategoriTouched, setKategoriTouched] = useState(false);
  const [rekomendasi, setRekomendasi] = useState("");
  const [catatan, setCatatan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const filled = Object.keys(answers).length;

  const { weightedSum, weightFilled } = useMemo(() => {
    let sum = 0;
    let wf = 0;
    PARAMS.forEach((p, gIdx) => {
      const subWeight = p.weight / p.questions.length;
      p.questions.forEach((q, qIdx) => {
        const v = answers[`${gIdx}_${qIdx}`];
        if (v) {
          sum += Number(v) * subWeight;
          wf += subWeight;
        }
      });
    });
    return { weightedSum: sum, weightFilled: wf };
  }, [answers]);

  const isComplete = filled === TOTAL_QUESTIONS;
  const projected100 = weightFilled > 0 ? (weightedSum / weightFilled) * 20 : 0;
  const score100 = isComplete ? weightedSum * 20 : projected100;
  const autoCat = filled > 0 ? categoryFor(score100) : null;

  // Auto-select kategori once complete, unless the user manually overrode it.
  const effectiveKategori =
    isComplete && !kategoriTouched && autoCat ? autoCat.value : kategori;

  function setAnswer(gIdx, qIdx, value) {
    setAnswers((prev) => ({ ...prev, [`${gIdx}_${qIdx}`]: value }));
  }

  function handleReset() {
    if (!confirm("Kosongkan seluruh isian formulir?")) return;
    setNamaPeserta("");
    setDivisi("Sales (GDC)");
    setPeriode("");
    setNamaMentor("");
    setAnswers({});
    setKategori("");
    setKategoriTouched(false);
    setRekomendasi("");
    setCatatan("");
    setStatusMsg("");
    setErrorMsg("");
  }

  async function handleSubmit() {
    setErrorMsg("");
    if (!namaPeserta.trim()) return setErrorMsg("Mohon lengkapi: Nama Lengkap Sales");
    if (!divisi) return setErrorMsg("Mohon lengkapi: Divisi / Departemen Kerja");
    if (!periode) return setErrorMsg("Mohon lengkapi: Periode Evaluasi");
    if (!namaMentor.trim()) return setErrorMsg("Mohon lengkapi: Nama Manager / Atasan Langsung");
    if (filled < TOTAL_QUESTIONS) {
      return setErrorMsg(
        `Mohon lengkapi seluruh ${TOTAL_QUESTIONS} pertanyaan pada Matriks Penilaian sebelum menyelesaikan evaluasi.`
      );
    }
    if (!effectiveKategori) return setErrorMsg("Mohon pilih Estimasi Kategori Nilai Akhir Kumulatif.");
    if (!rekomendasi) return setErrorMsg("Mohon pilih Rekomendasi Tindak Lanjut dari Manager.");

    setSubmitting(true);
    try {
      const record = {
        namaPeserta: namaPeserta.trim(),
        divisi,
        periode,
        namaMentor: namaMentor.trim(),
        skor: (weightedSum * 20).toFixed(1),
        kategori: effectiveKategori,
        rekomendasi,
        catatan: catatan.trim(),
      };
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Gagal menyimpan, coba lagi.");
      setStatusMsg("✓ Evaluasi tersimpan");
      setTimeout(() => setStatusMsg(""), 4000);
      handleReset();
    } catch (err) {
      setErrorMsg("Gagal menyimpan evaluasi: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="sheet">
      <header className="masthead">
        <div className="eyebrow">Praja Sakti Group · GDC · Formulir Internal</div>
        <h1>Evaluasi Kinerja Sales GDC</h1>
        <p className="sub">
          Diisi oleh Manager / Atasan Langsung setiap periode evaluasi Sales GDC. Skor akhir
          dihitung otomatis berdasarkan bobot 5 aspek penilaian sesuai operasional aktual Sales
          GDC.
        </p>
        <nav className="nav-row">
          <Link href="/rekap">Lihat Rekap Evaluasi →</Link>
        </nav>
      </header>

      <div className="card">
        <div className="legend">
          <span><b>5</b> Sangat Baik — melampaui ekspektasi</span>
          <span><b>4</b> Baik — sesuai ekspektasi</span>
          <span><b>3</b> Cukup — bimbingan ringan</span>
          <span><b>2</b> Kurang — arahan aktif</span>
          <span><b>1</b> Sangat Kurang — belum menguasai dasar</span>
        </div>
        <p className="hint" style={{ margin: "12px 0 0" }}>
          Catatan: hasil evaluasi tersimpan langsung ke Google Sheets internal, dapat dilihat di
          halaman &quot;Rekap Evaluasi&quot;.
        </p>
      </div>

      {/* BAGIAN I */}
      <section className="block">
        <div className="block-head">
          <span className="numeral">I</span>
          <h2>Identitas &amp; Informasi Umum</h2>
        </div>

        <div className="field">
          <label className="field-label">
            Nama Lengkap Sales<span className="req">*</span>
          </label>
          <input
            type="text"
            placeholder="Tuliskan nama lengkap staf sales"
            value={namaPeserta}
            onChange={(e) => setNamaPeserta(e.target.value)}
          />
        </div>

        <div className="two-col">
          <div className="field">
            <label className="field-label">
              Divisi / Departemen Kerja<span className="req">*</span>
            </label>
            <select value={divisi} onChange={(e) => setDivisi(e.target.value)}>
              <option value="">Pilih divisi</option>
              {DIVISI_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">
              Periode Evaluasi<span className="req">*</span>
            </label>
            <select value={periode} onChange={(e) => setPeriode(e.target.value)}>
              <option value="">Pilih periode</option>
              {PERIODE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field-label">
            Nama Manager / Atasan Langsung<span className="req">*</span>
          </label>
          <input
            type="text"
            placeholder="Nama Anda selaku penilai"
            value={namaMentor}
            onChange={(e) => setNamaMentor(e.target.value)}
          />
        </div>
      </section>

      {/* BAGIAN II */}
      <section className="block">
        <div className="block-head">
          <span className="numeral">II</span>
          <h2>Matriks Penilaian Kinerja Sales</h2>
        </div>
        <p className="hint">
          5 aspek penilaian berdasarkan data CRM dan pengamatan langsung Manager, dengan total{" "}
          {TOTAL_QUESTIONS} pertanyaan turunan. Pilih satu nilai (1–5) untuk setiap baris
          berdasarkan performa riil Sales. Bobot totalnya 100%.
        </p>

        <div className="grid-wrap">
          <table className="eval-grid">
            <thead>
              <tr>
                <th className="param-col">Parameter</th>
                <th className="param-col">Pertanyaan</th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
              </tr>
            </thead>
            <tbody>
              {PARAMS.map((p, gIdx) =>
                p.questions.map((q, qIdx) => (
                  <tr key={`${gIdx}_${qIdx}`} className={qIdx === p.questions.length - 1 ? "group-end-row" : ""}>
                    {qIdx === 0 && (
                      <td className="param-cell group-first" rowSpan={p.questions.length}>
                        <span className="param-name">{p.name}</span>
                        <span className="param-kpi">{p.kpi}</span>
                        <span className="weight-tag">Bobot {Math.round(p.weight * 100)}%</span>
                      </td>
                    )}
                    <td className="param-cell sub-question-cell">
                      <span className="sub-q-text">
                        {qIdx + 1}. {q}
                      </span>
                      {p.notes && p.notes[qIdx] && (
                        <span className="sub-q-note">{p.notes[qIdx]}</span>
                      )}
                    </td>
                    {[1, 2, 3, 4, 5].map((v) => (
                      <td className="radio-cell" key={v}>
                        <input
                          type="radio"
                          name={`q${gIdx}_${qIdx}`}
                          value={v}
                          checked={answers[`${gIdx}_${qIdx}`] === v}
                          title={p.scaleHints ? p.scaleHints[v - 1] : undefined}
                          onChange={() => setAnswer(gIdx, qIdx, v)}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ringkasan skor otomatis */}
      <div className="score-panel">
        <div className="score-num">{filled === 0 ? "–" : score100.toFixed(1)}</div>
        <div className="score-meta">
          <div className="label">Estimasi skor akhir kumulatif</div>
          <div className="score-category">
            {filled === 0
              ? "Belum ada data — lengkapi matriks di atas"
              : isComplete
              ? autoCat.label
              : `${autoCat.label} (proyeksi sementara)`}
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${Math.min(100, score100)}%` }} />
          </div>
          <div className="progress-note">
            {filled} dari {TOTAL_QUESTIONS} pertanyaan dinilai
          </div>
        </div>
      </div>

      {/* BAGIAN III */}
      <section className="block">
        <div className="block-head">
          <span className="numeral">III</span>
          <h2>Rekomendasi Hasil Akhir &amp; Catatan Manager</h2>
        </div>

        <div className="field">
          <label className="field-label">
            Estimasi Kategori Nilai Akhir Kumulatif<span className="req">*</span>
          </label>
          <div className="hint">Terisi otomatis mengikuti skor di atas, namun dapat disesuaikan secara manual.</div>
          <div className="radio-row">
            {KATEGORI_OPTIONS.map((opt) => (
              <label className="radio-option" key={opt.value}>
                <input
                  type="radio"
                  name="kategori"
                  value={opt.value}
                  checked={effectiveKategori === opt.value}
                  onChange={() => {
                    setKategori(opt.value);
                    setKategoriTouched(true);
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field-label">
            Rekomendasi Tindak Lanjut dari Manager<span className="req">*</span>
          </label>
          <div className="radio-row">
            <label className="radio-option">
              <input
                type="radio"
                name="rekomendasi"
                value="lanjut"
                checked={rekomendasi === "lanjut"}
                onChange={() => setRekomendasi("lanjut")}
              />
              Lanjut
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="rekomendasi"
                value="tidak-lanjut"
                checked={rekomendasi === "tidak-lanjut"}
                onChange={() => setRekomendasi("tidak-lanjut")}
              />
              Tidak Lanjut
            </label>
          </div>
        </div>

        <div className="field">
          <label className="field-label">Catatan Khusus, Kekuatan Utama, &amp; Area Pengembangan</label>
          <textarea
            placeholder="Tuliskan masukan spesifik untuk membantu pengembangan kinerja Sales ke depannya."
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
        </div>
      </section>

      <div className="actions">
        <button className="submit-btn" disabled={submitting} onClick={handleSubmit}>
          {submitting ? "Menyimpan…" : "Selesaikan Evaluasi"}
        </button>
        <button className="reset-btn" onClick={handleReset}>
          Kosongkan Formulir
        </button>
        {statusMsg && <span className="status-msg show">{statusMsg}</span>}
        {errorMsg && <span className="error-msg">{errorMsg}</span>}
      </div>

      <footer className="foot">
        <span>Praja Sakti Group — Formulir Evaluasi Sales GDC</span>
        <span>Skala 1–5 · Bobot total 100%</span>
      </footer>
    </div>
  );
}
