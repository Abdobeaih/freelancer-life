import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Icon from "./Icon";
const Sidebar = ({ items, active, onNav, role }) => {
    const activeClass = { user: "slink-user", admin: "slink-admin", co: "slink-co" }[role];
    const iconColor = (isActive) => {
        if (!isActive)
            return "#8B7040";
        return role === "co" ? "#34D399" : role === "admin" ? "#FCD34D" : "#C9A84C";
    };
    return (_jsx("div", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: items.map(({ k, ico, lbl, badge }) => (_jsxs("button", { className: `slink ${active === k ? activeClass : ""}`, onClick: () => onNav(k), style: { position: "relative" }, children: [_jsx(Icon, { n: ico, sz: 15, c: iconColor(active === k) }), _jsx("span", { children: lbl }), badge && badge > 0 ? (_jsx("span", { style: { marginRight: "auto", minWidth: 18, height: 18, borderRadius: 9, background: "rgba(220,38,38,.2)", color: "#F87171", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }, children: badge })) : null] }, k))) }));
};
export default Sidebar;
