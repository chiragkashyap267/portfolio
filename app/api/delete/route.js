// app/api/delete/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

type ReqBody = {
  public_id?: string;
  url?: string;
};

export async function DELETE(req: Request) {
  try {
    // admin auth: check header against env ADMIN_PASSWORD
    const adminPassHeader = req.headers.get("x-admin-pass") || "";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
    if (!ADMIN_PASSWORD || adminPassHeader !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ReqBody = await req.json();
    if (!body?.public_id && !body?.url) {
      return NextResponse.json({ error: "Missing public_id or url" }, { status: 400 });
    }

    // remove from data/uploads.json
    const dataPath = path.join(process.cwd(), "data", "uploads.json");
    let arr: any[] = [];
    if (fs.existsSync(dataPath)) {
      try {
        arr = JSON.parse(fs.readFileSync(dataPath, "utf-8") || "[]");
      } catch (e) {
        arr = [];
      }
    }

    const beforeLen = arr.length;
    const filtered = arr.filter((it) => {
      if (body.public_id && it.public_id === body.public_id) return false;
      if (body.url && it.url === body.url) return false;
      return true;
    });

    // write back
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(filtered, null, 2));

    // attempt Cloudinary delete if public_id is present and credentials exist
    if (body.public_id && process.env.CLOUDINARY_URL) {
      try {
        // lazy import cloudinary to avoid requiring it if not used
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const cloudinary = require("cloudinary").v2;
        // cloudinary config read from CLOUDINARY_URL automatically
        await cloudinary.uploader.destroy(body.public_id, { invalidate: true, resource_type: "image" }).catch((err: any) => {
          // try video resource type if image delete fails
          return cloudinary.uploader.destroy(body.public_id, { invalidate: true, resource_type: "video" });
        });
      } catch (e) {
        // log but do not fail deletion
        console.error("Cloudinary delete failed:", e);
      }
    }

    const removedCount = beforeLen - filtered.length;
    return NextResponse.json({ ok: true, removed: removedCount > 0 ? (body.public_id || body.url) : null });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
