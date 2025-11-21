import fs from "fs";
import path from "path";
import Gallery from "../component/Gallery";

export default function VideosPage() {
  const filePath = path.join(process.cwd(), "data", "uploads.json");
  const raw = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "[]";
  const data = JSON.parse(raw);
  const items = data.filter((item: any) => item.category === "videos");
  return <Gallery title="Videos" description="Short-form videos, product ads, and motion graphics." items={items} />;
}
