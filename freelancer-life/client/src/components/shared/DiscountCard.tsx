import { FC } from "react";
import { Discount, Plan } from "../../types";
import { CAT_EMO, canAccess } from "../../constants";
import Icon from "./Icon";

interface DCardProps { d: Discount; onUse?: (d: Discount) => void; userPlan: Plan; }

const DiscountCard: FC<DCardProps> = ({ d, onUse, userPlan }) => {
  const ok = canAccess(userPlan, d.tier);
  const tierColor = { free: "#C9A84C", premium: "#E8C76A", elite: "#C4B5FD" }[d.tier];

  return (
    <div
      className="dcard"
      style={{ background: "rgba(201,168,76,.025)", border: "1px solid rgba(201,168,76,.1)", borderRadius: 14, padding: 20, cursor: ok ? "pointer" : "default", transition: "all .25s", opacity: ok ? 1 : 0.55 }}
      onClick={() => ok && onUse && onUse(d)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(201,168,76,.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: "1px solid rgba(201,168,76,.14)" }}>
          {CAT_EMO[d.category]}
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {d.tier !== "free" && (
            <span className="badge badge-gold" style={{ fontSize: 9 }}>
              {d.tier === "elite" ? "💎 إليت" : "⭐ بريميوم"}
            </span>
          )}
          {!ok && <Icon n="lock" sz={13} c="#8B7040" />}
        </div>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{d.name}</div>
      <div style={{ fontSize: 12, color: "#8B7040", marginBottom: 12, lineHeight: 1.6 }}>{d.description}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 24, fontWeight: 900, color: tierColor }}>{d.percentage}</span>
        <span style={{ fontSize: 11, color: "#8B7040", display: "flex", alignItems: "center", gap: 3 }}>
          <Icon n="pin" sz={10} />{d.city}
        </span>
      </div>
    </div>
  );
};

export default DiscountCard;
