// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

// we won't force-check categories here – we trust what comes from the admin select
function uploadToCloudinary(buffer: Buffer, category: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `portfolio/${category}`, // folder encodes the category
          resource_type: "auto",
          tags: ["portfolio", category],
          context: { category },
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
}

export async function POST(req: NextRequest) {
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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    let category = (formData.get("category") as string) || "uncategorized";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Just in case something weird comes, normalize to lowercase
    category = category.trim().toLowerCase();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: any = await uploadToCloudinary(buffer, category);

    return NextResponse.json({ result }, { status: 200 });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
