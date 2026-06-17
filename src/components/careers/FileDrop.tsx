"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

export interface UploadedFile {
  path: string;
  name: string;
  bytes: number;
}

interface Item extends Partial<UploadedFile> {
  localId: string;
  name: string;
  bytes: number;
  progress: number; // 0..100
  error?: string;
  previewUrl?: string; // images only
}

type Kind = "resume" | "cover" | "photo";

const KB = 1024;
function humanSize(b: number): string {
  if (b < KB) return `${b} B`;
  if (b < KB * KB) return `${Math.round(b / KB)} KB`;
  return `${(b / KB / KB).toFixed(1)} MB`;
}

const ERR: Record<string, string> = {
  too_large: "That file is over 10 MB.",
  unsupported_type: "That file type isn't supported.",
  too_many: "You've reached the limit for this section.",
  rate_limited: "Too many uploads right now — wait a moment and retry.",
  upload_failed: "Upload failed — please try again.",
  network: "Network error — please try again.",
};

/** XHR upload so we get real upload progress (fetch can't report it). */
function upload(
  file: File,
  kind: Kind,
  token: string,
  onProgress: (pct: number) => void,
): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("uploadToken", token);
    fd.append("kind", kind);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/careers/uploads");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 95));
    };
    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status === 200 && res.ok) resolve({ path: res.path, name: res.name, bytes: res.bytes });
        else reject(new Error(res.error || "upload_failed"));
      } catch {
        reject(new Error("upload_failed"));
      }
    };
    xhr.onerror = () => reject(new Error("network"));
    xhr.send(fd);
  });
}

/**
 * Accessible drag-and-drop uploader. Posts each file to /api/careers/uploads,
 * shows per-file progress + thumbnails, and reports the stored paths up via
 * onChange. Keyboard- and screen-reader-friendly (browse button, live region).
 */
export function FileDrop({
  kind,
  token,
  label,
  hint,
  accept,
  multiple = false,
  max = 1,
  value,
  onChange,
  required = false,
}: {
  kind: Kind;
  token: string;
  label: string;
  hint: string;
  accept: string;
  multiple?: boolean;
  max?: number;
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Seed from a restored draft so files re-attached from autosave show as done.
  const [items, setItems] = useState<Item[]>(() =>
    value.map((v) => ({ localId: v.path, name: v.name, bytes: v.bytes, path: v.path, progress: 100 })),
  );
  const [dragging, setDragging] = useState(false);
  const [announce, setAnnounce] = useState("");
  const hintId = useId();
  const isImage = kind === "photo";
  // Track minted preview object URLs so they can be revoked on remove/replace
  // and unmount (otherwise each previewed photo leaks its blob).
  const objectUrls = useRef<Set<string>>(new Set());
  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, []);

  const sync = useCallback(
    (next: Item[]) => {
      setItems(next);
      onChange(next.filter((i) => i.path).map((i) => ({ path: i.path!, name: i.name, bytes: i.bytes })));
    },
    [onChange],
  );

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      // Current count = uploaded + in-flight.
      setItems((prev) => {
        const room = max - prev.filter((i) => !i.error).length;
        const accepted = list.slice(0, Math.max(0, room));
        const newItems: Item[] = accepted.map((f) => {
          const previewUrl = isImage ? URL.createObjectURL(f) : undefined;
          if (previewUrl) objectUrls.current.add(previewUrl);
          return {
            localId: `${f.name}-${f.size}-${Math.round(f.lastModified)}`,
            name: f.name,
            bytes: f.size,
            progress: 0,
            previewUrl,
          };
        });
        // single-file kinds replace the previous file — revoke the old preview.
        if (!multiple) {
          for (const p of prev) {
            if (p.previewUrl) {
              URL.revokeObjectURL(p.previewUrl);
              objectUrls.current.delete(p.previewUrl);
            }
          }
        }
        const base = multiple ? prev : [];
        const merged = [...base, ...newItems];

        // kick off uploads outside setState
        accepted.forEach((f, idx) => {
          const it = newItems[idx];
          upload(f, kind, token, (pct) =>
            setItems((cur) => cur.map((x) => (x.localId === it.localId && !x.path ? { ...x, progress: pct } : x))),
          )
            .then((res) => {
              setItems((cur) => {
                const updated = cur.map((x) =>
                  x.localId === it.localId ? { ...x, ...res, progress: 100 } : x,
                );
                onChange(updated.filter((i) => i.path).map((i) => ({ path: i.path!, name: i.name, bytes: i.bytes })));
                return updated;
              });
              setAnnounce(`${res.name} uploaded.`);
            })
            .catch((e: Error) => {
              setItems((cur) => cur.map((x) => (x.localId === it.localId ? { ...x, error: ERR[e.message] || ERR.upload_failed } : x)));
              setAnnounce(ERR[e.message] || ERR.upload_failed);
            });
        });
        return merged;
      });
    },
    [isImage, kind, max, multiple, onChange, token],
  );

  const remove = (localId: string) => {
    const target = items.find((i) => i.localId === localId);
    if (target?.previewUrl) {
      URL.revokeObjectURL(target.previewUrl);
      objectUrls.current.delete(target.previewUrl);
    }
    const next = items.filter((i) => i.localId !== localId);
    sync(next);
    setAnnounce("File removed.");
  };

  const atMax = items.filter((i) => !i.error).length >= max;

  return (
    <div>
      <p className="mb-1.5 block text-sm font-medium text-[#44403C]">
        {label} {required && <span className="text-[#B45309]">*</span>}
      </p>

      {!atMax && (
        <div
          role="button"
          tabIndex={0}
          aria-describedby={hintId}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-7 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] ${
            dragging ? "border-[#B45309] bg-[#FBF1E4]" : "border-[#D6CCBA] bg-white hover:border-[#CA8A04]"
          }`}
        >
          <svg className="mb-2 h-7 w-7 text-[#B45309]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
            <path d="M12 16V4m0 0L7 9m5-5l5 5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 17v1a3 3 0 003 3h10a3 3 0 003-3v-1" strokeLinecap="round" />
          </svg>
          <span className="text-sm font-medium text-[#1C1917]">
            <span className="text-[#B45309] underline underline-offset-2">Browse files</span> or drag & drop
          </span>
          <span id={hintId} className="mt-1 text-xs font-light text-[#8A7F73]">{hint}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <span aria-live="polite" className="sr-only">{announce}</span>

      {items.length > 0 && (
        <ul className={`mt-3 ${isImage ? "grid grid-cols-3 gap-2 sm:grid-cols-4" : "space-y-2"}`}>
          {items.map((it) => (
            <li
              key={it.localId}
              className={`relative overflow-hidden rounded-lg border ${it.error ? "border-[#B91C1C]/40 bg-[#FEF2F2]" : "border-[#E7DFD3] bg-white"} ${isImage ? "aspect-square" : "flex items-center gap-3 p-2.5"}`}
            >
              {isImage ? (
                <>
                  {it.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.previewUrl} alt={it.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-[#F5EEE2] text-[#B45309]">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M3 16l5-5 4 4 3-3 6 6" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                  {!it.path && !it.error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white">
                      {it.progress}%
                    </div>
                  )}
                </>
              ) : (
                <>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#F5EEE2] text-[#B45309]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                      <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" strokeLinejoin="round" />
                      <path d="M14 3v5h5" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-[#1C1917]">{it.name}</span>
                    <span className="text-xs text-[#8A7F73]">
                      {it.error ? it.error : it.path ? humanSize(it.bytes) : `Uploading… ${it.progress}%`}
                    </span>
                    {!it.path && !it.error && (
                      <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-[#EDE3D3]">
                        <span className="block h-full bg-[#B45309] transition-[width] duration-200" style={{ width: `${it.progress}%` }} />
                      </span>
                    )}
                  </span>
                </>
              )}
              <button
                type="button"
                onClick={() => remove(it.localId)}
                aria-label={`Remove ${it.name}`}
                className={`absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white hover:bg-black/75 ${isImage ? "" : "!static ml-auto bg-transparent text-[#A8A29E] hover:text-[#B91C1C]"}`}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      <input type="hidden" value={value.length} readOnly aria-hidden="true" className="hidden" />
    </div>
  );
}
