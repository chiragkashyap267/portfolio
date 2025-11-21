// app/api/uploads/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "data", "uploads.json");

    if (!fs.existsSync(dataPath)) {
      return NextResponse.json([], { status: 200 });
    }

    const raw = fs.readFileSync(dataPath, "utf-8");
    const arr = JSON.parse(raw);

    return NextResponse.json(arr, { status: 200 });
  } catch (error: any) {
    console.error("uploads.json read error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
