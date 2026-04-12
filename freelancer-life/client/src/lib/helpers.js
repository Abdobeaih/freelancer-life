export const fmtCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
export const fmtExp = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
};
export const maskNum = (n) => {
    const d = n.replace(/\s/g, "");
    return d.length >= 4 ? `•••• •••• •••• ${d.slice(-4)}` : "•••• •••• •••• ••••";
};
export const daysSince = (ts) => Math.floor((Date.now() - new Date(ts).getTime()) / 864e5);
export const uid = () => Math.random().toString(36).slice(2, 9);
