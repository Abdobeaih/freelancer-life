import { FC, memo } from "react";
import { Plan } from "../../types";
import { PLANS } from "../../constants";
import Icon from "./Icon";

interface PCardProps {
  plan: Plan;
  name: string;
  lastFour?: string;
  compact?: boolean;
  pts?: number;
}

const PCard: FC<PCardProps> = memo(({ plan = "free", name = "YOUR NAME", lastFour = "", compact = false, pts = 0 }) => {
  const bgs: Record<Plan, string> = {
    free:    "linear-gradient(135deg,#100B00 0%,#1E1600 50%,#100B00 100%)",
    premium: "linear-gradient(135deg,#1A1100 0%,#4D3400 35%,#8B6914 60%,#4D3400 85%,#1A1100 100%)",
    elite:   "linear-gradient(135deg,#080500 0%,#2A1F00 25%,#6B5000 50%,#C9A84C 65%,#6B5000 82%,#0D0800 100%)",
  };
  const borderOpacity = plan === "elite" ? 0.5 : plan === "premium" ? 0.3 : 0.18;
  const W = compact ? 240 : 320;
  const H = compact ? 148 : 195;
  const display = lastFour ? `•••• •••• •••• ${lastFour.slice(-4)}` : "•••• •••• •••• ••••";

  return (
    <div
      className={compact ? "" : "animate-float"}
      style={{ width: W, height: H, background: bgs[plan], border: `1px solid rgba(201,168,76,${borderOpacity})`, borderRadius: 18, padding: compact ? "14px 16px" : "22px 24px", position: "relative", overflow: "hidden", flexShrink: 0, boxShadow: `0 ${compact ? 10 : 20}px ${compact ? 28 : 56}px rgba(0,0,0,.7),inset 0 1px 0 rgba(201,168,76,.1)` }}
    >
      {/* texture */}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg,rgba(255,255,255,.012),rgba(255,255,255,.012) 1px,transparent 1px,transparent 14px)", pointerEvents: "none" }} />
      {plan === "elite" && (
        <div style={{ position: "absolute", left: 0, right: 0, height: "1.5px", background: "linear-gradient(90deg,transparent,rgba(201,168,76,.6),transparent)", animation: "scan 2.8s linear infinite", pointerEvents: "none" }} />
      )}

      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: compact ? 9 : 13 }}>
        <div style={{ display: "flex", alignItems: "center", gap: compact ? 6 : 8 }}>
          <div style={{ width: compact ? 23 : 29, height: compact ? 23 : 29, borderRadius: compact ? 6 : 8, background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon n="zap" sz={compact ? 11 : 14} c="#000" />
          </div>
          <span style={{ fontSize: compact ? 9 : 11, fontWeight: 800, color: "rgba(201,168,76,.8)", letterSpacing: ".04em" }}>FL CARD</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <span style={{ fontSize: compact ? 8 : 10, fontWeight: 800, letterSpacing: ".12em", color: plan === "elite" ? "#E8C76A" : plan === "premium" ? "#C9A84C" : "#8B7040" }}>{PLANS[plan].en}</span>
          {pts > 0 && <span className="font-mono" style={{ fontSize: compact ? 7 : 9, color: "rgba(167,139,250,.8)", fontWeight: 700 }}>{pts.toLocaleString()} pts</span>}
        </div>
      </div>

      {/* chip */}
      <div style={{ display: "flex", alignItems: "center", gap: compact ? 7 : 10, marginBottom: compact ? 8 : 12 }}>
        <div style={{ width: compact ? 28 : 38, height: compact ? 20 : 27, borderRadius: compact ? 4 : 5, background: "linear-gradient(135deg,#5C4400,#C9A84C,#FFE08A)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)" }} />
        {plan !== "free" && <Icon n="wifi" sz={compact ? 14 : 18} c="rgba(201,168,76,.45)" />}
      </div>

      {/* number */}
      <div className="font-mono" style={{ fontSize: compact ? 12 : 15, letterSpacing: compact ? ".14em" : ".18em", fontWeight: 500, color: "rgba(245,237,216,.85)", marginBottom: compact ? 6 : 10 }}>
        {display}
      </div>

      {/* footer */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: compact ? 7 : 8, color: "rgba(201,168,76,.38)", marginBottom: 2, letterSpacing: ".09em" }}>CARD HOLDER</div>
          <div className="font-mono" style={{ fontSize: compact ? 10 : 12, letterSpacing: ".09em", color: "rgba(201,168,76,.75)", textTransform: "uppercase" }}>{(name || "YOUR NAME").toUpperCase().slice(0, 20)}</div>
        </div>
        {plan === "elite" && <Icon n="dia" sz={compact ? 17 : 22} c="rgba(201,168,76,.55)" />}
        {plan === "premium" && <Icon n="star" sz={compact ? 14 : 18} c="rgba(201,168,76,.4)" />}
      </div>
    </div>
  );
});

export default PCard;
