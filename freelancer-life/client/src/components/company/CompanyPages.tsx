import { FC, useState } from "react";
import { Company, Discount, Category, Plan } from "../../types";
import { CATS, CAT_EMO } from "../../constants";
import { Bars, PtsBadge } from "../shared/Micro";
import PCard from "../shared/PCard";
import Icon from "../shared/Icon";

const G = "#C9A84C", MUTED = "#8B7040", BG2 = "#080600", BORDER = "rgba(201,168,76,.14)";

// ── OVERVIEW ──────────────────────────────────────────────────
export const COverview: FC<{ co: Company; discounts: Discount[] }> = ({ co, discounts }) => {
  const myD = discounts.filter((d) => d.companyId === co.id);
  const approved = myD.filter((d) => d.status === "approved");
  const pending  = myD.filter((d) => d.status === "pending");
  const uses     = approved.reduce((a, d) => a + (d.uses || 0), 0);
  const totalRed = co.ptRewards?.reduce((a, r) => a + r.redeemedCount, 0) ?? 0;
  const weekly   = [8, 12, 10, 18, 14, 20, 16];

  return (
    <div>
      <div className="animate-fade-up" style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(201,168,76,.07)", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${BORDER}` }}>{co.emoji}</div>
          <div><h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 2 }}>{co.name}</h1><p style={{ fontSize: 13, color: MUTED }}>{CATS[co.category]} · {co.city}</p></div>
        </div>
        {co.status !== "approved" && (
          <div style={{ padding: "11px 16px", background: "rgba(251,191,36,.06)", border: "1px solid rgba(251,191,36,.2)", borderRadius: 11, display: "flex", gap: 9, alignItems: "center", fontSize: 13, color: "#FCD34D" }}>
            <Icon n="clk" sz={14} />حسابك قيد المراجعة
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[["eye","مشاهدات",co.views||0],["tags","عروض معتمدة",approved.length],["trend","استخدامات",uses],["coins","صرف نقاط",totalRed]].map(([ico,lbl,val],i)=>(
          <div key={i} className={`card animate-fade-up`} style={{ padding: 14, animationDelay: `${i * 0.04}s` }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(201,168,76,.07)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 9 }}><Icon n={ico as string} sz={14} c={G} /></div>
            <div className="font-mono" style={{ fontSize: 20, fontWeight: 900, color: G, marginBottom: 3 }}>{val as number}</div>
            <div style={{ fontSize: 11, color: MUTED }}>{lbl as string}</div>
          </div>
        ))}
      </div>

      {co.ptRewards && co.ptRewards.length > 0 && (
        <div className="card" style={{ padding: 20, marginBottom: 14, background: "linear-gradient(135deg,rgba(91,33,182,.08),rgba(124,58,237,.03))" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><Icon n="trophy" sz={14} c="#A78BFA" /><span style={{ fontWeight: 700, fontSize: 14, color: "#A78BFA" }}>مكافآت النقاط التي تقدمها</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
            {co.ptRewards.map((r) => (
              <div key={r.id} style={{ background: "rgba(10,7,0,.4)", borderRadius: 11, padding: "12px 14px", border: "1px solid rgba(124,58,237,.18)" }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{r.description}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <PtsBadge pts={r.points} />
                  <span style={{ fontSize: 11, color: "#7C3AED" }}>{r.redeemedCount} صرف</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: G, marginBottom: 14 }}>الاستخدامات الأسبوعية</div>
          <Bars data={weekly} labels={["أحد","إث","ثل","أرب","خم","جم","سب"]} h={110} />
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: G, marginBottom: 12 }}>عروضي المعتمدة ({approved.length})</div>
          {approved.length === 0 ? <p style={{ color: MUTED, fontSize: 12 }}>لا يوجد عروض معتمدة بعد</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {approved.map((d) => (
                <div key={d.id} style={{ background: BG2, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${BORDER}` }}>
                  <div><div style={{ fontSize: 12, fontWeight: 600 }}>{d.name}</div><div style={{ fontSize: 10, color: MUTED }}>{d.uses || 0} استخدام</div></div>
                  <span style={{ fontSize: 18, fontWeight: 900, color: G }}>{d.percentage}</span>
                </div>
              ))}
            </div>
          )}
          {pending.length > 0 && (
            <div style={{ marginTop: 10, padding: "10px 12px", background: "rgba(251,191,36,.06)", borderRadius: 10, border: "1px solid rgba(251,191,36,.18)" }}>
              <span style={{ fontSize: 12, color: "#FCD34D" }}>{pending.length} طلب في انتظار الموافقة</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── ADD DISCOUNT ──────────────────────────────────────────────
export const CAddDisc: FC<{ co: Company; onSubmit: (f: any) => void }> = ({ co, onSubmit }) => {
  const [f, setF] = useState({ name: co.name, category: co.category as Category, percentage: "", description: "", city: co.city, tier: "free" as Plan });
  const [done, setDone] = useState(false);
  const u = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  if (done) return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>⏳</div>
      <h3 style={{ fontWeight: 700, fontSize: 18, color: G, marginBottom: 8 }}>تم إرسال طلبك!</h3>
      <p style={{ color: MUTED, fontSize: 13, marginBottom: 20 }}>يراجعه المدير خلال 24 ساعة.</p>
      <button className="btn btn-ghost" style={{ height: 40, padding: "0 18px", fontSize: 13 }} onClick={() => setDone(false)}>إرسال طلب آخر</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ marginBottom: 20 }}><h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 3 }}>طلب خصم جديد</h1><p style={{ fontSize: 13, color: MUTED }}>أرسل طلبك وسيراجعه المدير</p></div>
      <div style={{ padding: "11px 16px", background: "rgba(251,191,36,.06)", borderRadius: 10, border: "1px solid rgba(251,191,36,.18)", marginBottom: 16, fontSize: 13, color: "#FCD34D", display: "flex", gap: 8, alignItems: "center" }}>
        <Icon n="clk" sz={14} />تتم المراجعة خلال 24 ساعة
      </div>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>اسم العرض</label><input className="inp" value={f.name} onChange={u("name")} placeholder="خصم الفريلانسر الذهبي" /></div>
          <div style={{ display: "flex", gap: 11 }}>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>الفئة</label><select className="inp" value={f.category} onChange={u("category")}>{(Object.entries(CATS) as [Category, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>نسبة الخصم</label><input className="inp" dir="ltr" value={f.percentage} onChange={u("percentage")} placeholder="30%" /></div>
          </div>
          <div style={{ display: "flex", gap: 11 }}>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>الباقة المستهدفة</label><select className="inp" value={f.tier} onChange={u("tier")}><option value="free">مجاني للجميع</option><option value="premium">بريميوم+</option><option value="elite">إليت فقط</option></select></div>
            <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>المدينة</label><input className="inp" value={f.city} onChange={u("city")} /></div>
          </div>
          <div><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>وصف العرض</label><textarea className="inp" rows={2} value={f.description} onChange={u("description")} placeholder="وصف مختصر" style={{ resize: "none" }} /></div>
        </div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
          <PCard plan={f.tier} name={f.name.slice(0, 20) || "عرضك هنا"} compact />
        </div>
        <button className="btn btn-gold" style={{ width: "100%", height: 48, fontSize: 14, marginTop: 14 }} onClick={() => { if (!f.name || !f.percentage || !f.description || !f.city) return; onSubmit(f); setDone(true); }}>
          <Icon n="send" sz={14} c="#000" />إرسال الطلب للمدير
        </button>
      </div>
    </div>
  );
};

// ── MY DISCOUNTS ──────────────────────────────────────────────
export const CMyDiscs: FC<{ co: Company; discounts: Discount[] }> = ({ co, discounts }) => {
  const myD = discounts.filter((d) => d.companyId === co.id);
  const stBd = { approved: "badge-green", pending: "badge-yellow", rejected: "badge-red" };
  const stLbl = { approved: "✅ معتمد", pending: "⏳ معلق", rejected: "❌ مرفوض" };

  return (
    <div>
      <div style={{ marginBottom: 20 }}><h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 3 }}>عروضي</h1><p style={{ fontSize: 13, color: MUTED }}>{myD.length} عرض مُرسَل</p></div>
      {myD.length === 0 ? <div style={{ textAlign: "center", padding: "50px 0", color: MUTED }}><p>لم ترسل أي عروض بعد</p></div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {myD.map((d) => (
            <div key={d.id} className="card" style={{ padding: 18, border: `1px solid rgba(201,168,76,${d.status === "approved" ? .22 : d.status === "pending" ? .3 : .1})` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <span style={{ fontSize: 20 }}>{CAT_EMO[d.category]}</span>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 7 }}>
                <span className={`badge ${stBd[d.status]}`}>{stLbl[d.status]}</span>
                <span className="badge badge-gold">{d.percentage}</span>
                <span className="badge badge-muted">{CATS[d.category]}</span>
                <span className="badge badge-muted">{d.city}</span>
              </div>
              <p style={{ fontSize: 12, color: MUTED }}>{d.description}</p>
              {d.status === "approved" && <p style={{ fontSize: 11, color: "#34D399", marginTop: 4 }}>يُستخدم {d.uses || 0} مرة</p>}
              {d.status === "rejected" && <p style={{ fontSize: 11, color: "#F87171", marginTop: 4 }}>تم الرفض — تواصل مع الإدارة</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── SETTINGS ──────────────────────────────────────────────────
export const CSettings: FC<{ co: Company; onSave: (name: string, city: string) => void }> = ({ co, onSave }) => {
  const [name, setName] = useState(co.name); const [city, setCity] = useState(co.city);

  return (
    <div style={{ maxWidth: 460 }}>
      <div style={{ marginBottom: 20 }}><h1 style={{ fontSize: 22, fontWeight: 900 }}>إعدادات الشركة</h1></div>
      <div className="card" style={{ padding: 22, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 12, background: BG2, borderRadius: 11, marginBottom: 18, border: `1px solid ${BORDER}` }}>
          <div style={{ width: 48, height: 48, borderRadius: 13, background: "rgba(201,168,76,.07)", fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${BORDER}` }}>{co.emoji}</div>
          <div><div style={{ fontWeight: 700, fontSize: 15 }}>{co.name}</div><div style={{ fontSize: 12, color: MUTED }}>{co.email}</div><span className="badge badge-gold" style={{ marginTop: 4, display: "inline-flex" }}>{CATS[co.category]}</span></div>
        </div>
        <div style={{ display: "flex", gap: 11, marginBottom: 14 }}>
          <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>اسم الشركة</label><input className="inp" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div style={{ flex: 1 }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>المدينة</label><input className="inp" value={city} onChange={(e) => setCity(e.target.value)} /></div>
        </div>
        <button className="btn btn-gold" style={{ height: 42, padding: "0 20px", fontSize: 13 }} onClick={() => onSave(name, city)}><Icon n="chk" sz={13} c="#000" />حفظ</button>
      </div>
      {co.ptRewards && co.ptRewards.length > 0 && (
        <div className="card" style={{ padding: 20, marginBottom: 12, background: "linear-gradient(135deg,rgba(91,33,182,.08),rgba(124,58,237,.03))" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#A78BFA", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Icon n="trophy" sz={14} c="#A78BFA" />مكافآت النقاط</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {co.ptRewards.map((r) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 13px", background: "rgba(10,7,0,.4)", borderRadius: 10, border: "1px solid rgba(124,58,237,.15)" }}>
                <div><div style={{ fontSize: 13, fontWeight: 600 }}>{r.description}</div><div style={{ fontSize: 10, color: "#7C3AED" }}>صُرف {r.redeemedCount} مرة</div></div>
                <PtsBadge pts={r.points} />
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding: "11px 14px", background: "rgba(16,185,129,.05)", borderRadius: 10, border: "1px solid rgba(16,185,129,.15)", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#34D399" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulseDim 2s ease-in-out infinite" }} />
        {co.status === "approved" ? "شراكة نشطة ومعتمدة" : "في انتظار الاعتماد"}
      </div>
    </div>
  );
};
