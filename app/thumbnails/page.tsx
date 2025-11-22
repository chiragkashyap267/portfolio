"use client";

import { useEffect, useState } from "react";
import Gallery from "../component/Gallery";

export default function ThumbnailsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // fetch only thumbnails from our Cloudinary-backed API
        const res = await fetch("/api/uploads?category=thumbnails");
        if (!res.ok) {
          console.error("Failed to fetch thumbnails:", await res.text());
          return;
        }
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching thumbnails:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 👇 style/layout stays inside Gallery – we only changed where items come from
  return (
    <Gallery
      title="Thumbnails"
      description="Eye-catching thumbnails and scroll-stopping visuals."
      items={items}
    />
  );
}
