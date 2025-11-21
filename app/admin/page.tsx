'use client';
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
  const [locked, setLocked] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const dropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!locked) fetchRecent();
  }, [locked]);

  // drag & drop styling
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const onDrag = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.add("ring");
    };
    const onLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove("ring");
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove("ring");
      if (e.dataTransfer?.files?.length) {
        setFile(e.dataTransfer.files[0]);
      }
    };

    window.addEventListener("dragover", onDrag);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onDrag);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  // 🔐 UPDATED: verify password, store in-memory, no re-prompt
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
        let obj = {} as any;
        try { obj = JSON.parse(txt); } catch {}
        setError(obj?.error || "Password incorrect");
        setChecking(false);
        return;
      }

      // save the admin password in-memory for uploads
      (window as any).__adminPasswordForUpload = password;

      setLocked(false);
      setChecking(false);
      setPassword(""); // clear field but password is kept in window
    } catch (err: any) {
      setError(err.message || "Network error");
      setChecking(false);
    }
  }

  async function fetchRecent() {
    try {
      const res = await fetch("/api/uploads");
      if (!res.ok) return;
      const arr = await res.json();
      setRecent(arr.slice(0, 8));
    } catch {}
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setUploadedUrl(null);
  }

  // 🔐 UPDATED: uploader always uses stored admin password
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

    // Always supply password from memory
    const adminPass = (window as any).__adminPasswordForUpload;
    if (adminPass) {
      xhr.setRequestHeader("x-admin-pass", adminPass);
    } else {
      setUploading(false);
      return setError("Admin session expired. Please re-login.");
    }

    // progress bar
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
          fetchRecent();
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

  // -----------------------------------------
  // LOCKED SCREEN (password modal)
  // -----------------------------------------
  if (locked) {
    return (
      <div className="min-h-screen bg-[#050506] flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-[#071018] border border-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-3">Admin Access</h2>
          <p className="text-sm text-slate-300 mb-4">Enter the admin password to access the uploader.</p>

          <form onSubmit={verifyPassword} className="space-y-4">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded bg-[#041018] border border-slate-800 focus:ring-2 focus:ring-cyan-400 outline-none"
              autoComplete="new-password"
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={checking || !password}
                className="px-4 py-2 bg-cyan-400 text-black rounded shadow disabled:opacity-60"
              >
                {checking ? "Checking…" : "Unlock"}
              </button>

              <Link href="/" className="text-sm text-slate-300 hover:text-white">Back to site</Link>
            </div>

            {error && <div className="text-sm text-red-400 mt-2">{error}</div>}
          </form>

          <div className="mt-6 text-xs text-slate-500">
            Tip: Password required only once. Uploading will not ask again.
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // UNLOCKED SCREEN (full admin panel)
  // -----------------------------------------
  return (
    <div className="min-h-screen bg-[#050506] p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Uploader</h1>
            <div className="text-sm text-slate-400">Upload images & videos to your portfolio.</div>
          </div>

          <button
            onClick={() => {
              setLocked(true);
              (window as any).__adminPasswordForUpload = null;
            }}
            className="px-3 py-2 border rounded bg-[#071018] text-slate-200 hover:bg-[#081021]"
          >
            Lock
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* UPLOADER */}
          <div className="md:col-span-2 p-6 rounded-xl bg-[#071018] border border-slate-800">
            <div ref={dropRef} className="relative rounded-lg p-6 border-2 border-dashed border-slate-800 bg-[#041018]">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <div className="text-sm text-slate-300 mb-2">Drop a file here or</div>
                  <div className="flex items-center gap-3">
                    <label className="inline-block px-4 py-2 bg-cyan-400 text-black rounded cursor-pointer">
                      Choose file
                      <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                    </label>

                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="px-3 py-2 bg-[#061218] border border-slate-800 rounded"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>

                    <button onClick={uploadFile} disabled={uploading || !file} className="px-4 py-2 bg-cyan-400 text-black rounded">
                      {uploading ? `Uploading ${progress}%` : "Upload"}
                    </button>
                  </div>

                  {error && <div className="text-sm text-red-400 mt-3">{error}</div>}

                  {file && (
                    <div className="mt-4">
                      <div className="text-sm text-slate-300">Selected:</div>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="w-20 h-20 rounded overflow-hidden bg-black/40 flex items-center justify-center">
                          {file.type.startsWith("image") ? (
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-sm text-slate-400">Video</div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>

                      {uploading && (
                        <div className="mt-3 w-full bg-slate-800 rounded h-3 overflow-hidden">
                          <div style={{ width: `${progress}%` }} className="h-3 bg-cyan-400 transition-all" />
                        </div>
                      )}

                      {uploadedUrl && (
                        <div className="mt-3 text-sm">
                          Uploaded:{" "}
                          <a href={uploadedUrl} target="_blank" className="text-cyan-300">
                            {uploadedUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-40 text-sm text-slate-400">
                  <div className="font-medium mb-2">Tips</div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Use high-res images</li>
                    <li>Videos supported</li>
                    <li>Select correct category</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT UPLOADS */}
          <aside className="p-6 rounded-xl bg-[#071018] border border-slate-800">
            <h3 className="font-semibold">Recent uploads</h3>
            <div className="mt-4 space-y-3">
              {recent.length === 0 && <div className="text-sm text-slate-400">No uploads yet.</div>}
              {recent.map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded overflow-hidden bg-black/40 flex items-center justify-center">
                    {r.url?.endsWith(".mp4") ? (
                      <div className="text-xs text-slate-400">Video</div>
                    ) : (
                      <img src={r.url} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{r.public_id}</div>
                    <div className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleString()}</div>
                    <div className="text-xs text-cyan-400">{r.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .ring { 
          box-shadow: 0 6px 30px rgba(6,182,212,0.2); 
          border-color: rgba(6,182,212,0.4) !important; 
        }
      `}</style>
    </div>
  );
}
