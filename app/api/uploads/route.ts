// app/api/uploads/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

const VALID_CATEGORIES = [
  "packaging",
  "thumbnails",
  "social",
  "infographics",
  "videos",
  "flyers",
];

function deriveCategory(r: any): string {
  let category: string | null = null;

  // 1) If we stored context.category, prefer that
  if (r.context?.custom?.category) {
    category = String(r.context.custom.category).toLowerCase();
  }

  // 2) Try from folder: "portfolio/thumbnails"
  if (!category && r.folder && typeof r.folder === "string") {
    const parts = r.folder.split("/"); // e.g. ["portfolio", "thumbnails"]
    if (parts[0] === "portfolio" && parts[1]) {
      category = parts[1].toLowerCase();
    }
  }

  // 3) Fallback from public_id: "portfolio/thumbnails/abc123"
  if (!category && typeof r.public_id === "string" && r.public_id.startsWith("portfolio/")) {
    const parts = r.public_id.split("/");
    if (parts.length >= 3) {
      category = parts[1].toLowerCase(); // "thumbnails"
    }
  }

  // 4) If still not valid, mark as uncategorized
  if (!category || !VALID_CATEGORIES.includes(category)) {
    category = "uncategorized";
  }

  return category;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryFilter = searchParams.get("category");

    let expression = "folder:portfolio/*";
    if (categoryFilter && VALID_CATEGORIES.includes(categoryFilter)) {
      // Only items in that category folder
      expression = `folder:portfolio/${categoryFilter}`;
    }

    const result: any = await cloudinary.search
      .expression(expression)
      .sort_by("created_at", "desc")
      .max_results(200)
      .execute();

    const items = result.resources.map((r: any) => ({
      public_id: r.public_id,
      url: r.secure_url,
      createdAt: r.created_at,
      category: deriveCategory(r),
    }));

    return NextResponse.json(items, { status: 200 });
  } catch (err: any) {
    console.error("uploads list error:", err);
    return NextResponse.json(
      { error: "Failed to load uploads", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
