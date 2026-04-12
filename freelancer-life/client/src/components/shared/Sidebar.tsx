import { FC } from "react";
import Icon from "./Icon";

interface NavItem { k: string; ico: string; lbl: string; badge?: number; }
type SideRole = "user" | "admin" | "co";

const Sidebar: FC<{ items: NavItem[]; active: string; onNav: (k: string) => void; role: SideRole }> = ({ items, active, onNav, role }) => {
  const activeClass = { user: "slink-user", admin: "slink-admin", co: "slink-co" }[role];
  const iconColor = (isActive: boolean) => {
    if (!isActive) return "#8B7040";
    return role === "co" ? "#34D399" : role === "admin" ? "#FCD34D" : "#C9A84C";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {items.map(({ k, ico, lbl, badge }) => (
        <button
          key={k}
          className={`slink ${active === k ? activeClass : ""}`}
          onClick={() => onNav(k)}
          style={{ position: "relative" }}
        >
          <Icon n={ico} sz={15} c={iconColor(active === k)} />
          <span>{lbl}</span>
          {badge && badge > 0 ? (
            <span style={{ marginRight: "auto", minWidth: 18, height: 18, borderRadius: 9, background: "rgba(220,38,38,.2)", color: "#F87171", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {badge}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
