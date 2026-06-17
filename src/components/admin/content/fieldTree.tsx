"use client";

/**
 * Generic recursive form engine for editable content trees (page copy and
 * service text). Renders a labeled textarea per string leaf, highlights changes
 * vs a seed default, and provides immutable path-set + minimal-diff helpers.
 * Shared by CopyEditor and ServiceTextEditor.
 */

export type Path = (string | number)[];
export type Node = unknown;

export function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Immutably set a value at a path, cloning arrays/objects along the way. */
export function setAt(obj: Node, path: Path, value: Node): Node {
  if (path.length === 0) return value;
  const [k, ...rest] = path;
  if (Array.isArray(obj)) {
    const arr = [...obj];
    const i = k as number;
    arr[i] = setAt(arr[i], rest, value);
    return arr;
  }
  const o = { ...(obj as Record<string, unknown>) };
  const key = k as string;
  o[key] = setAt(o[key], rest, value);
  return o;
}

/** Minimal override of `cur` vs `seed`. Objects are partial; arrays/strings are
 *  emitted whole when changed (the server merge replaces arrays wholesale). */
export function diff(cur: Node, seed: Node): Node | undefined {
  if (typeof cur === "string") return cur === seed ? undefined : cur;
  if (Array.isArray(cur)) return JSON.stringify(cur) === JSON.stringify(seed) ? undefined : cur;
  if (isObj(cur)) {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(cur)) {
      const d = diff(cur[k], isObj(seed) ? seed[k] : undefined);
      if (d !== undefined) out[k] = d;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return undefined;
}

const HUMAN: Record<string, string> = {
  q: "Question", a: "Answer", title: "Title", body: "Text",
  cta: "Call to action", ctaLabel: "Button label", seo: "SEO",
  cardDescription: "Card description", shortTitle: "Short title",
};
export function humanize(key: string | number): string {
  if (typeof key === "number") return `Item ${key + 1}`;
  if (HUMAN[key]) return HUMAN[key];
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function Leaf({
  label,
  value,
  seed,
  onChange,
}: {
  label: string;
  value: string;
  seed: string | undefined;
  onChange: (v: string) => void;
}) {
  const changed = seed !== undefined && value !== seed;
  const multiline = value.length > 60 || value.includes("\n");
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[#57534E]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={multiline ? 3 : 1}
        className={`w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-[#1C1917] outline-none focus:ring-2 focus:ring-[#CA8A04]/20 ${
          changed ? "border-[#CA8A04]" : "border-[#D6CCBC]"
        }`}
      />
      {changed && seed !== undefined && (
        <span className="mt-0.5 block truncate text-[10px] text-[#A8A29E]">default: {seed}</span>
      )}
    </label>
  );
}

/** Recursively render a content node (object / array / string) as fields. */
export function NodeFields({
  node,
  seed,
  path,
  onLeafChange,
}: {
  node: Node;
  seed: Node;
  path: Path;
  onLeafChange: (path: Path, value: string) => void;
}) {
  if (typeof node === "string") {
    return (
      <Leaf
        label={humanize(path[path.length - 1])}
        value={node}
        seed={typeof seed === "string" ? seed : undefined}
        onChange={(v) => onLeafChange(path, v)}
      />
    );
  }
  if (Array.isArray(node)) {
    return (
      <div className="space-y-3">
        {node.map((item, i) => (
          <div key={i} className="rounded-lg border border-[#EFE7DA] bg-[#FAF7F2] p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#A8A29E]">{humanize(i)}</p>
            <NodeFields node={item} seed={Array.isArray(seed) ? seed[i] : undefined} path={[...path, i]} onLeafChange={onLeafChange} />
          </div>
        ))}
      </div>
    );
  }
  if (isObj(node)) {
    return (
      <div className="space-y-3">
        {Object.keys(node).map((k) => {
          const child = node[k];
          const childSeed = isObj(seed) ? seed[k] : undefined;
          const nested = isObj(child) || Array.isArray(child);
          return (
            <div key={k} className={nested ? "border-l-2 border-[#EFE7DA] pl-3" : ""}>
              {nested && <p className="mb-2 text-xs font-semibold text-[#1C1917]">{humanize(k)}</p>}
              <NodeFields node={child} seed={childSeed} path={[...path, k]} onLeafChange={onLeafChange} />
            </div>
          );
        })}
      </div>
    );
  }
  return null;
}

export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E7DFD3] bg-white p-5 sm:p-6">
      <h2 className="mb-4 font-serif text-xl text-[#1C1917]">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function SaveBar({
  pending,
  msg,
  onSave,
  onRevert,
}: {
  pending: boolean;
  msg: { kind: "ok" | "err"; text: string } | null;
  onSave: () => void;
  onRevert: () => void;
}) {
  return (
    <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-[#E7DFD3] bg-[#FAF7F2]/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-6">
      <button type="button" onClick={onSave} disabled={pending} className="rounded-full bg-[#B45309] px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#92400E] disabled:opacity-60">
        {pending ? "Saving…" : "Save & activate"}
      </button>
      <button type="button" onClick={onRevert} disabled={pending} className="rounded-full border border-[#D6CCBC] px-5 py-2.5 text-sm text-[#57534E] transition-colors hover:bg-white disabled:opacity-60">
        Revert all content to defaults
      </button>
      {msg && <span role="status" className={`text-sm ${msg.kind === "ok" ? "text-[#0F766E]" : "text-[#B91C1C]"}`}>{msg.text}</span>}
    </div>
  );
}
