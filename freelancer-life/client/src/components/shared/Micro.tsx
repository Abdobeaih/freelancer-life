import { FC, useEffect, useRef } from "react";

// ── Avatar ───────────────────────────────────────────────────
export const Avatar: FC<{ name: string; sz?: number; className?: string }> = ({ name, sz = 36, className }) => {
  const grads = [
    "linear-gradient(135deg,#8B6914,#C9A84C)",
    "linear-gradient(135deg,#5C4400,#8B6914)",
    "linear-gradient(135deg,#C9A84C,#E8C76A)",
    "linear-gradient(135deg,#3D2A00,#8B6914)",
  ];
  const bg = grads[(name?.charCodeAt(0) ?? 65) % 4];
  return (
    <div
      className={className}
      style={{ width: sz, height: sz, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: sz * 0.38, fontWeight: 700, color: "#0A0700", flexShrink: 0 }}
    >
      {(name ?? "?")[0]}
    </div>
  );
};

// ── Progress Bar ─────────────────────────────────────────────
export const ProgBar: FC<{ val: number; label?: string; right?: string | number; purple?: boolean }> = ({ val, label, right, purple }) => (
  <div>
    {(label || right !== undefined) && (
      <div className="flex justify-between mb-1 text-xs">
        <span style={{ color: "#8B7040" }}>{label}</span>
        <span style={{ color: purple ? "#7C3AED" : "#C9A84C", fontWeight: 700 }}>{right}</span>
      </div>
    )}
    <div className="prog-bar">
      <div className={purple ? "prog-fill-purple" : "prog-fill"} style={{ width: `${Math.min(val, 100)}%` }} />
    </div>
  </div>
);

// ── Bar Chart ────────────────────────────────────────────────
export const Bars: FC<{ data: number[]; labels?: string[]; h?: number }> = ({ data, labels, h = 100 }) => {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: h }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: "100%", justifyContent: "flex-end" }}>
          <div style={{ width: "100%", borderRadius: "3px 3px 0 0", background: "linear-gradient(to top,#8B6914,#C9A84C)", opacity: 0.35 + 0.65 * (v / max), height: `${Math.max((v / max) * 100, 3)}%`, transition: "height .8s ease" }} />
          {labels?.[i] && <span style={{ fontSize: 8, color: "#8B7040" }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
};

// ── QR Code (decorative) ─────────────────────────────────────
export const QR = ({ sz = 90 }: { sz?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const p = Array.from({ length: 49 }, () => Math.random() > 0.44);
    [0,1,2,7,8,14,15,16,21,22,28,29,30,35,36,42,43,44,45,46,47,48].forEach((i) => (p[i] = true));
    ref.current.innerHTML = p.map((f) => `<span style="background:${f ? "#0A0700" : "#F5EDD8"}"></span>`).join("");
  }, []);
  return (
    <div style={{ width: sz, height: sz, background: "#F5EDD8", borderRadius: 9, padding: 5 }}>
      <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "1.5px" }} />
    </div>
  );
};

// ── Points Badge ─────────────────────────────────────────────
export const PtsBadge: FC<{ pts: number; size?: "sm" | "lg" }> = ({ pts, size = "sm" }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: size === "lg" ? "10px 16px" : "4px 10px", borderRadius: 999, background: "rgba(124,58,237,.12)", border: "1px solid rgba(124,58,237,.25)" }}>
    <span style={{ fontSize: size === "lg" ? 18 : 12 }}>✦</span>
    <span className="font-mono" style={{ fontWeight: 700, fontSize: size === "lg" ? 18 : 12, color: "#A78BFA" }}>{pts.toLocaleString()}</span>
    {size === "lg" && <span style={{ fontSize: 12, color: "#7C3AED" }}>نقطة</span>}
  </div>
);
