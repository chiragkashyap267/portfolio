"use client";

import { useEffect, useState } from "react";
import Gallery from "../component/Gallery";

export default function FlyersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/uploads?category=flyers", { cache: "no-store" });

        if (!res.ok) {
          console.error("Failed to fetch flyers:", await res.text());
          return;
        }

        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error("Error loading flyers:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <Gallery
      title="Flyers"
      description="Flyers, brochures and print-ready promotional material."
      items={items}
    />
  );
}
