// app/component/Gallery.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Item = {
  url: string;
  public_id?: string;
  createdAt?: string;
  category?: string;
  [k: string]: any;
};

type Props = {
  title?: string;
  description?: string;
  items: Item[];
};

const PAGE_SIZE = 9;

export default function Gallery({ title = "Gallery", description = "", items }: Props) {
  const [allItems, setAllItems] = useState<Item[]>(items || []);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // apply sorting
  const sorted = useMemo(() => {
    const copy = [...allItems];
    copy.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
    return copy;
  }, [allItems, sortOrder]);

  // items currently shown
  const visible = useMemo(() => sorted.slice(0, displayCount), [sorted, displayCount]);

  useEffect(() => {
    // simulate short load for shimmer/fade-in
    setLoading(true);
    const t = setTimeout(() => {
      setAllItems(items || []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [items]);

  // infinite scroll (client-side): load more when near bottom
  useEffect(() => {
    function onScroll() {
      if (isFetchingMore || loading) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.bottom - viewportHeight < 300) {
        // near bottom
        if (displayCount < sorted.length) {
          setIsFetchingMore(true);
          setTimeout(() => {
            setDisplayCount((c) => Math.min(sorted.length, c + PAGE_SIZE));
            setIsFetchingMore(false);
          }, 600);
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [displayCount, sorted.length, isFetchingMore, loading]);

  // keyboard navigation for lightbox
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null ? null : Math.min(sorted.length - 1, i + 1)));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? null : Math.max(0, i - 1)));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, sorted.length]);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const isVideo = (url?: string) => !!url && /\.(mp4|webm|mov|ogg)$/i.test(url);

  return (
    <div className="min-h-screen bg-black pt-32 pb-16 px-6 relative animate-in fade-in duration-700" ref={containerRef}>
      {/* Background glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header area with tabs + sorting */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-white/10 pb-6">
          <div>
            <Link href="/" className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-4">
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Gallery</span>
            </h1>

            {description && <p className="text-slate-400 mt-3 max-w-2xl">{description}</p>}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* category tabs (linking to top-level category routes) */}
            <nav className="hidden sm:flex gap-2 bg-[#071018] px-2 py-2 rounded-lg border border-slate-800">
              <Link href="/packaging" className="px-3 py-1 text-sm text-slate-300 hover:text-white rounded">Packaging</Link>
              <Link href="/thumbnails" className="px-3 py-1 text-sm text-slate-300 hover:text-white rounded">Thumbnails</Link>
              <Link href="/social" className="px-3 py-1 text-sm text-slate-300 hover:text-white rounded">Social</Link>
              <Link href="/infographics" className="px-3 py-1 text-sm text-slate-300 hover:text-white rounded">Infographics</Link>
              <Link href="/videos" className="px-3 py-1 text-sm text-slate-300 hover:text-white rounded">Videos</Link>
              <Link href="/flyers" className="px-3 py-1 text-sm text-slate-300 hover:text-white rounded">Flyers</Link>
            </nav>

            {/* sort */}
            <div className="flex items-center gap-2 bg-[#071018] px-3 py-2 rounded-lg border border-slate-800">
              <label className="text-xs text-slate-400">Sort</label>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as any);
                  setDisplayCount(PAGE_SIZE); // reset view size to start
                }}
                className="bg-transparent text-sm outline-none ml-2"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {loading
            ? // skeleton shimmer placeholders
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="break-inside-avoid relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 animate-pulse h-48" />
              ))
            : visible.map((item, index) => {
                const globalIndex = index; // index within visible
                const staggerDelay = `${(index % PAGE_SIZE) * 60}ms`;
                return (
                  <div
                    key={item.public_id ?? index}
                    style={{ animationDelay: staggerDelay }}
                    className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10
                      hover:border-cyan-400 transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]
                      opacity-0 animate-staggered-fade"
                    onClick={() => openLightbox(sorted.indexOf(item))}
                  >
                    {/* Image or video */}
                    {isVideo(item.url) ? (
                      <video
                        src={item.url}
                        className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onMouseEnter={(e) => (e.currentTarget.play().catch(() => {}))}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.public_id || "Gallery item"}
                        className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    )}

                    {/* overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1">
                        {item.category || "Project"}
                      </span>
                      <h3 className="text-white font-bold text-lg">Portfolio Item</h3>
                      <div className="text-xs text-slate-400 mt-1">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</div>
                    </div>

                    {/* cyan flash overlay */}
                    <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-screen" />
                  </div>
                );
              })}
        </div>

        {/* loading more indicator */}
        <div className="mt-8 flex items-center justify-center">
          {isFetchingMore && (
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              Loading more...
            </div>
          )}
          {!isFetchingMore && displayCount < sorted.length && !loading && (
            <button
              onClick={() => setDisplayCount((c) => Math.min(sorted.length, c + PAGE_SIZE))}
              className="px-4 py-2 bg-cyan-400 text-black rounded"
            >
              Load more
            </button>
          )}
        </div>

        <div className="mt-20 flex justify-center border-t border-white/10 pt-10">
          <p className="text-slate-600 text-sm">End of Gallery</p>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6" onClick={closeLightbox}>
          <div className="max-w-4xl w-full max-h-full relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-3 right-3 text-slate-200 bg-black/50 px-3 py-1 rounded"
            >
              Close
            </button>

            <div
              className="w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideo(sorted[lightboxIndex].url) ? (
                <video src={sorted[lightboxIndex].url} controls autoPlay muted className="max-h-[80vh] w-auto" />
              ) : (
                <img src={sorted[lightboxIndex].url} className="max-h-[80vh] w-auto rounded" />
              )}
            </div>

            {/* prev/next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i === null ? null : Math.max(0, i - 1)));
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 px-3 py-2 rounded text-white"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i === null ? null : Math.min(sorted.length - 1, i + 1)));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 px-3 py-2 rounded text-white"
            >
              ›
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes staggeredFade {
          0% { opacity: 0; transform: translateY(8px) scale(0.995); }
          60% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-staggered-fade {
          animation-name: staggeredFade;
          animation-duration: 700ms;
          animation-fill-mode: forwards;
          will-change: opacity, transform;
        }
      `}</style>
    </div>
  );
}
