// app/api/delete/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

type ReqBody = { public_id?: string; url?: string };

export async function DELETE(req: Request) {
  try {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
    const headerPass = req.headers.get("x-admin-pass") || "";

    if (!ADMIN_PASSWORD || headerPass !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ReqBody = await req.json().catch(() => ({}));
    if (!body?.public_id && !body?.url) {
      return NextResponse.json({ error: "Missing public_id or url" }, { status: 400 });
    }

    const dataPath = path.join(process.cwd(), "data", "uploads.json");
    let arr: any[] = [];
    if (fs.existsSync(dataPath)) {
      try { arr = JSON.parse(fs.readFileSync(dataPath, "utf-8") || "[]"); } catch { arr = []; }
    }

    const before = arr.length;
    const filtered = arr.filter((it) => {
      if (body.public_id && it.public_id === body.public_id) return false;
      if (body.url && it.url === body.url) return false;
      return true;
    });

    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(filtered, null, 2));

    // optional Cloudinary deletion (try/catch)
    if (body.public_id && process.env.CLOUDINARY_URL) {
      try {
        const cloudinary = require("cloudinary").v2;
        await cloudinary.uploader.destroy(body.public_id, { invalidate: true, resource_type: "image" })
          .catch(() => cloudinary.uploader.destroy(body.public_id, { invalidate: true, resource_type: "video" }));
      } catch (e) {
        console.error("Cloudinary delete error:", e);
      }
    }

    const removed = before - filtered.length;
    return NextResponse.json({ ok: true, removed: removed > 0 ? (body.public_id || body.url) : null });
  } catch (err: any) {
    console.error("DELETE /api/delete error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
