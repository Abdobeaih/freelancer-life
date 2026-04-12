import { FC, useState } from "react";
import { Plan } from "../../types";
import { PLANS, JOBS, PTS } from "../../constants";
import { fmtCard, fmtExp } from "../../lib/helpers";
import { useAuthStore, RegisterData } from "../../store/auth.store";
import { useToastStore } from "../../store/toast.store";
import Icon from "../shared/Icon";
import PCard from "../shared/PCard";

interface AuthModalProps { initMode: "login" | "register"; onClose: () => void; }

const BORDER = "rgba(201,168,76,.14)";
const G = "#C9A84C";
const MUTED = "#8B7040";
const BG2 = "#080600";

const Lbl: FC<{ t: string }> = ({ t }) => (
  <label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>{t}</label>
);
const ErrBox: FC<{ msg: string }> = ({ msg }) =>
  msg ? <div style={{ fontSize: 13, color: "#F87171", background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.18)", borderRadius: 9, padding: "9px 13px", marginTop: 8 }}>{msg}</div> : null;

const PlanOpt: FC<{ plan: Plan; selected: Plan; onSelect: (p: Plan) => void }> = ({ plan, selected, onSelect }) => {
  const p = PLANS[plan]; const active = selected === plan;
  return (
    <div onClick={() => onSelect(plan)} style={{ border: `2px solid ${active ? G : "rgba(201,168,76,.1)"}`, borderRadius: 12, padding: 13, cursor: "pointer", transition: "all .22s", background: active ? "rgba(201,168,76,.08)" : "transparent", position: "relative" }}>
      {active && <div style={{ position: "absolute", top: 9, right: 9, width: 17, height: 17, borderRadius: "50%", background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon n="chk" sz={10} c="#000" /></div>}
      <div style={{ fontSize: 20, marginBottom: 7 }}>{plan === "elite" ? "💎" : plan === "premium" ? "⭐" : "🆓"}</div>
      <div style={{ fontWeight: 800, fontSize: 13, color: active ? G : "#F5EDD8", marginBottom: 2 }}>{p.label}</div>
      <div style={{ fontSize: 17, fontWeight: 900, color: active ? "#E8C76A" : "#F5EDD8", marginBottom: 7 }}>
        {p.price === 0 ? "مجاني" : `${p.price} ر.س`}<span style={{ fontSize: 9, fontWeight: 400, color: MUTED }}>{p.price ? "/شهر" : ""}</span>
      </div>
      {p.perks.slice(0, 3).map((k) => (
        <div key={k} style={{ fontSize: 10, color: MUTED, display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
          <Icon n="chk" sz={9} c={active ? G : MUTED} />{k}
        </div>
      ))}
    </div>
  );
};

const Steps: FC<{ cur: number; steps: string[] }> = ({ cur, steps }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 22 }}>
    {steps.map((s, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{ width: 27, height: 27, borderRadius: "50%", background: cur > i ? "linear-gradient(135deg,#8B6914,#C9A84C)" : "transparent", border: `2px solid ${cur >= i ? G : MUTED}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: cur > i ? "#000" : cur === i ? G : MUTED, transition: "all .3s" }}>
            {cur > i ? <Icon n="chk" sz={12} /> : i + 1}
          </div>
          <span style={{ fontSize: 9, color: cur >= i ? G : MUTED }}>{s}</span>
        </div>
        {i < steps.length - 1 && <div style={{ height: 1, width: 30, margin: "0 5px", marginBottom: 16, background: cur > i ? G : MUTED, transition: "background .3s" }} />}
      </div>
    ))}
  </div>
);

const AuthModal: FC<AuthModalProps> = ({ initMode, onClose }) => {
  const { login, register, isLoading } = useAuthStore();
  const { show: toast } = useToastStore();
  const [mode, setMode] = useState(initMode);
  const [step, setStep] = useState(1);
  const [lt, setLt] = useState<"user" | "company" | "admin">("user");
  const [err, setErr] = useState("");
  const [f, setF] = useState({ email: "", pw: "", name: "", job: "", pw2: "", plan: "free" as Plan, cn: "", num: "", exp: "", cvv: "", ref: "" });
  const u = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  const s1ok = () => {
    if (!f.name.trim() || !f.email.trim() || !f.job || !f.pw) { setErr("يرجى ملء جميع الحقول"); return false; }
    if (!f.email.includes("@")) { setErr("بريد إلكتروني غير صحيح"); return false; }
    if (f.pw.length < 6) { setErr("كلمة المرور 6 أحرف على الأقل"); return false; }
    if (f.pw !== f.pw2) { setErr("كلمتا المرور غير متطابقتين"); return false; }
    return true;
  };

  const doLogin = async () => {
    setErr("");
    if (!f.email || !f.pw) { setErr("يرجى ملء الحقول"); return; }
    try {
      await login(f.email.trim(), f.pw, lt);
      onClose();
      toast(`مرحبًا! 👋`);
    } catch (e: any) {
      setErr(e.response?.data?.error ?? "خطأ في الدخول");
    }
  };

  const doReg = async () => {
    setErr("");
    if (f.plan !== "free") {
      if (!f.cn.trim()) { setErr("أدخل الاسم على البطاقة"); return; }
      if (f.num.replace(/\s/g, "").length < 16) { setErr("رقم البطاقة غير مكتمل"); return; }
      if (f.exp.length < 5) { setErr("تاريخ الانتهاء غير صحيح"); return; }
      if (f.cvv.length < 3) { setErr("CVV غير صحيح"); return; }
    }
    const payload: RegisterData = {
      name: f.name.trim(), email: f.email.trim(), password: f.pw, job: f.job, plan: f.plan,
      referralCode: f.ref.trim() || undefined,
      card: f.plan !== "free" ? { nameOnCard: f.cn, lastFour: f.num.replace(/\s/g, "").slice(-4), expiry: f.exp } : null,
    };
    try {
      await register(payload);
      onClose();
      toast(`تم إنشاء حسابك! 🎉`, "points");
    } catch (e: any) {
      setErr(e.response?.data?.error ?? "خطأ في التسجيل");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,.92)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="animate-scale-in" style={{ background: BG2, border: "1px solid rgba(201,168,76,.22)", borderRadius: 20, width: "100%", maxWidth: 490, position: "relative", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ padding: 28 }}>
          <button className="btn btn-dim" onClick={onClose} style={{ position: "absolute", top: 14, left: 14, width: 29, height: 29, padding: 0, borderRadius: 8, zIndex: 5 }}><Icon n="x" sz={13} /></button>

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 22 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><Icon n="zap" sz={22} c="#000" /></div>
                <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 3 }}>تسجيل الدخول</h2>
              </div>
              <div style={{ display: "flex", gap: 5, marginBottom: 18, padding: 4, background: "rgba(201,168,76,.04)", borderRadius: 10, border: `1px solid ${BORDER}` }}>
                {([["user", "مستخدم"], ["company", "شركة شريكة"], ["admin", "إدارة"]] as const).map(([k, l]) => (
                  <button key={k} className={`btn ${lt === k ? "btn-gold" : "btn-dim"}`} style={{ flex: 1, height: 34, fontSize: 12 }} onClick={() => { setLt(k); setErr(""); }}>{l}</button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div><Lbl t={lt === "admin" ? "المعرّف" : "البريد الإلكتروني"} /><input className="inp" dir="ltr" placeholder={lt === "admin" ? "adham" : "email@example.com"} value={f.email} onChange={u("email")} onKeyDown={(e) => e.key === "Enter" && doLogin()} /></div>
                <div><Lbl t="كلمة المرور" /><input className="inp" type="password" dir="ltr" placeholder="••••••••" value={f.pw} onChange={u("pw")} onKeyDown={(e) => e.key === "Enter" && doLogin()} /></div>
                <ErrBox msg={err} />
                <button className="btn btn-gold" style={{ width: "100%", height: 48, fontSize: 15, marginTop: 4 }} onClick={doLogin} disabled={isLoading}>{isLoading ? "جارٍ الدخول..." : "دخول"}</button>
                {lt === "user" && <p style={{ textAlign: "center", fontSize: 13, color: MUTED }}>ليس لديك حساب؟ <button style={{ background: "none", border: "none", color: G, cursor: "pointer", fontWeight: 700, fontSize: 13 }} onClick={() => { setMode("register"); setStep(1); setErr(""); }}>سجّل الآن</button></p>}
              </div>
            </>
          )}

          {/* ── REGISTER ── */}
          {mode === "register" && (
            <>
              <Steps cur={step - 1} steps={["معلوماتك", "الباقة", "الدفع"]} />

              {step === 1 && (
                <>
                  <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, textAlign: "center" }}>معلوماتك الشخصية</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    <div><Lbl t="الاسم الكامل" /><input className="inp" placeholder="أحمد محمد الخالد" value={f.name} onChange={u("name")} /></div>
                    <div style={{ display: "flex", gap: 11 }}>
                      <div style={{ flex: 1 }}><Lbl t="المهنة" /><select className="inp" value={f.job} onChange={u("job")}><option value="">اختر مهنتك</option>{JOBS.map((j) => <option key={j}>{j}</option>)}</select></div>
                      <div style={{ flex: 1 }}><Lbl t="البريد" /><input className="inp" dir="ltr" placeholder="you@email.com" value={f.email} onChange={u("email")} /></div>
                    </div>
                    <div style={{ display: "flex", gap: 11 }}>
                      <div style={{ flex: 1 }}><Lbl t="كلمة المرور" /><input className="inp" type="password" dir="ltr" placeholder="6 أحرف+" value={f.pw} onChange={u("pw")} /></div>
                      <div style={{ flex: 1 }}><Lbl t="تأكيد المرور" /><input className="inp" type="password" dir="ltr" placeholder="أعد الكتابة" value={f.pw2} onChange={u("pw2")} /></div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(124,58,237,.06)", border: "1px solid rgba(124,58,237,.18)", borderRadius: 11 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#A78BFA", marginBottom: 6 }}>🎁 كود دعوة (اختياري)</div>
                    <input className="inp" dir="ltr" placeholder="مثال: FL-AHMED123 — +100 نقطة إضافية!" value={f.ref} onChange={u("ref")} style={{ fontSize: 13 }} />
                    {f.ref.trim() && <div style={{ fontSize: 11, color: "#34D399", marginTop: 5 }}>✓ ستحصل على {PTS.REFERRAL_RECEIVER} نقطة عند التسجيل!</div>}
                  </div>
                  <ErrBox msg={err} />
                  <button className="btn btn-gold" style={{ width: "100%", height: 48, fontSize: 15, marginTop: 14 }} onClick={() => { setErr(""); if (s1ok()) setStep(2); }}>التالي <Icon n="arr" sz={14} c="#000" /></button>
                  <p style={{ textAlign: "center", fontSize: 13, color: MUTED, marginTop: 10 }}>لديك حساب؟ <button style={{ background: "none", border: "none", color: G, cursor: "pointer", fontWeight: 700, fontSize: 13 }} onClick={() => { setMode("login"); setErr(""); }}>سجّل دخولك</button></p>
                </>
              )}

              {step === 2 && (
                <>
                  <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 5, textAlign: "center" }}>اختر باقتك</h3>
                  <p style={{ textAlign: "center", fontSize: 12, color: MUTED, marginBottom: 14 }}>يمكنك التغيير لاحقاً</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9, marginBottom: 14 }}>
                    {(["free", "premium", "elite"] as Plan[]).map((p) => <PlanOpt key={p} plan={p} selected={f.plan} onSelect={(k) => setF((v) => ({ ...v, plan: k }))} />)}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><PCard plan={f.plan} name={f.name} compact /></div>
                  <div style={{ display: "flex", gap: 9 }}>
                    <button className="btn btn-dim" style={{ flex: 1, height: 46 }} onClick={() => setStep(1)}>رجوع</button>
                    <button className="btn btn-gold" style={{ flex: 2, height: 46, fontSize: 14 }} onClick={() => { setErr(""); if (f.plan === "free") doReg(); else setStep(3); }}>
                      {f.plan === "free" ? "إنشاء الحساب" : "التالي — الدفع"} <Icon n="arr" sz={14} c="#000" />
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 5, textAlign: "center" }}>تفاصيل الدفع</h3>
                  <p style={{ textAlign: "center", fontSize: 12, color: MUTED, marginBottom: 12 }}>باقة <span style={{ color: G, fontWeight: 700 }}>{PLANS[f.plan].label}</span> — {PLANS[f.plan].price} ر.س/شهر</p>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><PCard plan={f.plan} name={f.cn || f.name} lastFour={f.num.replace(/\s/g, "").slice(-4)} compact /></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                    <div><Lbl t="الاسم على البطاقة" /><input className="inp" dir="ltr" placeholder="AHMED MOHAMMED" style={{ textTransform: "uppercase" }} value={f.cn} onChange={(e) => setF((v) => ({ ...v, cn: e.target.value.toUpperCase() }))} /></div>
                    <div><Lbl t="رقم البطاقة" /><input className="inp font-mono" dir="ltr" placeholder="1234 5678 9012 3456" maxLength={19} value={f.num} onChange={(e) => setF((v) => ({ ...v, num: fmtCard(e.target.value) }))} /></div>
                    <div style={{ display: "flex", gap: 11 }}>
                      <div style={{ flex: 1 }}><Lbl t="تاريخ الانتهاء" /><input className="inp font-mono" dir="ltr" placeholder="MM/YY" maxLength={5} value={f.exp} onChange={(e) => setF((v) => ({ ...v, exp: fmtExp(e.target.value) }))} /></div>
                      <div style={{ flex: 1 }}><Lbl t="CVV" /><input className="inp font-mono" type="password" dir="ltr" placeholder="•••" maxLength={4} value={f.cvv} onChange={(e) => setF((v) => ({ ...v, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} /></div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "rgba(16,185,129,.06)", border: "1px solid rgba(16,185,129,.14)", borderRadius: 9, marginTop: 10, fontSize: 11, color: "#34D399" }}>
                    <Icon n="shld" sz={12} />مؤمّن بتشفير SSL 256-bit
                  </div>
                  <ErrBox msg={err} />
                  <div style={{ display: "flex", gap: 9, marginTop: 13 }}>
                    <button className="btn btn-dim" style={{ flex: 1, height: 46 }} onClick={() => setStep(2)}>رجوع</button>
                    <button className="btn btn-gold" style={{ flex: 2, height: 46, fontSize: 14 }} onClick={doReg} disabled={isLoading}>
                      <Icon n="card" sz={14} c="#000" />{isLoading ? "جارٍ المعالجة..." : `ادفع ${PLANS[f.plan].price} ر.س`}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
