import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { PLANS, JOBS, PTS } from "../../constants";
import { fmtCard, fmtExp } from "../../lib/helpers";
import { useAuthStore } from "../../store/auth.store";
import { useToastStore } from "../../store/toast.store";
import Icon from "../shared/Icon";
import PCard from "../shared/PCard";
const BORDER = "rgba(201,168,76,.14)";
const G = "#C9A84C";
const MUTED = "#8B7040";
const BG2 = "#080600";
const Lbl = ({ t }) => (_jsx("label", { style: { fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }, children: t }));
const ErrBox = ({ msg }) => msg ? _jsx("div", { style: { fontSize: 13, color: "#F87171", background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.18)", borderRadius: 9, padding: "9px 13px", marginTop: 8 }, children: msg }) : null;
const PlanOpt = ({ plan, selected, onSelect }) => {
    const p = PLANS[plan];
    const active = selected === plan;
    return (_jsxs("div", { onClick: () => onSelect(plan), style: { border: `2px solid ${active ? G : "rgba(201,168,76,.1)"}`, borderRadius: 12, padding: 13, cursor: "pointer", transition: "all .22s", background: active ? "rgba(201,168,76,.08)" : "transparent", position: "relative" }, children: [active && _jsx("div", { style: { position: "absolute", top: 9, right: 9, width: 17, height: 17, borderRadius: "50%", background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center" }, children: _jsx(Icon, { n: "chk", sz: 10, c: "#000" }) }), _jsx("div", { style: { fontSize: 20, marginBottom: 7 }, children: plan === "elite" ? "💎" : plan === "premium" ? "⭐" : "🆓" }), _jsx("div", { style: { fontWeight: 800, fontSize: 13, color: active ? G : "#F5EDD8", marginBottom: 2 }, children: p.label }), _jsxs("div", { style: { fontSize: 17, fontWeight: 900, color: active ? "#E8C76A" : "#F5EDD8", marginBottom: 7 }, children: [p.price === 0 ? "مجاني" : `${p.price} ر.س`, _jsx("span", { style: { fontSize: 9, fontWeight: 400, color: MUTED }, children: p.price ? "/شهر" : "" })] }), p.perks.slice(0, 3).map((k) => (_jsxs("div", { style: { fontSize: 10, color: MUTED, display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }, children: [_jsx(Icon, { n: "chk", sz: 9, c: active ? G : MUTED }), k] }, k)))] }));
};
const Steps = ({ cur, steps }) => (_jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 22 }, children: steps.map((s, i) => (_jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [_jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }, children: [_jsx("div", { style: { width: 27, height: 27, borderRadius: "50%", background: cur > i ? "linear-gradient(135deg,#8B6914,#C9A84C)" : "transparent", border: `2px solid ${cur >= i ? G : MUTED}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: cur > i ? "#000" : cur === i ? G : MUTED, transition: "all .3s" }, children: cur > i ? _jsx(Icon, { n: "chk", sz: 12 }) : i + 1 }), _jsx("span", { style: { fontSize: 9, color: cur >= i ? G : MUTED }, children: s })] }), i < steps.length - 1 && _jsx("div", { style: { height: 1, width: 30, margin: "0 5px", marginBottom: 16, background: cur > i ? G : MUTED, transition: "background .3s" } })] }, i))) }));
const AuthModal = ({ initMode, onClose }) => {
    const { login, register, isLoading } = useAuthStore();
    const { show: toast } = useToastStore();
    const [mode, setMode] = useState(initMode);
    const [step, setStep] = useState(1);
    const [lt, setLt] = useState("user");
    const [err, setErr] = useState("");
    const [f, setF] = useState({ email: "", pw: "", name: "", job: "", pw2: "", plan: "free", cn: "", num: "", exp: "", cvv: "", ref: "" });
    const u = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
    const s1ok = () => {
        if (!f.name.trim() || !f.email.trim() || !f.job || !f.pw) {
            setErr("يرجى ملء جميع الحقول");
            return false;
        }
        if (!f.email.includes("@")) {
            setErr("بريد إلكتروني غير صحيح");
            return false;
        }
        if (f.pw.length < 6) {
            setErr("كلمة المرور 6 أحرف على الأقل");
            return false;
        }
        if (f.pw !== f.pw2) {
            setErr("كلمتا المرور غير متطابقتين");
            return false;
        }
        return true;
    };
    const doLogin = async () => {
        setErr("");
        if (!f.email || !f.pw) {
            setErr("يرجى ملء الحقول");
            return;
        }
        try {
            await login(f.email.trim(), f.pw, lt);
            onClose();
            toast(`مرحبًا! 👋`);
        }
        catch (e) {
            setErr(e.response?.data?.error ?? "خطأ في الدخول");
        }
    };
    const doReg = async () => {
        setErr("");
        if (f.plan !== "free") {
            if (!f.cn.trim()) {
                setErr("أدخل الاسم على البطاقة");
                return;
            }
            if (f.num.replace(/\s/g, "").length < 16) {
                setErr("رقم البطاقة غير مكتمل");
                return;
            }
            if (f.exp.length < 5) {
                setErr("تاريخ الانتهاء غير صحيح");
                return;
            }
            if (f.cvv.length < 3) {
                setErr("CVV غير صحيح");
                return;
            }
        }
        const payload = {
            name: f.name.trim(), email: f.email.trim(), password: f.pw, job: f.job, plan: f.plan,
            referralCode: f.ref.trim() || undefined,
            card: f.plan !== "free" ? { nameOnCard: f.cn, lastFour: f.num.replace(/\s/g, "").slice(-4), expiry: f.exp } : null,
        };
        try {
            await register(payload);
            onClose();
            toast(`تم إنشاء حسابك! 🎉`, "points");
        }
        catch (e) {
            setErr(e.response?.data?.error ?? "خطأ في التسجيل");
        }
    };
    return (_jsx("div", { style: { position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,.92)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }, onClick: (e) => e.target === e.currentTarget && onClose(), children: _jsx("div", { className: "animate-scale-in", style: { background: BG2, border: "1px solid rgba(201,168,76,.22)", borderRadius: 20, width: "100%", maxWidth: 490, position: "relative", maxHeight: "92vh", overflowY: "auto" }, children: _jsxs("div", { style: { padding: 28 }, children: [_jsx("button", { className: "btn btn-dim", onClick: onClose, style: { position: "absolute", top: 14, left: 14, width: 29, height: 29, padding: 0, borderRadius: 8, zIndex: 5 }, children: _jsx(Icon, { n: "x", sz: 13 }) }), mode === "login" && (_jsxs(_Fragment, { children: [_jsxs("div", { style: { textAlign: "center", marginBottom: 22 }, children: [_jsx("div", { style: { width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }, children: _jsx(Icon, { n: "zap", sz: 22, c: "#000" }) }), _jsx("h2", { style: { fontWeight: 800, fontSize: 20, marginBottom: 3 }, children: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" })] }), _jsx("div", { style: { display: "flex", gap: 5, marginBottom: 18, padding: 4, background: "rgba(201,168,76,.04)", borderRadius: 10, border: `1px solid ${BORDER}` }, children: [["user", "مستخدم"], ["company", "شركة شريكة"], ["admin", "إدارة"]].map(([k, l]) => (_jsx("button", { className: `btn ${lt === k ? "btn-gold" : "btn-dim"}`, style: { flex: 1, height: 34, fontSize: 12 }, onClick: () => { setLt(k); setErr(""); }, children: l }, k))) }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [_jsxs("div", { children: [_jsx(Lbl, { t: lt === "admin" ? "المعرّف" : "البريد الإلكتروني" }), _jsx("input", { className: "inp", dir: "ltr", placeholder: lt === "admin" ? "adham" : "email@example.com", value: f.email, onChange: u("email"), onKeyDown: (e) => e.key === "Enter" && doLogin() })] }), _jsxs("div", { children: [_jsx(Lbl, { t: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" }), _jsx("input", { className: "inp", type: "password", dir: "ltr", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: f.pw, onChange: u("pw"), onKeyDown: (e) => e.key === "Enter" && doLogin() })] }), _jsx(ErrBox, { msg: err }), _jsx("button", { className: "btn btn-gold", style: { width: "100%", height: 48, fontSize: 15, marginTop: 4 }, onClick: doLogin, disabled: isLoading, children: isLoading ? "جارٍ الدخول..." : "دخول" }), lt === "user" && _jsxs("p", { style: { textAlign: "center", fontSize: 13, color: MUTED }, children: ["\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628\u061F ", _jsx("button", { style: { background: "none", border: "none", color: G, cursor: "pointer", fontWeight: 700, fontSize: 13 }, onClick: () => { setMode("register"); setStep(1); setErr(""); }, children: "\u0633\u062C\u0651\u0644 \u0627\u0644\u0622\u0646" })] })] })] })), mode === "register" && (_jsxs(_Fragment, { children: [_jsx(Steps, { cur: step - 1, steps: ["معلوماتك", "الباقة", "الدفع"] }), step === 1 && (_jsxs(_Fragment, { children: [_jsx("h3", { style: { fontWeight: 800, fontSize: 18, marginBottom: 16, textAlign: "center" }, children: "\u0645\u0639\u0644\u0648\u0645\u0627\u062A\u0643 \u0627\u0644\u0634\u062E\u0635\u064A\u0629" }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 11 }, children: [_jsxs("div", { children: [_jsx(Lbl, { t: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644" }), _jsx("input", { className: "inp", placeholder: "\u0623\u062D\u0645\u062F \u0645\u062D\u0645\u062F \u0627\u0644\u062E\u0627\u0644\u062F", value: f.name, onChange: u("name") })] }), _jsxs("div", { style: { display: "flex", gap: 11 }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx(Lbl, { t: "\u0627\u0644\u0645\u0647\u0646\u0629" }), _jsxs("select", { className: "inp", value: f.job, onChange: u("job"), children: [_jsx("option", { value: "", children: "\u0627\u062E\u062A\u0631 \u0645\u0647\u0646\u062A\u0643" }), JOBS.map((j) => _jsx("option", { children: j }, j))] })] }), _jsxs("div", { style: { flex: 1 }, children: [_jsx(Lbl, { t: "\u0627\u0644\u0628\u0631\u064A\u062F" }), _jsx("input", { className: "inp", dir: "ltr", placeholder: "you@email.com", value: f.email, onChange: u("email") })] })] }), _jsxs("div", { style: { display: "flex", gap: 11 }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx(Lbl, { t: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" }), _jsx("input", { className: "inp", type: "password", dir: "ltr", placeholder: "6 \u0623\u062D\u0631\u0641+", value: f.pw, onChange: u("pw") })] }), _jsxs("div", { style: { flex: 1 }, children: [_jsx(Lbl, { t: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0645\u0631\u0648\u0631" }), _jsx("input", { className: "inp", type: "password", dir: "ltr", placeholder: "\u0623\u0639\u062F \u0627\u0644\u0643\u062A\u0627\u0628\u0629", value: f.pw2, onChange: u("pw2") })] })] })] }), _jsxs("div", { style: { marginTop: 12, padding: "12px 14px", background: "rgba(124,58,237,.06)", border: "1px solid rgba(124,58,237,.18)", borderRadius: 11 }, children: [_jsx("div", { style: { fontSize: 12, fontWeight: 600, color: "#A78BFA", marginBottom: 6 }, children: "\uD83C\uDF81 \u0643\u0648\u062F \u062F\u0639\u0648\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)" }), _jsx("input", { className: "inp", dir: "ltr", placeholder: "\u0645\u062B\u0627\u0644: FL-AHMED123 \u2014 +100 \u0646\u0642\u0637\u0629 \u0625\u0636\u0627\u0641\u064A\u0629!", value: f.ref, onChange: u("ref"), style: { fontSize: 13 } }), f.ref.trim() && _jsxs("div", { style: { fontSize: 11, color: "#34D399", marginTop: 5 }, children: ["\u2713 \u0633\u062A\u062D\u0635\u0644 \u0639\u0644\u0649 ", PTS.REFERRAL_RECEIVER, " \u0646\u0642\u0637\u0629 \u0639\u0646\u062F \u0627\u0644\u062A\u0633\u062C\u064A\u0644!"] })] }), _jsx(ErrBox, { msg: err }), _jsxs("button", { className: "btn btn-gold", style: { width: "100%", height: 48, fontSize: 15, marginTop: 14 }, onClick: () => { setErr(""); if (s1ok())
                                            setStep(2); }, children: ["\u0627\u0644\u062A\u0627\u0644\u064A ", _jsx(Icon, { n: "arr", sz: 14, c: "#000" })] }), _jsxs("p", { style: { textAlign: "center", fontSize: 13, color: MUTED, marginTop: 10 }, children: ["\u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628\u061F ", _jsx("button", { style: { background: "none", border: "none", color: G, cursor: "pointer", fontWeight: 700, fontSize: 13 }, onClick: () => { setMode("login"); setErr(""); }, children: "\u0633\u062C\u0651\u0644 \u062F\u062E\u0648\u0644\u0643" })] })] })), step === 2 && (_jsxs(_Fragment, { children: [_jsx("h3", { style: { fontWeight: 800, fontSize: 18, marginBottom: 5, textAlign: "center" }, children: "\u0627\u062E\u062A\u0631 \u0628\u0627\u0642\u062A\u0643" }), _jsx("p", { style: { textAlign: "center", fontSize: 12, color: MUTED, marginBottom: 14 }, children: "\u064A\u0645\u0643\u0646\u0643 \u0627\u0644\u062A\u063A\u064A\u064A\u0631 \u0644\u0627\u062D\u0642\u0627\u064B" }), _jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9, marginBottom: 14 }, children: ["free", "premium", "elite"].map((p) => _jsx(PlanOpt, { plan: p, selected: f.plan, onSelect: (k) => setF((v) => ({ ...v, plan: k })) }, p)) }), _jsx("div", { style: { display: "flex", justifyContent: "center", marginBottom: 14 }, children: _jsx(PCard, { plan: f.plan, name: f.name, compact: true }) }), _jsxs("div", { style: { display: "flex", gap: 9 }, children: [_jsx("button", { className: "btn btn-dim", style: { flex: 1, height: 46 }, onClick: () => setStep(1), children: "\u0631\u062C\u0648\u0639" }), _jsxs("button", { className: "btn btn-gold", style: { flex: 2, height: 46, fontSize: 14 }, onClick: () => { setErr(""); if (f.plan === "free")
                                                    doReg();
                                                else
                                                    setStep(3); }, children: [f.plan === "free" ? "إنشاء الحساب" : "التالي — الدفع", " ", _jsx(Icon, { n: "arr", sz: 14, c: "#000" })] })] })] })), step === 3 && (_jsxs(_Fragment, { children: [_jsx("h3", { style: { fontWeight: 800, fontSize: 18, marginBottom: 5, textAlign: "center" }, children: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062F\u0641\u0639" }), _jsxs("p", { style: { textAlign: "center", fontSize: 12, color: MUTED, marginBottom: 12 }, children: ["\u0628\u0627\u0642\u0629 ", _jsx("span", { style: { color: G, fontWeight: 700 }, children: PLANS[f.plan].label }), " \u2014 ", PLANS[f.plan].price, " \u0631.\u0633/\u0634\u0647\u0631"] }), _jsx("div", { style: { display: "flex", justifyContent: "center", marginBottom: 14 }, children: _jsx(PCard, { plan: f.plan, name: f.cn || f.name, lastFour: f.num.replace(/\s/g, "").slice(-4), compact: true }) }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 11 }, children: [_jsxs("div", { children: [_jsx(Lbl, { t: "\u0627\u0644\u0627\u0633\u0645 \u0639\u0644\u0649 \u0627\u0644\u0628\u0637\u0627\u0642\u0629" }), _jsx("input", { className: "inp", dir: "ltr", placeholder: "AHMED MOHAMMED", style: { textTransform: "uppercase" }, value: f.cn, onChange: (e) => setF((v) => ({ ...v, cn: e.target.value.toUpperCase() })) })] }), _jsxs("div", { children: [_jsx(Lbl, { t: "\u0631\u0642\u0645 \u0627\u0644\u0628\u0637\u0627\u0642\u0629" }), _jsx("input", { className: "inp font-mono", dir: "ltr", placeholder: "1234 5678 9012 3456", maxLength: 19, value: f.num, onChange: (e) => setF((v) => ({ ...v, num: fmtCard(e.target.value) })) })] }), _jsxs("div", { style: { display: "flex", gap: 11 }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx(Lbl, { t: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621" }), _jsx("input", { className: "inp font-mono", dir: "ltr", placeholder: "MM/YY", maxLength: 5, value: f.exp, onChange: (e) => setF((v) => ({ ...v, exp: fmtExp(e.target.value) })) })] }), _jsxs("div", { style: { flex: 1 }, children: [_jsx(Lbl, { t: "CVV" }), _jsx("input", { className: "inp font-mono", type: "password", dir: "ltr", placeholder: "\u2022\u2022\u2022", maxLength: 4, value: f.cvv, onChange: (e) => setF((v) => ({ ...v, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })) })] })] })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "rgba(16,185,129,.06)", border: "1px solid rgba(16,185,129,.14)", borderRadius: 9, marginTop: 10, fontSize: 11, color: "#34D399" }, children: [_jsx(Icon, { n: "shld", sz: 12 }), "\u0645\u0624\u0645\u0651\u0646 \u0628\u062A\u0634\u0641\u064A\u0631 SSL 256-bit"] }), _jsx(ErrBox, { msg: err }), _jsxs("div", { style: { display: "flex", gap: 9, marginTop: 13 }, children: [_jsx("button", { className: "btn btn-dim", style: { flex: 1, height: 46 }, onClick: () => setStep(2), children: "\u0631\u062C\u0648\u0639" }), _jsxs("button", { className: "btn btn-gold", style: { flex: 2, height: 46, fontSize: 14 }, onClick: doReg, disabled: isLoading, children: [_jsx(Icon, { n: "card", sz: 14, c: "#000" }), isLoading ? "جارٍ المعالجة..." : `ادفع ${PLANS[f.plan].price} ر.س`] })] })] }))] }))] }) }) }));
};
export default AuthModal;
