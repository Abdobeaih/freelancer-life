import { FC, useState, useMemo } from "react";
import { User, Discount, Company, AdminStats, Status, Plan } from "../../types";
import { PLANS, CATS, CAT_EMO, MONTHS_S } from "../../constants";
import { daysSince } from "../../lib/helpers";
import { Avatar, Bars, ProgBar, PtsBadge } from "../shared/Micro";
import Modal from "../shared/Modal";
import Icon from "../shared/Icon";

const G = "#C9A84C", GL = "#E8C76A", MUTED = "#8B7040", BORDER = "rgba(201,168,76,.14)";

// ── OVERVIEW ──────────────────────────────────────────────────
export const AOverview: FC<{ stats: AdminStats; users: User[] }> = ({ stats, users }) => (
  <div>
    <div className="animate-fade-up" style={{ marginBottom: 22 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 3 }}>لوحة الإدارة</h1>
      <p style={{ fontSize: 13, color: MUTED }}>نظرة شاملة على المنصة</p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
      {[["users","مستخدمون",stats.users,G],["crown","بريميوم+إليت",stats.premium+stats.elite,GL],["zap","ر.س / شهر",stats.revenue,"#34D399"],["tags","طلبات معلقة",stats.pendingDiscounts,stats.pendingDiscounts>0?"#F87171":MUTED]].map(([ico,lbl,val,c],i)=>(
        <div key={i} className="card animate-fade-up" style={{ padding: 16, animationDelay: `${i * 0.04}s` }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(201,168,76,.07)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 9, border: `1px solid ${BORDER}` }}><Icon n={ico as string} sz={15} c={G} /></div>
          <div className="font-mono" style={{ fontSize: 24, fontWeight: 900, color: c as string, marginBottom: 3 }}>{val as number}</div>
          <div style={{ fontSize: 11, color: MUTED }}>{lbl as string}</div>
        </div>
      ))}
    </div>
    {/* points row */}
    <div className="card" style={{ padding: 18, marginBottom: 14, background: "linear-gradient(135deg,rgba(91,33,182,.08),rgba(124,58,237,.04))" }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "#A78BFA", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Icon n="sparkles" sz={14} c="#A78BFA" />نظام النقاط</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {[[stats.totalPts,"إجمالي النقاط"],[stats.totalPtSpent,"نقطة مُصرَفة"],[stats.totalRefs,"إجمالي الإحالات"],[users.filter(u=>u.points>=2000).length,"عضو ذهبي ✦"]].map(([v,l])=>(
          <div key={l as string} style={{ textAlign: "center", padding: "10px 0" }}>
            <div className="font-mono" style={{ fontSize: 20, fontWeight: 900, color: "#A78BFA", marginBottom: 3 }}>{(v as number).toLocaleString()}</div>
            <div style={{ fontSize: 10, color: "#7C3AED" }}>{l as string}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: G, marginBottom: 14 }}>نمو المستخدمين 2025</div>
        <Bars data={stats.monthlyGrowth} labels={MONTHS_S} h={110} />
      </div>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: G, marginBottom: 14 }}>توزيع الباقات</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <ProgBar val={stats.users ? (stats.users - stats.premium - stats.elite) / stats.users * 100 : 0} label="🆓 مجانية" right={stats.users - stats.premium - stats.elite} />
          <ProgBar val={stats.users ? stats.premium / stats.users * 100 : 0} label="⭐ بريميوم" right={stats.premium} />
          <ProgBar val={stats.users ? stats.elite / stats.users * 100 : 0} label="💎 إليت" right={stats.elite} />
        </div>
        <div style={{ marginTop: 14, padding: 12, background: "rgba(201,168,76,.06)", borderRadius: 11, textAlign: "center", border: `1px solid ${BORDER}` }}>
          <div className="font-mono" style={{ fontSize: 20, fontWeight: 900, color: G }}>{stats.revenue.toLocaleString()} ر.س</div>
          <div style={{ fontSize: 10, color: MUTED }}>إيرادات شهرية</div>
        </div>
      </div>
    </div>
    <div className="card" style={{ padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: G, marginBottom: 14 }}>أكثر المستخدمين إحالةً</div>
      <table>
        <thead><tr><th>المستخدم</th><th>الباقة</th><th>النقاط</th><th>الإحالات</th><th>الانضمام</th></tr></thead>
        <tbody>{[...users].sort((a, b) => (b.referrals?.length || 0) - (a.referrals?.length || 0)).slice(0, 5).map((u) => (
          <tr key={u.id}>
            <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={u.name} sz={28} />{u.name}</div></td>
            <td><span className="badge badge-gold">{PLANS[u.plan].label}</span></td>
            <td><PtsBadge pts={u.points || 0} /></td>
            <td className="font-mono" style={{ fontWeight: 700, color: "#A78BFA" }}>{u.referrals?.length || 0}</td>
            <td style={{ fontSize: 11, color: MUTED }}>{new Date(u.createdAt).toLocaleDateString("ar-SA")}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  </div>
);

// ── PENDING ───────────────────────────────────────────────────
export const APending: FC<{ discounts: Discount[]; companies: Company[]; onApprove: (id: number) => void; onReject: (id: number) => void }> = ({ discounts, companies, onApprove, onReject }) => {
  const pending = discounts.filter((d) => d.status === "pending");
  return (
    <div>
      <div style={{ marginBottom: 22 }}><h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 3 }}>طلبات الخصومات</h1><p style={{ fontSize: 13, color: MUTED }}>{pending.length} طلب في انتظار الموافقة</p></div>
      {pending.length === 0 ? <div style={{ textAlign: "center", padding: "60px 0", color: MUTED }}><div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>✅</div><p>لا توجد طلبات معلقة</p></div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pending.map((d) => {
            const co = companies.find((c) => c.id === d.companyId);
            return (
              <div key={d.id} className="card" style={{ padding: 20, border: "1px solid rgba(251,191,36,.22)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                      {co && <span style={{ fontSize: 22 }}>{co.emoji}</span>}
                      <div><div style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</div><div style={{ fontSize: 11, color: MUTED }}>{co ? co.name : "—"} · {CATS[d.category]}</div></div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 7 }}>
                      <span className="badge badge-gold">{d.percentage} خصم</span>
                      <span className="badge badge-muted">{CATS[d.category]}</span>
                      <span className="badge badge-muted">{d.city}</span>
                      <span className="badge badge-yellow">{d.tier === "elite" ? "💎 إليت" : d.tier === "premium" ? "⭐ بريميوم" : "🆓 مجاني"}</span>
                    </div>
                    <p style={{ fontSize: 12, color: MUTED }}>{d.description}</p>
                    <p style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>طُلب قبل {daysSince(d.createdAt)} يوم</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-success" style={{ height: 38, padding: "0 14px", fontSize: 13 }} onClick={() => onApprove(d.id)}><Icon n="chk" sz={14} />قبول</button>
                    <button className="btn btn-danger"  style={{ height: 38, padding: "0 14px", fontSize: 13 }} onClick={() => onReject(d.id)}><Icon n="rej" sz={14} />رفض</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── USERS ─────────────────────────────────────────────────────
export const AUsers: FC<{ users: User[]; onSetPlan: (id: string, p: Plan) => void; onDelete: (id: string) => void; onAddPts: (id: string, pts: number) => void }> = ({ users, onSetPlan, onDelete, onAddPts }) => {
  const [q, setQ] = useState(""); const [showPts, setShowPts] = useState<string | null>(null); const [ptsAmt, setPtsAmt] = useState("100");
  const fil = useMemo(() => users.filter((u) => u.name.includes(q) || u.email.includes(q)), [users, q]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div><h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 2 }}>المستخدمون</h1><p style={{ fontSize: 13, color: MUTED }}>{users.length} مستخدم</p></div>
        <input className="inp" style={{ width: 200 }} placeholder="بحث..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {showPts && (
        <Modal title="منح نقاط" onClose={() => setShowPts(null)}>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>منح نقاط لـ <span style={{ color: G }}>{users.find((u) => u.id === showPts)?.name}</span></p>
          <label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>عدد النقاط</label>
          <input className="inp font-mono" dir="ltr" value={ptsAmt} onChange={(e) => setPtsAmt(e.target.value.replace(/\D/g, ""))} style={{ marginBottom: 14 }} />
          <button className="btn btn-purple" style={{ width: "100%", height: 46, fontSize: 14 }} onClick={() => { onAddPts(showPts, parseInt(ptsAmt) || 0); setShowPts(null); }}>
            <Icon n="sparkles" sz={14} />منح {ptsAmt} نقطة
          </button>
        </Modal>
      )}
      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead><tr><th>المستخدم</th><th>البريد</th><th>الباقة</th><th>النقاط</th><th>الإحالات</th><th>الانضمام</th><th>إجراءات</th></tr></thead>
          <tbody>{fil.map((u) => (
            <tr key={u.id}>
              <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={u.name} sz={28} /><div><div style={{ fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: 10, color: MUTED, fontFamily: "monospace" }}>{u.id}</div></div></div></td>
              <td style={{ fontFamily: "monospace", fontSize: 11, color: MUTED }}>{u.email}</td>
              <td><span className="badge badge-gold">{PLANS[u.plan].label}</span></td>
              <td><PtsBadge pts={u.points || 0} /></td>
              <td className="font-mono" style={{ fontWeight: 700, color: "#A78BFA" }}>{u.referrals?.length || 0}</td>
              <td style={{ fontSize: 11, color: MUTED }}>{new Date(u.createdAt).toLocaleDateString("ar-SA")}</td>
              <td><div style={{ display: "flex", gap: 4 }}>
                <button className="btn btn-purple" style={{ height: 27, fontSize: 10, padding: "0 8px" }} onClick={() => { setShowPts(u.id); setPtsAmt("100"); }} title="منح نقاط"><Icon n="sparkles" sz={11} /></button>
                {u.plan !== "elite" && <button className="btn btn-gold" style={{ height: 27, fontSize: 10, padding: "0 8px" }} onClick={() => onSetPlan(u.id, "elite")}>💎</button>}
                {u.plan !== "premium" && <button className="btn btn-ghost" style={{ height: 27, fontSize: 10, padding: "0 8px" }} onClick={() => onSetPlan(u.id, "premium")}>⭐</button>}
                {u.plan !== "free" && <button className="btn btn-dim" style={{ height: 27, fontSize: 10, padding: "0 8px" }} onClick={() => onSetPlan(u.id, "free")}>🆓</button>}
                <button className="btn btn-danger" style={{ height: 27, fontSize: 10, padding: "0 8px" }} onClick={() => onDelete(u.id)}><Icon n="bin" sz={11} /></button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};

// ── DISCOUNTS ─────────────────────────────────────────────────
export const ADiscounts: FC<{ discounts: Discount[]; companies: Company[]; onAdd: (f: any) => void; onEdit: (f: any) => void; onDelete: (id: number) => void; onStatus: (id: number, s: Status) => void }> = ({ discounts, companies, onAdd, onEdit, onDelete, onStatus }) => {
  const [filt, setFilt] = useState<Status | "all">("all");
  const [showForm, setShowForm] = useState(false); const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({ name: "", category: "gym", percentage: "", description: "", city: "", tier: "free", companyId: "" });
  const u = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }));
  const save = () => { if (!f.name || !f.percentage || !f.description || !f.city) return; editId ? onEdit({ ...f, id: editId }) : onAdd(f); setShowForm(false); };
  const items = discounts.filter((d) => filt === "all" || d.status === filt);
  const stBd: Record<Status, string> = { approved: "badge-green", pending: "badge-yellow", rejected: "badge-red" };
  const stLbl: Record<Status, string> = { approved: "✅ مقبول", pending: "⏳ معلق", rejected: "❌ مرفوض" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div><h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 2 }}>إدارة الخصومات</h1><p style={{ fontSize: 13, color: MUTED }}>{discounts.length} خصم</p></div>
        <button className="btn btn-gold" style={{ height: 40, padding: "0 16px", fontSize: 13 }} onClick={() => { setF({ name: "", category: "gym", percentage: "", description: "", city: "", tier: "free", companyId: "" }); setEditId(null); setShowForm(true); }}><Icon n="plus" sz={14} c="#000" />إضافة</button>
      </div>
      <div style={{ display: "flex", gap: 7, marginBottom: 16 }}>
        {[{ k: "all" as const, l: "الكل" }, { k: "approved" as const, l: "✅ مقبولة" }, { k: "pending" as const, l: "⏳ معلقة" }, { k: "rejected" as const, l: "❌ مرفوضة" }].map(({ k, l }) => (
          <button key={k} className={`tab ${filt === k ? "tab-active" : ""}`} onClick={() => setFilt(k)}>{l}</button>
        ))}
      </div>
      {showForm && (
        <Modal title={editId ? "تعديل الخصم" : "خصم جديد"} onClose={() => setShowForm(false)} wide>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 11 }}>
            {[["name","اسم العرض","text"],["percentage","نسبة الخصم","text"],["city","المدينة","text"],["description","الوصف","text"]].map(([k,l])=>(
              <div key={k} style={{ flex: "1 1 47%" }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>{l}</label><input className="inp" value={(f as any)[k]} onChange={u(k)} /></div>
            ))}
            <div style={{ flex: "1 1 47%" }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>الفئة</label><select className="inp" value={f.category} onChange={u("category")}>{Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div style={{ flex: "1 1 47%" }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>الباقة</label><select className="inp" value={f.tier} onChange={u("tier")}><option value="free">مجاني</option><option value="premium">بريميوم+</option><option value="elite">إليت فقط</option></select></div>
            <div style={{ flex: "1 1 100%" }}><label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 5, fontWeight: 600 }}>الشركة الشريكة</label><select className="inp" value={f.companyId} onChange={u("companyId")}><option value="">لا يوجد</option>{companies.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}</select></div>
          </div>
          <button className="btn btn-gold" style={{ width: "100%", height: 46, fontSize: 14, marginTop: 14 }} onClick={save}>حفظ الخصم</button>
        </Modal>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 12 }}>
        {items.map((d) => (
          <div key={d.id} className="card" style={{ padding: 16, border: `1px solid rgba(201,168,76,${d.status==="pending"?.28:.1})` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 11 }}>
              <div style={{ fontSize: 22 }}>{CAT_EMO[d.category]}</div>
              <span className={`badge ${stBd[d.status]}`}>{stLbl[d.status]}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{d.name}</div>
            {d.company && <div style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>{d.company.emoji} {d.company.name}</div>}
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 9, lineHeight: 1.5 }}>{d.description}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: G }}>{d.percentage}</span>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 9, color: MUTED }}>{CATS[d.category]}</div><div style={{ fontSize: 9, color: MUTED }}>{d.city}</div></div>
            </div>
            {d.status === "pending" && (
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <button className="btn btn-success" style={{ flex: 1, height: 30, fontSize: 11 }} onClick={() => onStatus(d.id, "approved")}><Icon n="chk" sz={11} />قبول</button>
                <button className="btn btn-danger"  style={{ flex: 1, height: 30, fontSize: 11 }} onClick={() => onStatus(d.id, "rejected")}><Icon n="rej" sz={11} />رفض</button>
              </div>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn btn-dim" style={{ flex: 1, height: 28, fontSize: 11 }} onClick={() => { setF({ name: d.name, category: d.category, percentage: d.percentage, description: d.description, city: d.city, tier: d.tier, companyId: d.companyId ?? "" }); setEditId(d.id); setShowForm(true); }}><Icon n="edit" sz={11} />تعديل</button>
              <button className="btn btn-danger" style={{ flex: 1, height: 28, fontSize: 11 }} onClick={() => onDelete(d.id)}><Icon n="bin" sz={11} />حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── ANALYTICS ─────────────────────────────────────────────────
export const AAnalytics: FC<{ stats: AdminStats; discounts: Discount[]; companies: Company[]; users: User[] }> = ({ stats, discounts, companies, users }) => {
  const approved = discounts.filter((d) => d.status === "approved");
  const topDiscs = [...approved].sort((a, b) => b.uses - a.uses).slice(0, 5);
  const maxU = Math.max(...topDiscs.map((d) => d.uses), 1);

  return (
    <div>
      <div style={{ marginBottom: 22 }}><h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 3 }}>التحليلات</h1></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 11, marginBottom: 16 }}>
        {[[stats.users,"مستخدم"],[stats.premium+stats.elite,"بريميوم+إليت"],[`${stats.revenue} ر.س`,"إيرادات/شهر"],[approved.length,"خصم نشط"]].map(([v,l],i)=>(
          <div key={i} className="card" style={{ padding: 14, textAlign: "center" }}><div className="font-mono" style={{ fontSize: 22, fontWeight: 900, color: G, marginBottom: 3 }}>{v}</div><div style={{ fontSize: 11, color: MUTED }}>{l}</div></div>
        ))}
      </div>
      <div className="card" style={{ padding: 20, marginBottom: 14, background: "linear-gradient(135deg,rgba(91,33,182,.08),rgba(124,58,237,.04))" }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#A78BFA", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Icon n="coins" sz={14} c="#A78BFA" />تحليلات نظام النقاط</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 14, flexWrap: "wrap" }}>
          {[[stats.totalPts,"نقطة ممنوحة"],[stats.totalPtSpent,"نقطة مُصرَفة"],[stats.totalRefs,"إحالة ناجحة"]].map(([v,l])=>(
            <div key={l as string} style={{ textAlign: "center", padding: "10px 20px", background: "rgba(10,7,0,.4)", borderRadius: 10 }}>
              <div className="font-mono" style={{ fontSize: 20, fontWeight: 900, color: "#A78BFA", marginBottom: 3 }}>{(v as number).toLocaleString()}</div>
              <div style={{ fontSize: 10, color: "#7C3AED" }}>{l as string}</div>
            </div>
          ))}
        </div>
        <div style={{ fontWeight: 600, fontSize: 12, color: "#A78BFA", marginBottom: 8 }}>أكثر الأعضاء إحالةً</div>
        {[...users].sort((a, b) => (b.referrals?.length || 0) - (a.referrals?.length || 0)).slice(0, 3).map((u, i) => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "rgba(10,7,0,.35)", borderRadius: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{["🥇", "🥈", "🥉"][i]}</span>
            <Avatar name={u.name} sz={28} />
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 12 }}>{u.name}</div></div>
            <span className="font-mono" style={{ fontWeight: 700, color: "#A78BFA" }}>{u.referrals?.length || 0} إحالة</span>
            <PtsBadge pts={u.points || 0} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: G, marginBottom: 14 }}>أكثر الخصومات استخدامًا</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topDiscs.map((d, i) => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: MUTED, width: 14, textAlign: "center", fontWeight: 700 }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12 }}>{d.name}</span><span className="font-mono" style={{ fontSize: 11, color: G, fontWeight: 700 }}>{d.uses} ×</span></div>
                  <ProgBar val={d.uses / maxU * 100} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: G, marginBottom: 14 }}>إحصائيات الشركاء</div>
          <table>
            <thead><tr><th>الشركة</th><th>الخصومات</th><th>المكافآت</th></tr></thead>
            <tbody>{companies.map((co) => {
              const cD = discounts.filter((d) => d.companyId === co.id);
              const totalRed = co.ptRewards?.reduce((a, r) => a + r.redeemedCount, 0) ?? 0;
              return (
                <tr key={co.id}>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ fontSize: 17 }}>{co.emoji}</span>{co.name}</div></td>
                  <td><span className="badge badge-gold">{cD.length}</span></td>
                  <td><span className="badge badge-purple">{totalRed} مرة</span></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
