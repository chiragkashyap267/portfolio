// app/api/upload/route.ts
import { v2 as cloudinary } from "cloudinary";
const streamifier = require("streamifier");
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const adminPass = req.headers.get("x-admin-pass") || "";
  if (adminPass !== process.env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "uncategorized";

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // upload to cloudinary under portfolio/<category>
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `portfolio/${category}`, resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    // Save metadata to data/uploads.json
    try {
      const dataPath = path.join(process.cwd(), "data", "uploads.json");
      let arr: any[] = [];
      if (fs.existsSync(dataPath)) {
        try {
          arr = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        } catch (e) {
          arr = [];
        }
      }

      arr.unshift({
        url: result.secure_url || result.url,
        public_id: result.public_id,
        category,
        createdAt: new Date().toISOString(),
        bytes: result.bytes ?? null,
        resource_type: result.resource_type ?? null,
      });

      fs.mkdirSync(path.dirname(dataPath), { recursive: true });
      fs.writeFileSync(dataPath, JSON.stringify(arr, null, 2));
    } catch (err: any) {
      console.error("Failed to save uploads.json:", err.message);
    }

    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
