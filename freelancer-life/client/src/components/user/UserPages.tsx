import { FC, useState, useMemo } from "react";
import { User, Discount, PtReward, Plan, Category } from "../../types";
import { PLANS, PLAN_ORDER, CATS, PTS, JOBS } from "../../constants";
import { daysSince, fmtCard, fmtExp } from "../../lib/helpers";
import { Avatar, PtsBadge, QR } from "../shared/Micro";
import DiscountCard from "../shared/DiscountCard";
import PCard from "../shared/PCard";
import Icon from "../shared/Icon";

const G = "#C9A84C", GL = "#E8C76A", MUTED = "#8B7040", BG2 = "#080600", BORDER = "rgba(201,168,76,.14)";

// ── OVERVIEW ──────────────────────────────────────────────────
export const UOverview: FC<{ user: User; discounts: Discount[]; rewards: PtReward[]; onNav: (s: string) => void; onRedeem: (r: PtReward) => void }> = ({ user, discounts, rewards, onNav, onRedeem }) => {
  const approved = discounts.filter((d) => d.status === "approved");
  return (
    <div>
      <div className="animate-fade-up" style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 3 }}>مرحبًا، <span className="grad-text">{user.name.split(" ")[0]}</span> 👋</h1>
        <p style={{ fontSize: 13, color: MUTED }}>ملخص حسابك ورصيد نقاطك</p>
      </div>

      <div className="animate-fade-up" style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <PCard plan={user.plan} name={user.name} lastFour={user.card?.lastFour} pts={user.points} />
        <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 10 }}>
          {/* points hero */}
          <div className="pt-card" style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Icon n="sparkles" sz={16} c="#A78BFA" /><span style={{ fontSize: 12, color: "#A78BFA", fontWeight: 600 }}>رصيد النقاط</span></div>
              <button className="btn btn-purple" style={{ height: 28, padding: "0 12px", fontSize: 11 }} onClick={() => onNav("points")}>صرف النقاط</button>
            </div>
            <div className="font-mono" style={{ fontSize: 32, fontWeight: 900, color: "#A78BFA" }}>{(user.points || 0).toLocaleString()}</div>
            <div style={{ fontSize: 11, color: "#7C3AED", marginTop: 3 }}>{user.pointsSpent || 0} نقطة مُستخدَمة · {user.referrals?.length || 0} إحالة ناجحة</div>
            <div className="prog-bar" style={{ marginTop: 8 }}><div className="prog-fill-purple" style={{ width: `${Math.min((user.points / 2000) * 100, 100)}%` }} /></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#7C3AED", marginTop: 4 }}>
              <span>المستوى</span><span>{user.points >= 2000 ? "ذهبي ✦" : user.points >= 500 ? "فضي" : "برونزي"}</span>
            </div>
          </div>
          {/* referral */}
          <div style={{ padding: "12px 14px", background: "rgba(201,168,76,.06)", border: `1px solid rgba(201,168,76,.22)`, borderRadius: 12 }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>كود الدعوة الخاص بك</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="font-mono" style={{ fontSize: 14, fontWeight: 700, color: G, flex: 1 }}>{user.referralCode}</div>
              <button className="btn btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11 }} onClick={() => navigator.clipboard?.writeText(user.referralCode)}><Icon n="copy" sz={11} />نسخ</button>
            </div>
            <div style={{ fontSize: 10, color: MUTED, marginTop: 5 }}>+{PTS.REFERRAL_SENDER} نقطة لك + {PTS.REFERRAL_RECEIVER} نقطة لصديقك</div>
          </div>
          {user.plan !== "elite" && <button className="btn btn-gold" style={{ height: 38, fontSize: 13 }} onClick={() => onNav("upgrade")}><Icon n="crown" sz={14} c="#000" />ترقية الباقة</button>}
        </div>
      </div>

      {/* stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 11, marginBottom: 18 }}>
        {[["pct", "مسحات", user.scans || 0, G], ["trend", "وفّرت", `${(user.saved || 0).toFixed(0)} ر.س`, "#34D399"], ["userPlus", "إحالات", user.referrals?.length || 0, "#A78BFA"], ["clk", "أيام عضوية", daysSince(user.createdAt), GL]].map(([ico, lbl, val, c], i) => (
          <div key={i} className="card animate-fade-up" style={{ padding: 14, animationDelay: `${i * 0.04}s` }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(201,168,76,.07)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, border: `1px solid ${BORDER}` }}><Icon n={ico as string} sz={13} c={G} /></div>
            <div className="font-mono" style={{ fontSize: 19, fontWeight: 800, color: c as string, marginBottom: 2 }}>{val as string}</div>
            <div style={{ fontSize: 11, color: MUTED }}>{lbl as string}</div>
          </div>
        ))}
      </div>

      {/* rewards preview */}
      {rewards.length > 0 && (
        <div className="card" style={{ padding: 20, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon n="trophy" sz={16} c="#A78BFA" /><span style={{ fontWeight: 700, fontSize: 14, color: "#A78BFA" }}>مكافآت النقاط من شركائنا</span></div>
            <button className="btn btn-ghost" style={{ height: 30, fontSize: 12, padding: "0 12px", border: "1px solid rgba(124,58,237,.3)", color: "#A78BFA" }} onClick={() => onNav("points")}>عرض الكل</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
            {rewards.slice(0, 4).map((r) => (
              <div key={r.id} className="pt-card" style={{ padding: 14, borderRadius: 12 }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{r.company.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 3 }}>{r.description}</div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 10 }}>{r.company.name}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <PtsBadge pts={r.points} />
                  <button className="btn btn-purple" style={{ height: 28, padding: "0 10px", fontSize: 11 }} onClick={() => (user.points || 0) >= r.points && onRedeem(r)} disabled={(user.points || 0) < r.points}>صرف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* quick actions */}
      <div className="card" style={{ padding: 20, marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: G, marginBottom: 14 }}>إجراءات سريعة</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9 }}>
          {[["qr", "هويتي", "myid"], ["pct", "الخصومات", "discs"], ["gift", "دعوة صديق", "invite"], ["cog", "الإعدادات", "settings"]].map(([ico, lbl, nav]) => (
            <button key={nav as string} className="btn btn-dim" style={{ height: 70, flexDirection: "column", gap: 7, fontSize: 12 }} onClick={() => onNav(nav as string)}>
              <Icon n={ico as string} sz={20} c={G} />{lbl as string}
            </button>
          ))}
        </div>
      </div>

      {/* latest discounts */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: G }}>أحدث الخصومات</span>
          <button className="btn btn-ghost" style={{ height: 30, fontSize: 12, padding: "0 12px" }} onClick={() => onNav("discs")}>عرض الكل</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 11 }}>
          {approved.slice(0, 3).map((d) => <DiscountCard key={d.id} d={d} userPlan={user.plan} />)}
        </div>
      </div>
    </div>
  );
};

// ── DISCOUNTS ─────────────────────────────────────────────────
export const UDiscs: FC<{ user: User; discounts: Discount[]; onUse: (d: Discount) => void }> = ({ user, discounts, onUse }) => {
  const [cat, setCat] = useState<Category | "all">("all");
  const [tier, setTier] = useState<Plan | "all">("all");
  const [q, setQ] = useState("");
  const approved = discounts.filter((d) => d.status === "approved");
  const items = useMemo(() => approved.filter((d) => (cat === "all" || d.category === cat) && (tier === "all" || d.tier === tier) && (!q || (d.name + d.description + d.city).includes(q))), [approved, cat, tier, q]);

  return (
    <div>
      <div style={{ marginBottom: 20 }}><h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 3 }}>الخصومات والعروض</h1><p style={{ fontSize: 13, color: MUTED }}>استخدم خصمًا واكسب نقاطاً!</p></div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 12 }}>
        {[{ k: "all" as const, l: "الكل" }, ...(Object.entries(CATS) as [Category, string][]).map(([k, l]) => ({ k, l }))].map(({ k, l }) => (
          <button key={k} className={`tab ${cat === k ? "tab-active" : ""}`} onClick={() => setCat(k)}>{l}</button>
        ))}
        <div style={{ width: 1, background: BORDER, margin: "0 4px" }} />
        {[{ k: "all" as const, l: "كل الباقات" }, { k: "free" as const, l: "🆓" }, { k: "premium" as const, l: "⭐" }, { k: "elite" as const, l: "💎" }].map(({ k, l }) => (
          <button key={k} className={`tab ${tier === k ? "tab-active" : ""}`} style={{ fontSize: 11 }} onClick={() => setTier(k)}>{l}</button>
        ))}
      </div>
      <input className="inp" style={{ maxWidth: 300, marginBottom: 16 }} placeholder="ابحث..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(124,58,237,.06)", border: "1px solid rgba(124,58,237,.15)", borderRadius: 10, marginBottom: 14, fontSize: 12, color: "#A78BFA" }}>
        <Icon n="sparkles" sz={13} />كل استخدام لخصم = نقاط مجانية تُضاف لرصيدك تلقائيًا
        <PtsBadge pts={user.points || 0} />
      </div>
      {items.length === 0 ? <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}><p>لا توجد نتائج</p></div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {items.map((d) => <DiscountCard key={d.id} d={d} onUse={onUse} userPlan={user.plan} />)}
        </div>
      )}
    </div>
  );
};

// ── POINTS ────────────────────────────────────────────────────
export const UPoints: FC<{ user: User; rewards: PtReward[]; onRedeem: (r: PtReward) => void }> = ({ user, rewards, onRedeem }) => {
  const [tab, setTab] = useState<"rewards" | "history">("rewards");

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900 }}>نقاطي</h1>
          <PtsBadge pts={user.points || 0} size="lg" />
        </div>
        <p style={{ fontSize: 13, color: MUTED }}>صرف نقاطك في أي شركة شريكة</p>
      </div>
      <div className="card" style={{ padding: 20, marginBottom: 16, background: "linear-gradient(135deg,rgba(91,33,182,.12),rgba(124,58,237,.06))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div><div style={{ fontWeight: 700, fontSize: 14, color: "#A78BFA" }}>مستواك الحالي</div><div style={{ fontSize: 12, color: MUTED }}>{user.points >= 2000 ? "ذهبي ✦" : user.points >= 500 ? "فضي" : "برونزي"}</div></div>
          <div style={{ fontSize: 12, color: "#A78BFA" }}>{user.points >= 2000 ? "أعلى مستوى" : user.points >= 500 ? `${2000 - user.points} نقطة للذهبي` : `${500 - user.points} نقطة للفضي`}</div>
        </div>
        <div className="prog-bar"><div className="prog-fill-purple" style={{ width: `${Math.min((user.points / 2000) * 100, 100)}%` }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#7C3AED", marginTop: 5 }}><span>برونزي 0</span><span>فضي 500</span><span>ذهبي ✦ 2000</span></div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className={`tab ${tab === "rewards" ? "tab-active" : ""}`} onClick={() => setTab("rewards")}>🎁 مكافآت متاحة</button>
        <button className={`tab ${tab === "history" ? "tab-active" : ""}`} onClick={() => setTab("history")}>سجل النقاط</button>
      </div>
      {tab === "rewards" && (
        rewards.length === 0 ? <div style={{ textAlign: "center", padding: "50px 0", color: MUTED }}><p>لا توجد مكافآت متاحة</p></div> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
            {rewards.map((r) => {
              const can = (user.points || 0) >= r.points;
              return (
                <div key={r.id} className="pt-card" style={{ padding: 20, opacity: can ? 1 : 0.65 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ fontSize: 28 }}>{r.company.emoji}</div>
                    {!can && <span style={{ fontSize: 10, color: MUTED }}>نقاط غير كافية</span>}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{r.description}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>{r.company.name} · {r.company.city}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <PtsBadge pts={r.points} />
                    <button className="btn btn-purple" style={{ height: 36, padding: "0 14px", fontSize: 13 }} onClick={() => can && onRedeem(r)} disabled={!can}>{can ? "صرف الآن" : "تحتاج المزيد"}</button>
                  </div>
                  <div style={{ fontSize: 10, color: "#7C3AED", marginTop: 8 }}>صُرف {r.redeemedCount} مرة</div>
                </div>
              );
            })}
          </div>
        )
      )}
      {tab === "history" && (
        !user.transactions?.length ? <div style={{ textAlign: "center", padding: "50px 0", color: MUTED }}><p>لا توجد معاملات</p></div> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...user.transactions].reverse().map((tx) => (
              <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 15px", background: BG2, borderRadius: 12, border: `1px solid ${BORDER}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: tx.type === "earn" ? "rgba(124,58,237,.12)" : tx.type === "bonus" ? "rgba(201,168,76,.12)" : "rgba(220,38,38,.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon n={tx.icon} sz={16} c={tx.type === "earn" ? "#A78BFA" : tx.type === "bonus" ? G : "#F87171"} />
                </div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{tx.desc}</div><div style={{ fontSize: 10, color: MUTED }}>{new Date(tx.createdAt).toLocaleDateString("ar-SA")}</div></div>
                <span className="font-mono" style={{ fontWeight: 700, fontSize: 15, color: tx.type === "spend" ? "#F87171" : "#A78BFA" }}>{tx.type === "spend" ? "-" : "+"}{tx.points}</span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

// ── INVITE ────────────────────────────────────────────────────
export const UInvite: FC<{ user: User }> = ({ user }) => {
  const [copied, setCopied] = useState(false);
  const link = `https://freelancer-life.app/join?ref=${user.referralCode}`;
  const copy = (txt: string) => { navigator.clipboard?.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ maxWidth: 540 }}>
      <div style={{ marginBottom: 22 }}><h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 3 }}>دعوة الأصدقاء</h1><p style={{ fontSize: 13, color: MUTED }}>كل دعوة = {PTS.REFERRAL_SENDER} نقطة لك + {PTS.REFERRAL_RECEIVER} نقطة لصديقك</p></div>
      <div style={{ background: "linear-gradient(135deg,rgba(201,168,76,.08),rgba(139,105,20,.04))", border: "1px solid rgba(201,168,76,.25)", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🎁</div>
          <h2 className="grad-text-light" style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>شارك رمز دعوتك</h2>
        </div>
        <div style={{ background: "rgba(10,7,0,.5)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12, border: `1px solid ${BORDER}` }}>
          <span className="font-mono" style={{ fontWeight: 700, fontSize: 20, color: G, flex: 1, textAlign: "center", letterSpacing: ".1em" }}>{user.referralCode}</span>
          <button className="btn btn-gold" style={{ height: 40, padding: "0 16px", fontSize: 13 }} onClick={() => copy(user.referralCode)}><Icon n={copied ? "chk" : "copy"} sz={14} c="#000" />{copied ? "تم!" : "نسخ"}</button>
        </div>
        <div style={{ background: "rgba(10,7,0,.4)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, border: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 11, color: MUTED, flex: 1, direction: "ltr", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link}</span>
          <button className="btn btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, flexShrink: 0 }} onClick={() => copy(link)}><Icon n="link" sz={12} />نسخ الرابط</button>
        </div>
      </div>
      <div className="card" style={{ padding: 20, marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: G, marginBottom: 14 }}>إحالاتي ({user.referrals?.length || 0})</div>
        {!user.referrals?.length ? <p style={{ color: MUTED, fontSize: 13, textAlign: "center", padding: "20px 0" }}>لم تدعُ أحداً بعد!</p> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {user.referrals.map((r) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", background: BG2, borderRadius: 11, border: `1px solid ${BORDER}` }}>
                <Avatar name={r.name} sz={32} />
                <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div><div style={{ fontSize: 11, color: MUTED }}>{r.job} · انضم منذ {daysSince(r.createdAt)} يوم</div></div>
                <span className="badge badge-green">+{PTS.REFERRAL_SENDER} نقطة</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── MY ID ─────────────────────────────────────────────────────
export const UMyID: FC<{ user: User }> = ({ user }) => (
  <div style={{ maxWidth: 400, margin: "0 auto" }}>
    <div style={{ textAlign: "center", marginBottom: 22 }}><h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 3 }}>هويتي الرقمية</h1><p style={{ fontSize: 13, color: MUTED }}>اعرضها عند أي مكان شريك</p></div>
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><PCard plan={user.plan} name={user.name} lastFour={user.card?.lastFour} pts={user.points} /></div>
    <div className="card" style={{ padding: 22, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}><Avatar name={user.name} sz={50} /><div><div style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</div><div style={{ fontSize: 13, color: MUTED }}>{user.job}</div><div style={{ fontSize: 10, color: MUTED, fontFamily: "monospace", marginTop: 2 }}>{user.id}</div></div></div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}><PtsBadge pts={user.points || 0} size="lg" /><span className="badge badge-green">{user.referrals?.length || 0} إحالة</span></div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><QR sz={110} /></div>
      <p style={{ textAlign: "center", fontSize: 11, color: MUTED }}>امسح لإثبات الهوية والحصول على خصمك</p>
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      <button className="btn btn-gold" style={{ flex: 1, height: 44, fontSize: 13 }}><Icon n="shr" sz={14} c="#000" />مشاركة</button>
      <button className="btn btn-ghost" style={{ flex: 1, height: 44, fontSize: 13 }}><Icon n="arr" sz={14} />تحميل</button>
    </div>
  </div>
);

// ── UPGRADE ───────────────────────────────────────────────────
export const UUpgrade: FC<{ user: User; onUpgrade: (plan: Plan, card: { nameOnCard: string; lastFour: string; expiry: string }) => void }> = ({ user, onUpgrade }) => {
  const [sel, setSel] = useState<Plan>(user.plan === "free" ? "premium" : "elite");
  const [cn, setCn] = useState(""); const [num, setNum] = useState(""); const [exp, setExp] = useState(""); const [cvv, setCvv] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);

  if (user.plan === "elite") return <div style={{ textAlign: "center", padding: "60px 20px" }}><div style={{ fontSize: 56, marginBottom: 14 }}>💎</div><h2 className="grad-text-light" style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>أنت في الإليت</h2></div>;

  const doUp = () => {
    setErr("");
    if (!cn.trim()) { setErr("أدخل الاسم على البطاقة"); return; }
    if (num.replace(/\s/g, "").length < 16) { setErr("رقم البطاقة غير مكتمل"); return; }
    if (exp.length < 5) { setErr("تاريخ الانتهاء غير صحيح"); return; }
    if (cvv.length < 3) { setErr("CVV غير صحيح"); return; }
    setBusy(true);
    onUpgrade(sel, { nameOnCard: cn, lastFour: num.replace(/\s/g, "").slice(-4), expiry: exp });
    setBusy(false);
  };

  return (
    <div style={{ maxWidth: 460, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}><h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 3 }}>ترقية الباقة</h1></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9, marginBottom: 14 }}>
        {(["free", "premium", "elite"] as Plan[]).map((p) => (
          <div key={p} onClick={() => PLAN_ORDER[p] > PLAN_ORDER[user.plan] && setSel(p)} style={{ border: `2px solid ${sel === p ? G : "rgba(201,168,76,.1)"}`, borderRadius: 12, padding: 13, cursor: PLAN_ORDER[p] > PLAN_ORDER[user.plan] ? "pointer" : "default", opacity: PLAN_ORDER[p] <= PLAN_ORDER[user.plan] ? 0.4 : 1, background: sel === p ? "rgba(201,168,76,.08)" : "transparent", transition: "all .22s" }}>
            <div style={{ fontSize: 20, marginBottom: 7 }}>{p === "elite" ? "💎" : p === "premium" ? "⭐" : "🆓"}</div>
            <div style={{ fontWeight: 800, fontSize: 13, color: sel === p ? G : "#F5EDD8" }}>{PLANS[p].label}</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: sel === p ? GL : "#F5EDD8" }}>{PLANS[p].price === 0 ? "مجاني" : `${PLANS[p].price} ر.س`}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><PCard plan={sel} name={cn || user.name} lastFour={num.replace(/\s/g, "").slice(-4)} compact /></div>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: G, marginBottom: 14 }}>تفاصيل الدفع</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>الاسم على البطاقة</label><input className="inp" dir="ltr" style={{ textTransform: "uppercase" }} value={cn} onChange={(e) => setCn(e.target.value.toUpperCase())} /></div>
          <div><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>رقم البطاقة</label><input className="inp font-mono" dir="ltr" placeholder="1234 5678 9012 3456" maxLength={19} value={num} onChange={(e) => setNum(fmtCard(e.target.value))} /></div>
          <div style={{ display: "flex", gap: 11 }}>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>تاريخ الانتهاء</label><input className="inp font-mono" dir="ltr" placeholder="MM/YY" maxLength={5} value={exp} onChange={(e) => setExp(fmtExp(e.target.value))} /></div>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>CVV</label><input className="inp font-mono" type="password" dir="ltr" placeholder="•••" maxLength={4} value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} /></div>
          </div>
        </div>
        {err && <div style={{ fontSize: 13, color: "#F87171", background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.18)", borderRadius: 9, padding: "9px 13px", marginTop: 8 }}>{err}</div>}
        <button className="btn btn-gold" style={{ width: "100%", height: 48, fontSize: 14, marginTop: 13 }} onClick={doUp} disabled={busy || sel === user.plan}>
          <Icon n="card" sz={14} c="#000" />{busy ? "جارٍ..." : `ترقية إلى ${PLANS[sel].label} — ${PLANS[sel].price} ر.س`}
        </button>
      </div>
    </div>
  );
};

// ── SETTINGS ──────────────────────────────────────────────────
export const USettings: FC<{ user: User; onSave: (n: string, j: string) => void; onPwChange: (cp: string, np: string) => void; onDelete: () => void }> = ({ user, onSave, onPwChange, onDelete }) => {
  const [name, setName] = useState(user.name); const [job, setJob] = useState(user.job);
  const [cp, setCp] = useState(""); const [np, setNp] = useState("");

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ marginBottom: 22 }}><h1 style={{ fontSize: 22, fontWeight: 900 }}>الإعدادات</h1></div>
      <div className="card" style={{ padding: 22, marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: G, marginBottom: 14 }}>الملف الشخصي</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 12, background: BG2, borderRadius: 11, marginBottom: 16, border: `1px solid ${BORDER}` }}>
          <Avatar name={user.name} sz={46} />
          <div><div style={{ fontWeight: 700, fontSize: 15 }}>{user.name}</div><div style={{ fontSize: 12, color: MUTED }}>{user.email}</div><div style={{ marginTop: 4, display: "flex", gap: 6 }}><span className="badge badge-gold">{PLANS[user.plan].label}</span><PtsBadge pts={user.points || 0} /></div></div>
        </div>
        <div style={{ display: "flex", gap: 11, marginBottom: 13 }}>
          <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>الاسم</label><input className="inp" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>المهنة</label><select className="inp" value={job} onChange={(e) => setJob(e.target.value)}>{JOBS.map((j) => <option key={j}>{j}</option>)}</select></div>
        </div>
        <button className="btn btn-gold" style={{ height: 42, padding: "0 20px", fontSize: 13 }} onClick={() => onSave(name, job)}><Icon n="chk" sz={13} c="#000" />حفظ</button>
      </div>
      <div className="card" style={{ padding: 22, marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: G, marginBottom: 14 }}>تغيير كلمة المرور</div>
        <div style={{ display: "flex", gap: 11, marginBottom: 13 }}>
          <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>الحالية</label><input className="inp" type="password" dir="ltr" value={cp} onChange={(e) => setCp(e.target.value)} /></div>
          <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>الجديدة</label><input className="inp" type="password" dir="ltr" value={np} onChange={(e) => setNp(e.target.value)} /></div>
        </div>
        <button className="btn btn-ghost" style={{ height: 40, padding: "0 18px", fontSize: 13 }} onClick={() => { onPwChange(cp, np); setCp(""); setNp(""); }}>تحديث</button>
      </div>
      {user.card && (
        <div className="card" style={{ padding: 22, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: G, marginBottom: 14 }}>بطاقتك المسجلة</div>
          <div style={{ display: "flex", justifyContent: "center" }}><PCard plan={user.plan} name={user.card.nameOnCard} lastFour={user.card.lastFour} compact pts={user.points} /></div>
        </div>
      )}
      <div className="card" style={{ padding: 22, border: "1px solid rgba(220,38,38,.15)", background: "rgba(220,38,38,.02)" }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#F87171", marginBottom: 8 }}>⚠️ منطقة الخطر</div>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>حذف الحساب نهائي.</p>
        <button className="btn btn-danger" style={{ height: 40, padding: "0 18px", fontSize: 13 }} onClick={onDelete}><Icon n="bin" sz={13} />حذف حسابي</button>
      </div>
    </div>
  );
};
