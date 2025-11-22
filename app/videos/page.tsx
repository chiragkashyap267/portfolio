"use client";

import { useEffect, useState } from "react";
import Gallery from "../component/Gallery";

export default function VideosPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/uploads?category=videos", { cache: "no-store" });

        if (!res.ok) {
          console.error("Failed to fetch video items:", await res.text());
          return;
        }

        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error loading video items:", err);
      }
    }

    load();
  }, []);

  return (
    <Gallery
      title="Videos"
      description="Short-form videos, product ads, and motion graphics."
      items={items}
    />
  );
}
