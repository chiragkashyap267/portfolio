// app/admin/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { key: "packaging", label: "Product Packaging" },
  { key: "thumbnails", label: "Thumbnails" },
  { key: "social", label: "Social Media Posts" },
  { key: "infographics", label: "Infographics & A+ Content" },
  { key: "videos", label: "Videos" },
  { key: "flyers", label: "Brochure / Flyers" },
];

export default function AdminPage() {
  // LOCK / AUTH
  const [locked, setLocked] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  // UPLOADER STATE
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // MANAGE / RECENT
  const [recent, setRecent] = useState<any[]>([]);
  const [allUploads, setAllUploads] = useState<any[] | null>(null);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const dropRef = useRef<HTMLDivElement | null>(null);

  // On mount: check local admin flag
  useEffect(() => {
    const adminLs = typeof window !== "undefined" ? localStorage.getItem("adminLoggedIn") : null;
    if (adminLs === "1") {
      setLocked(false);
      // window.__adminPasswordForUpload should already be set by prior login flow
    }
  }, []);

  // fetch recent once unlocked
  useEffect(() => {
    if (!locked) fetchRecent();
  }, [locked]);

  // drag/drop visual
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.add("ring");
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove("ring");
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove("ring");
      const f = e.dataTransfer?.files?.[0];
      if (f) {
        setFile(f);
        setUploadedUrl(null);
      }
    };

    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  // toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // -------------------------
  // AUTH
  // -------------------------
  async function verifyPassword(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const txt = await res.text();
        let obj: any = {};
        try {
          obj = JSON.parse(txt);
        } catch {}
        setError(obj?.error || "Password incorrect");
        setChecking(false);
        return;
      }
      // success: store password in-memory and persistent flag
      (window as any).__adminPasswordForUpload = password;
      localStorage.setItem("adminLoggedIn", "1");
      // notify other tabs
      window.dispatchEvent(new Event("admin:change"));
      setLocked(false);
      setChecking(false);
      setPassword("");
      setToast("Admin unlocked");
      // fetch recent after unlocking
      fetchRecent();
    } catch (err: any) {
      setError(err.message || "Network error");
      setChecking(false);
    }
  }

  // logout / lock
  function lockAdmin() {
    setLocked(true);
    try {
      delete (window as any).__adminPasswordForUpload;
    } catch {}
    localStorage.removeItem("adminLoggedIn");
    window.dispatchEvent(new Event("admin:change"));
    setToast("Admin locked");
  }

  // -------------------------
  // UPLOADER
  // -------------------------
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setUploadedUrl(null);
  }

  function resetUploadForm() {
    setFile(null);
    setProgress(0);
    setUploadedUrl(null);
    setError(null);
  }

  function uploadFile() {
    if (!file) return setError("Choose a file first");
    setError(null);
    setUploading(true);
    setProgress(0);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", category);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true);

    const adminPass = (window as any).__adminPasswordForUpload;
    if (adminPass) {
      xhr.setRequestHeader("x-admin-pass", adminPass);
    } else {
      setUploading(false);
      setError("Admin session expired. Please unlock again.");
      return;
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = function () {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText);
          const url = json?.result?.secure_url || json?.result?.url || null;
          setUploadedUrl(url);
          setFile(null);
          fetchRecent(); // refresh recent list
          setToast("Upload completed");
        } catch {
          setError("Upload succeeded but server returned unexpected response.");
        }
      } else {
        try {
          const json = JSON.parse(xhr.responseText);
          setError(json?.error || `Upload failed (${xhr.status})`);
        } catch {
          setError(`Upload failed (${xhr.status})`);
        }
      }
    };

    xhr.onerror = function () {
      setUploading(false);
      setError("Network error during upload");
    };

    xhr.send(fd);
  }

  // -------------------------
  // MANAGE / DELETE
  // -------------------------
  async function fetchRecent() {
    try {
      const res = await fetch("/api/uploads");
      if (!res.ok) return;
      const arr = await res.json();
      setRecent(arr.slice(0, 8));
    } catch (e) {
      // ignore
    }
  }

  async function fetchAllUploads() {
    setLoadingUploads(true);
    try {
      const res = await fetch("/api/uploads");
      if (!res.ok) {
        setAllUploads(null);
        setLoadingUploads(false);
        return;
      }
      const arr = await res.json();
      setAllUploads(arr);
    } catch (e) {
      setAllUploads(null);
    } finally {
      setLoadingUploads(false);
    }
  }

  function adminHeaders() {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const adminPass = (window as any).__adminPasswordForUpload;
    if (adminPass) headers["x-admin-pass"] = adminPass;
    return headers;
  }

  // robust delete handler with logs & optimistic UI removal
  async function handleDelete(item: any) {
    const id = item.public_id || item.url;
    if (!id) {
      setToast("Item has no identifier");
      return;
    }
    if (!confirm("Delete this item? This will remove it from your uploads.json (and Cloudinary if configured).")) return;

    setDeletingIds((p) => [...p, id]);
    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
        headers: adminHeaders(),
        body: JSON.stringify({ public_id: item.public_id, url: item.url }),
      });

      const text = await res.text();
      console.log("DELETE /api/delete status:", res.status, "responseText:", text);

      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (e) {
        throw new Error(`Server returned non-JSON response (status ${res.status}). Check server logs.`);
      }

      if (!res.ok) {
        throw new Error(json?.error || json?.message || `Delete failed (status ${res.status})`);
      }

      // optimistic UI: remove from recent and allUploads
      setRecent((r) => r.filter((x) => (x.public_id || x.url) !== id));
      setAllUploads((a) => (a ? a.filter((x) => (x.public_id || x.url) !== id) : a));
      setToast("Deleted");
    } catch (err: any) {
      console.error("Delete error", err);
      setToast("Delete failed: " + (err.message || err));
    } finally {
      setDeletingIds((p) => p.filter((x) => x !== id));
    }
  }

  const groupedByCategory = (arr: any[] | null) => {
    if (!arr) return {};
    return arr.reduce((acc: Record<string, any[]>, it: any) => {
      const k = it.category || "uncategorized";
      if (!acc[k]) acc[k] = [];
      acc[k].push(it);
      return acc;
    }, {});
  };

  const grouped = groupedByCategory(allUploads);

  // -------------------------
  // UI
  // -------------------------
  return locked ? (
    // LOCKED VIEW
    <div className="min-h-screen bg-[#050506] flex items-center justify-center px-4">
      <div className="w-full max-w-md sm:max-w-xl bg-[#071018] border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Admin Access</h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-6">
          Enter your admin password to unlock the uploader & management tools.
        </p>

        <form onSubmit={verifyPassword} className="space-y-4">
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded bg-[#041018] border border-slate-800 focus:ring-2 focus:ring-cyan-400 outline-none text-white text-sm"
            autoComplete="new-password"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="submit"
              disabled={checking || !password}
              className="px-5 py-2.5 sm:py-3 bg-cyan-400 text-black rounded-md font-semibold text-sm disabled:opacity-60"
            >
              {checking ? "Checking…" : "Unlock Admin"}
            </button>

            <Link href="/" className="text-xs sm:text-sm text-slate-300 hover:text-white text-center">
              Back to site
            </Link>
          </div>

          {error && <div className="text-xs sm:text-sm text-red-400 mt-2">{error}</div>}
        </form>

        <div className="mt-6 text-[0.7rem] sm:text-xs text-slate-500">
          Tip: You only need to unlock once per session.
        </div>
      </div>
    </div>
  ) : (
    // UNLOCKED VIEW
    <div className="min-h-screen bg-[#050506] px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Admin dashboard</h1>
            <div className="text-xs sm:text-sm text-slate-400">
              Uploader & management for portfolio assets
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => {
                fetchAllUploads();
                setToast("Loading all uploads...");
              }}
              className="px-4 py-2 bg-[#061218] border border-slate-800 rounded-md text-xs sm:text-sm text-slate-200 hover:bg-[#071222]"
            >
              Manage uploads
            </button>

            <button
              onClick={lockAdmin}
              className="px-4 py-2 bg-[#071018] border border-slate-800 rounded-md text-xs sm:text-sm text-slate-200 hover:bg-[#081021]"
              title="Lock admin"
            >
              Lock
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* uploader */}
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-xl bg-[#071018] border border-slate-800">
            <div
              ref={dropRef}
              className="rounded-lg p-4 sm:p-6 border-2 border-dashed border-slate-800 bg-[#041018]"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <div className="text-sm text-slate-300">Upload image or video</div>
                      <div className="text-xs text-slate-500">
                        Supported: png, jpg, webp, mp4, mov
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 sm:text-right">Category</div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <label className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 bg-[#0f1720] border border-slate-700 rounded-md cursor-pointer text-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 3v12"
                          stroke="#9EEAFF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M8 7l4-4 4 4"
                          stroke="#9EEAFF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-slate-200">Choose file</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="px-4 py-3 bg-[#061218] border border-slate-800 rounded-md text-slate-200 text-sm w-full md:w-auto"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={uploadFile}
                      disabled={uploading || !file}
                      className="px-5 py-3 bg-cyan-400 text-black rounded-md font-semibold text-sm shadow hover:brightness-95 disabled:opacity-60 w-full md:w-auto"
                    >
                      {uploading ? `Uploading ${progress}%` : "Upload"}
                    </button>
                  </div>

                  {file && (
                    <div className="mt-4 flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-full sm:w-28 h-40 sm:h-20 rounded-md overflow-hidden bg-black/20 flex items-center justify-center border border-slate-800">
                        {file.type.startsWith("image") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                            alt="preview"
                          />
                        ) : (
                          <div className="text-xs text-slate-400">Video selected</div>
                        )}
                      </div>

                      <div className="flex-1 w-full">
                        <div className="font-medium text-slate-100 text-sm truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>

                        {uploading && (
                          <div className="mt-2 w-full bg-slate-800 rounded h-2 overflow-hidden">
                            <div
                              style={{ width: `${progress}%` }}
                              className="h-2 bg-cyan-400 transition-all"
                            />
                          </div>
                        )}

                        {uploadedUrl && (
                          <div className="mt-2 text-xs sm:text-sm">
                            Uploaded:{" "}
                            <a
                              href={uploadedUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-300 break-all"
                            >
                              {uploadedUrl}
                            </a>
                          </div>
                        )}

                        {error && (
                          <div className="text-xs sm:text-sm text-red-400 mt-2">{error}</div>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={resetUploadForm}
                            className="px-3 py-1.5 text-xs sm:text-sm bg-[#0b1220] border border-slate-800 rounded text-slate-200"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => {
                              if (!file) return setToast("No file to preview");
                              const blobUrl = URL.createObjectURL(file);
                              window.open(blobUrl, "_blank");
                            }}
                            className="px-3 py-1.5 text-xs sm:text-sm bg-[#0b1220] border border-slate-800 rounded text-slate-200"
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes block: full-width on mobile, sidebar on large */}
                <div className="w-full lg:w-48 text-xs sm:text-sm text-slate-400">
                  <div className="font-medium mb-2">Notes</div>
                  <ul className="list-disc pl-4 space-y-1 text-[0.7rem] sm:text-xs">
                    <li>High-res images recommended</li>
                    <li>Videos: mp4/webm (keep under 50MB for quick upload)</li>
                    <li>Set the correct category — used by gallery routes</li>
                  </ul>

                  <div className="mt-4">
                    <button
                      onClick={() => {
                        fetchRecent();
                        setToast("Refreshing recent uploads");
                      }}
                      className="w-full px-3 py-2 bg-[#061218] border border-slate-800 rounded text-xs sm:text-sm text-slate-200"
                    >
                      Refresh recent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: recent uploads */}
          <aside className="p-5 sm:p-6 rounded-xl bg-[#071018] border border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-white text-sm sm:text-base">
                Recent uploads
              </h3>
              <button
                onClick={() => {
                  setToast("Cleared recent preview list");
                  setRecent([]);
                }}
                className="text-[0.7rem] sm:text-xs text-slate-400"
              >
                Clear
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {recent.length === 0 && (
                <div className="text-xs sm:text-sm text-slate-400">No uploads yet.</div>
              )}
              {recent.map((r, i) => {
                const id = r.public_id || r.url || i;
                const deleting = deletingIds.includes(id);
                return (
                  <div key={id} className="recent-row flex items-start gap-3 w-full">
                    {/* THUMB */}
                    <div className="w-14 h-14 rounded overflow-hidden bg-black/40 flex items-center justify-center flex-shrink-0 border border-slate-800">
                      {r.url?.match(/\.(mp4|webm|mov)$/i) ? (
                        <div className="text-[0.65rem] text-slate-400">Video</div>
                      ) : (
                        <img
                          src={r.url}
                          className="w-full h-full object-cover"
                          alt="thumb"
                        />
                      )}
                    </div>

                    {/* MIDDLE: content */}
                    <div className="flex-1 min-w-0 text-xs sm:text-sm">
                      <div className="font-medium text-slate-100 truncate">
                        {r.public_id}
                      </div>
                      <div className="text-[0.65rem] sm:text-xs text-slate-400">
                        {new Date(r.createdAt).toLocaleString()}
                      </div>
                      <div className="text-[0.7rem] sm:text-xs text-cyan-400 mt-1">
                        {r.category}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="recent-actions ml-1 flex-shrink-0 flex flex-col gap-1">
                      <button
                        onClick={() => window.open(r.url, "_blank")}
                        className="text-[0.65rem] sm:text-xs px-2 py-1 bg-[#061218] border border-slate-800 rounded text-slate-200 whitespace-nowrap"
                      >
                        Open
                      </button>

                      <button
                        onClick={() => handleDelete(r)}
                        disabled={deleting}
                        className={`text-[0.65rem] sm:text-xs px-2 py-1 rounded ${
                          deleting
                            ? "bg-red-600/60 text-white"
                            : "bg-red-600 text-white"
                        } whitespace-nowrap`}
                      >
                        {deleting ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        {/* Manage all uploads area */}
        {allUploads !== null && (
          <section className="p-5 sm:p-6 rounded-xl bg-[#071018] border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h3 className="font-semibold text-white text-sm sm:text-base">
                Manage all uploads
              </h3>
              <div className="text-xs sm:text-sm text-slate-400">
                {allUploads.length} items
              </div>
            </div>

            {loadingUploads ? (
              <div className="text-sm text-slate-400">Loading...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allUploads.length === 0 && (
                  <div className="text-sm text-slate-400 col-span-full">
                    No uploads found.
                  </div>
                )}
                {allUploads.map((it: any) => {
                  const id = it.public_id || it.url;
                  const deleting = deletingIds.includes(id);
                  return (
                    <div
                      key={id}
                      className="p-3 rounded-lg bg-[#041018] border border-slate-800 flex flex-col gap-2"
                    >
                      <div className="w-full h-28 sm:h-32 rounded overflow-hidden bg-black/30 flex items-center justify-center mb-1">
                        {it.url?.match(/\.(mp4|webm|mov)$/i) ? (
                          <video
                            src={it.url}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <img src={it.url} className="w-full h-full object-cover" />
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-medium text-slate-100 truncate">
                            {it.public_id}
                          </div>
                          <div className="text-[0.7rem] sm:text-xs text-slate-400">
                            {it.category}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => window.open(it.url, "_blank")}
                            className="px-2 py-1 text-[0.65rem] sm:text-xs bg-[#061218] border border-slate-800 rounded text-slate-200"
                          >
                            Open
                          </button>

                          <button
                            onClick={() => handleDelete(it)}
                            disabled={deleting}
                            className={`px-2 py-1 text-[0.65rem] sm:text-xs rounded ${
                              deleting
                                ? "bg-red-600/60 text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {deleting ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Controls to show/hide manage area */}
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          {allUploads === null ? (
            <button
              onClick={() => fetchAllUploads()}
              className="px-4 py-2 bg-cyan-400 text-black rounded-md font-semibold text-xs sm:text-sm"
            >
              Load all uploads
            </button>
          ) : (
            <button
              onClick={() => setAllUploads(null)}
              className="px-4 py-2 bg-[#061218] border border-slate-800 rounded-md text-xs sm:text-sm text-slate-200"
            >
              Hide uploads
            </button>
          )}

          <button
            onClick={() => {
              fetchRecent();
              setToast("Refreshed recent");
            }}
            className="px-4 py-2 bg-[#061218] border border-slate-800 rounded-md text-xs sm:text-sm text-slate-200"
          >
            Refresh recent
          </button>
        </div>

        {/* toast */}
        {toast && (
          <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 bg-[#061218] border border-slate-800 px-4 py-2 rounded-md text-xs sm:text-sm text-slate-200 shadow-lg max-w-xs sm:max-w-sm">
            {toast}
          </div>
        )}
      </div>

      <style>{`
        .ring { 
          box-shadow: 0 8px 40px rgba(6,182,212,0.18); 
          border-color: rgba(6,182,212,0.48) !important; 
        }

        .recent-row { align-items: flex-start; }
        .recent-row img { display: block; }

        .recent-actions { display: flex; gap: 0.4rem; align-items: center; }
        .recent-actions button { white-space: nowrap; min-width: 52px; flex-shrink: 0; }

        @media (min-width: 640px) {
          .recent-actions { flex-direction: row; gap: 0.5rem; }
        }
      `}</style>
    </div>
  );
}
