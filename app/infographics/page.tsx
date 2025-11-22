"use client";

import { useEffect, useState } from "react";
import Gallery from "../component/Gallery";

export default function InfographicsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/uploads?category=infographics", { cache: "no-store" });

        if (!res.ok) {
          console.error("Failed to fetch infographics:", await res.text());
          return;
        }

        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error("Error loading infographics:", error);
      }
    }

    load();
  }, []);

  return (
    <Gallery
      title="Infographics"
      description="Infographics, A+ content and detailed visuals."
      items={items}
    />
  );
}
