"use client";

import { useEffect, useState } from "react";
import Gallery from "../component/Gallery";

export default function PackagingPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/uploads?category=packaging", { cache: "no-store" });

        if (!res.ok) {
          console.error("Failed to fetch packaging items:", await res.text());
          return;
        }

        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error("Error loading packaging items:", error);
      }
    }

    load();
  }, []);

  return (
    <Gallery
      title="Packaging"
      description="Creative designs for product packaging and brand visuals."
      items={items}
    />
  );
}
