// app/api/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

function getPublicIdFromUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    // e.g. /image/upload/v123/portfolio/thumbnails/abc123.jpg
    const parts = u.pathname.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    // skip "upload" and version "v123"
    const publicIdParts = parts.slice(uploadIndex + 2);
    const publicIdWithExt = publicIdParts.join("/");

    const dotIndex = publicIdWithExt.lastIndexOf(".");
    return dotIndex === -1
      ? publicIdWithExt
      : publicIdWithExt.substring(0, dotIndex);
  } catch {
    return null;
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const adminPass = req.headers.get("x-admin-pass") || "";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Server admin password not configured" },
        { status: 500 }
      );
    }

    if (adminPass !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const bodyPublicId = body?.public_id as string | undefined;
    const bodyUrl = body?.url as string | undefined;

    // Prefer explicit public_id, otherwise derive from URL
    let id = bodyPublicId || getPublicIdFromUrl(bodyUrl);
    if (!id) {
      return NextResponse.json(
        { error: "No public_id or url provided to delete" },
        { status: 400 }
      );
    }

    // Guess resource type for Cloudinary
    const isVideo =
      bodyUrl && /\.(mp4|webm|mov|mkv)$/i.test(bodyUrl) ? "video" : "image";

    const result: any = await cloudinary.uploader.destroy(id, {
      resource_type: isVideo,
    });

    if (result.result !== "ok" && result.result !== "not_found") {
      return NextResponse.json(
        { error: "Cloudinary delete failed", details: result },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: "Delete failed", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
