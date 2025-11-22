// app/api/uploads/route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";
// Optional: make sure it's always fresh
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const categoryParam = url.searchParams.get("category");
    const category = categoryParam ? categoryParam.trim().toLowerCase() : null;

    // 🔎 Base expression: all portfolio assets
    // We tagged uploads with ["portfolio", category] in upload route.
    let expression = 'tags=portfolio';

    // If a category is requested (mockups, thumbnails, etc.),
    // restrict to that tag as well.
    if (category) {
      expression = `tags=portfolio AND tags=${category}`;
    }

    const result: any = await (cloudinary as any).search
      .expression(expression)
      .sort_by("created_at", "desc")
      .max_results(200)
      .execute();

    const resources = result?.resources || [];

    const items = resources.map((r: any) => {
      // Try to recover category from context or tags,
      // fallback to the query category or "uncategorized"
      let detectedCategory: string | undefined =
        (r.context && r.context.category) ||
        (Array.isArray(r.tags)
          ? r.tags.find((t: string) =>
              [
                "packaging",
                "thumbnails",
                "social",
                "infographics",
                "videos",
                "flyers",
                "mockups",
              ].includes(t.toLowerCase())
            )
          : undefined) ||
        undefined;

      return {
        url: r.secure_url,
        public_id: r.public_id,
        category: detectedCategory || category || "uncategorized",
        createdAt: r.created_at,
        resource_type: r.resource_type,
        format: r.format,
        width: r.width,
        height: r.height,
      };
    });

    // Extra safety: if a category was requested, filter again in JS
    const filtered = category
      ? items.filter(
          (it : any) => it.category && it.category.toLowerCase() === category
        )
      : items;

    return NextResponse.json(filtered, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/uploads error:", err);
    return NextResponse.json(
      {
        error: "Failed to load uploads",
        details: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
