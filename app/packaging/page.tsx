import fs from "fs";
import path from "path";
import Gallery from "../component/Gallery";

export default function PackagingPage() {
  const filePath = path.join(process.cwd(), "data", "uploads.json");
  const raw = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "[]";
  const data = JSON.parse(raw);
  const items = data.filter((item: any) => item.category === "packaging");
  return <Gallery title="Packaging" description="Creative designs for product packaging and brand visuals." items={items} />;
}
