import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
// ── Avatar ───────────────────────────────────────────────────
export const Avatar = ({ name, sz = 36, className }) => {
    const grads = [
        "linear-gradient(135deg,#8B6914,#C9A84C)",
        "linear-gradient(135deg,#5C4400,#8B6914)",
        "linear-gradient(135deg,#C9A84C,#E8C76A)",
        "linear-gradient(135deg,#3D2A00,#8B6914)",
    ];
    const bg = grads[(name?.charCodeAt(0) ?? 65) % 4];
    return (_jsx("div", { className: className, style: { width: sz, height: sz, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: sz * 0.38, fontWeight: 700, color: "#0A0700", flexShrink: 0 }, children: (name ?? "?")[0] }));
};
// ── Progress Bar ─────────────────────────────────────────────
export const ProgBar = ({ val, label, right, purple }) => (_jsxs("div", { children: [(label || right !== undefined) && (_jsxs("div", { className: "flex justify-between mb-1 text-xs", children: [_jsx("span", { style: { color: "#8B7040" }, children: label }), _jsx("span", { style: { color: purple ? "#7C3AED" : "#C9A84C", fontWeight: 700 }, children: right })] })), _jsx("div", { className: "prog-bar", children: _jsx("div", { className: purple ? "prog-fill-purple" : "prog-fill", style: { width: `${Math.min(val, 100)}%` } }) })] }));
// ── Bar Chart ────────────────────────────────────────────────
export const Bars = ({ data, labels, h = 100 }) => {
    const max = Math.max(...data, 1);
    return (_jsx("div", { style: { display: "flex", alignItems: "flex-end", gap: 4, height: h }, children: data.map((v, i) => (_jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: "100%", justifyContent: "flex-end" }, children: [_jsx("div", { style: { width: "100%", borderRadius: "3px 3px 0 0", background: "linear-gradient(to top,#8B6914,#C9A84C)", opacity: 0.35 + 0.65 * (v / max), height: `${Math.max((v / max) * 100, 3)}%`, transition: "height .8s ease" } }), labels?.[i] && _jsx("span", { style: { fontSize: 8, color: "#8B7040" }, children: labels[i] })] }, i))) }));
};
// ── QR Code (decorative) ─────────────────────────────────────
export const QR = ({ sz = 90 }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current)
            return;
        const p = Array.from({ length: 49 }, () => Math.random() > 0.44);
        [0, 1, 2, 7, 8, 14, 15, 16, 21, 22, 28, 29, 30, 35, 36, 42, 43, 44, 45, 46, 47, 48].forEach((i) => (p[i] = true));
        ref.current.innerHTML = p.map((f) => `<span style="background:${f ? "#0A0700" : "#F5EDD8"}"></span>`).join("");
    }, []);
    return (_jsx("div", { style: { width: sz, height: sz, background: "#F5EDD8", borderRadius: 9, padding: 5 }, children: _jsx("div", { ref: ref, style: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "1.5px" } }) }));
};
// ── Points Badge ─────────────────────────────────────────────
export const PtsBadge = ({ pts, size = "sm" }) => (_jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 5, padding: size === "lg" ? "10px 16px" : "4px 10px", borderRadius: 999, background: "rgba(124,58,237,.12)", border: "1px solid rgba(124,58,237,.25)" }, children: [_jsx("span", { style: { fontSize: size === "lg" ? 18 : 12 }, children: "\u2726" }), _jsx("span", { className: "font-mono", style: { fontWeight: 700, fontSize: size === "lg" ? 18 : 12, color: "#A78BFA" }, children: pts.toLocaleString() }), size === "lg" && _jsx("span", { style: { fontSize: 12, color: "#7C3AED" }, children: "\u0646\u0642\u0637\u0629" })] }));
