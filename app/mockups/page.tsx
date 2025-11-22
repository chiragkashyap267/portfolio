"use client";

import { useEffect, useState } from "react";
import Gallery from "../component/Gallery";

export default function MockupsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/uploads?category=mockups", {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Failed to fetch mockups:", await res.text());
          return;
        }

        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error loading mockups:", err);
      }
    }

    load();
  }, []);

  return (
    <Gallery
      title="Mockups"
      description="Product and brand mockups that bring designs to life in real-world scenes."
      items={items}
    />
  );
}
