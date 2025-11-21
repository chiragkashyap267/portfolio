// app/api/admin-check/route.ts
export async function OPTIONS() {
  // respond to preflight
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-admin-pass",
    },
  });
}

export async function POST(req: Request) {
  try {
    // allow either header or JSON body
    const headerPass = req.headers.get("x-admin-pass") || "";
    let bodyPass = "";
    try {
      const body = await req.json();
      bodyPass = body?.password || "";
    } catch (e) {
      // ignore parse errors — body may be empty
    }
    const pass = headerPass || bodyPass || "";

    if (!process.env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Server admin password not configured" }), { status: 500 });
    }

    if (pass === process.env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500 });
  }
}
