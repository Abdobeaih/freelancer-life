import { useToastStore, ToastType } from "../../store/toast.store";
import Icon from "./Icon";

const cfg: Record<ToastType, { bg: string; ico: string; color: string }> = {
  ok:     { bg: "rgba(16,185,129,.95)",                                          ico: "chk",      color: "#fff" },
  err:    { bg: "rgba(220,38,38,.95)",                                           ico: "rej",      color: "#fff" },
  warn:   { bg: "rgba(201,168,76,.95)",                                          ico: "clk",      color: "#0A0700" },
  info:   { bg: "rgba(124,58,237,.95)",                                          ico: "info",     color: "#fff" },
  points: { bg: "linear-gradient(135deg,rgba(91,33,182,.95),rgba(124,58,237,.95))", ico: "sparkles", color: "#fff" },
};

export default function Toast() {
  const { msg, type } = useToastStore();
  if (!msg) return null;
  const { bg, ico, color } = cfg[type];
  return (
    <div
      className="animate-slide-up"
      style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 900, display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 999, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", background: bg, color, boxShadow: "0 8px 32px rgba(0,0,0,.7)", fontFamily: "Cairo,sans-serif" }}
    >
      <Icon n={ico} sz={15} />
      {msg}
    </div>
  );
}
