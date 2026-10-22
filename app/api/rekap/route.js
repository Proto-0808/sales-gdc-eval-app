export async function GET() {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const secret = process.env.GOOGLE_SCRIPT_SECRET;

  if (!scriptUrl) {
    return Response.json(
      { ok: false, error: "GOOGLE_SCRIPT_URL belum diatur di server (env var Vercel)." },
      { status: 500 }
    );
  }

  try {
    const url = `${scriptUrl}?secret=${encodeURIComponent(secret || "")}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    if (!data.ok) {
      return Response.json({ ok: false, error: data.error || "Gagal memuat data." }, { status: 502 });
    }
    return Response.json({ ok: true, rows: data.rows || [] });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
