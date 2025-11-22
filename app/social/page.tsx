"use client";

import { useEffect, useState } from "react";
import Gallery from "../component/Gallery";

export default function SocialPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/uploads?category=social", { cache: "no-store" });

        if (!res.ok) {
          console.error("Failed to fetch social media items:", await res.text());
          return;
        }

        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error("Error loading social media items:", error);
      }
    }

    load();
  }, []);

  return (
    <Gallery
      title="Social Media"
      description="Social media creatives designed to boost engagement."
      items={items}
    />
  );
}
