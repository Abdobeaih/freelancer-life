import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "./store/auth.store";
import { useToastStore } from "./store/toast.store";
import { Discount, PtReward, AdminStats, Company, Plan, Status, User } from "./types";
import api from "./lib/api";

import HomePage from "./pages/HomePage";
import AuthModal from "./components/auth/AuthModal";
import Toast from "./components/shared/Toast";
import Modal from "./components/shared/Modal";
import Icon from "./components/shared/Icon";
import Sidebar from "./components/shared/Sidebar";
import { Avatar, PtsBadge } from "./components/shared/Micro";
import PCard from "./components/shared/PCard";

import { UOverview, UDiscs, UPoints, UInvite, UMyID, UUpgrade, USettings } from "./components/user/UserPages";
import { AOverview, APending, AUsers, ADiscounts, AAnalytics } from "./components/admin/AdminPages";
import { COverview, CAddDisc, CMyDiscs, CSettings } from "./components/company/CompanyPages";

import { PLANS } from "./constants";

const MUTED = "#8B7040", G = "#C9A84C", BORDER = "rgba(201,168,76,.14)";

// ── Nav config ───────────────────────────────────────────────
type NavItem = {k:string,ico:string,lbl:string,badge?:number};
const USER_NAV: NavItem[]  = [{k:"overview",ico:"dash",lbl:"لوحة التحكم"},{k:"discs",ico:"pct",lbl:"الخصومات"},{k:"points",ico:"sparkles",lbl:"نقاطي"},{k:"invite",ico:"gift",lbl:"دعوة صديق"},{k:"myid",ico:"qr",lbl:"هويتي"},{k:"upgrade",ico:"crown",lbl:"ترقية"},{k:"settings",ico:"cog",lbl:"الإعدادات"}];
const ADMIN_NAV = (pending:number): NavItem[] => [{k:"overview",ico:"dash",lbl:"نظرة عامة"},{k:"pending",ico:"clk",lbl:"الطلبات المعلقة",badge:pending},{k:"users",ico:"users",lbl:"المستخدمون"},{k:"discs",ico:"tags",lbl:"الخصومات"},{k:"analytics",ico:"bar",lbl:"التحليلات"}];
const CO_NAV: NavItem[]    = [{k:"overview",ico:"dash",lbl:"نظرة عامة"},{k:"adddisc",ico:"plus",lbl:"طلب خصم جديد"},{k:"mydisc",ico:"tags",lbl:"عروضي"},{k:"settings",ico:"cog",lbl:"الإعدادات"}];

export default function App() {
  const { token, role, user, company, logout, setUser, refreshUser, refreshCompany } = useAuthStore();
  const { show: toast } = useToastStore();

  const [sub, setSub] = useState("overview");
  const [auth, setAuth] = useState<"login" | "register" | null>(null);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [rewards, setRewards]     = useState<PtReward[]>([]);
  const [adminUsers, setAdminUsers]   = useState<User[]>([]);
  const [adminCos, setAdminCos]       = useState<Company[]>([]);
  const [adminStats, setAdminStats]   = useState<AdminStats | null>(null);
  const [redeemModal, setRedeemModal] = useState<PtReward | null>(null);

  const pendingCount = useMemo(() => discounts.filter((d) => d.status === "pending").length, [discounts]);

  // Load data on mount / role change
  useEffect(() => {
    if (!token) return;
    loadDiscounts();
    if (role === "user")  { loadRewards(); refreshUser(); }
    if (role === "admin") { loadAdminData(); }
    if (role === "company") { refreshCompany(); loadDiscounts(); }
  }, [token, role]);

  const loadDiscounts = async () => {
    try {
      const endpoint = role === "admin" ? "/discounts/all" : "/discounts";
      const { data } = await api.get(endpoint);
      setDiscounts(data);
    } catch {}
  };

  const loadRewards = async () => {
    try { const { data } = await api.get("/companies/rewards"); setRewards(data); } catch {}
  };

  const loadAdminData = async () => {
    try {
      const [sRes, uRes, cRes, dRes] = await Promise.all([
        api.get("/admin/stats"), api.get("/admin/users"),
        api.get("/admin/companies"), api.get("/discounts/all"),
      ]);
      setAdminStats(sRes.data); setAdminUsers(uRes.data); setAdminCos(cRes.data); setDiscounts(dRes.data);
    } catch {}
  };

  const go = (s: string) => { setSub(s); window.scrollTo({ top: 0, behavior: "smooth" }); };

  // ── User actions ─────────────────────────────────────────────
  const useDiscount = async (d: Discount) => {
    try {
      const { data } = await api.post("/users/me/use-discount", { discountId: d.id });
      setUser(data.user);
      toast(`${d.percentage} خصم — وفرت ${data.saved.toFixed(1)} ر.س · +${data.pointsEarned} نقطة 🌟`, "points");
    } catch (e: any) { toast(e.response?.data?.error ?? "خطأ", "err"); }
  };

  const upgradePlan = async (plan: Plan, card: { nameOnCard: string; lastFour: string; expiry: string }) => {
    try {
      const { data } = await api.post("/users/me/upgrade", { plan, card });
      setUser(data);
      toast(`تم الترقية! 🎉 +${plan === "elite" ? 300 : 150} نقطة بوناس`, "points");
      go("overview");
    } catch (e: any) { toast(e.response?.data?.error ?? "خطأ", "err"); }
  };

  const redeemPoints = async (r: PtReward) => {
    try {
      const { data } = await api.post("/users/me/redeem", { rewardId: r.id });
      setUser(data);
      setRewards((prev) => prev.map((rw) => rw.id === r.id ? { ...rw, redeemedCount: rw.redeemedCount + 1 } : rw));
      setRedeemModal(null);
      toast(`تم صرف ${r.points} نقطة — احصل على: ${r.description} 🎁`, "points");
    } catch (e: any) { toast(e.response?.data?.error ?? "خطأ", "err"); }
  };

  const saveProfile = async (name: string, job: string) => {
    try { const { data } = await api.patch("/users/me", { name, job }); setUser(data); toast("تم التحديث ✅"); } catch { toast("خطأ في الحفظ", "err"); }
  };

  const changePw = async (cp: string, np: string) => {
    try { await api.patch("/users/me/password", { currentPassword: cp, newPassword: np }); toast("تم تغيير كلمة المرور ✅"); }
    catch (e: any) { toast(e.response?.data?.error ?? "خطأ", "err"); }
  };

  const deleteAccount = async () => {
    if (!confirm("حذف الحساب نهائياً؟")) return;
    try { await api.delete("/users/me"); logout(); toast("تم الحذف"); } catch { toast("خطأ", "err"); }
  };

  // ── Admin actions ─────────────────────────────────────────────
  const adminSetPlan = async (id: string, plan: Plan) => {
    try { const { data } = await api.patch(`/admin/users/${id}/plan`, { plan }); setAdminUsers((p) => p.map((u) => u.id === id ? data : u)); toast(`تم تعيين باقة ${PLANS[plan].label}`); } catch {}
  };
  const adminDelUser = async (id: string) => {
    if (!confirm("حذف هذا المستخدم؟")) return;
    try { await api.delete(`/admin/users/${id}`); setAdminUsers((p) => p.filter((u) => u.id !== id)); toast("تم الحذف"); } catch {}
  };
  const adminAddPts = async (id: string, pts: number) => {
    try { const { data } = await api.post(`/admin/users/${id}/points`, { points: pts }); setAdminUsers((p) => p.map((u) => u.id === id ? data : u)); toast(`تم منح ${pts} نقطة`, "points"); } catch {}
  };
  const adminAddDisc = async (f: any) => {
    try { const { data } = await api.post("/discounts", f); setDiscounts((p) => [data, ...p]); toast("تم إضافة الخصم ✅"); } catch {}
  };
  const adminEditDisc = async (f: any) => {
    try { const { data } = await api.patch(`/discounts/${f.id}`, f); setDiscounts((p) => p.map((d) => d.id === f.id ? data : d)); toast("تم التعديل ✅"); } catch {}
  };
  const adminDelDisc = async (id: number) => {
    if (!confirm("حذف؟")) return;
    try { await api.delete(`/discounts/${id}`); setDiscounts((p) => p.filter((d) => d.id !== id)); toast("تم الحذف"); } catch {}
  };
  const adminSetStatus = async (id: number, status: Status) => {
    try { const { data } = await api.patch(`/discounts/${id}`, { status }); setDiscounts((p) => p.map((d) => d.id === id ? data : d)); toast(status === "approved" ? "تم القبول ✅" : "تم الرفض", "warn"); } catch {}
  };

  // ── Company actions ───────────────────────────────────────────
  const coSubmit = async (f: any) => {
    try { const { data } = await api.post("/discounts/request", f); setDiscounts((p) => [data, ...p]); toast("تم إرسال طلبك للمدير ⏳", "warn"); } catch {}
  };
  const coSave = async (name: string, city: string) => {
    try { await api.patch("/companies/me", { name, city }); refreshCompany(); toast("تم التحديث ✅"); } catch {}
  };

  const isDash = !!token;
  const curNav = role === "admin" ? ADMIN_NAV(pendingCount) : role === "company" ? CO_NAV : USER_NAV;

  // ── Content ───────────────────────────────────────────────────
  const Content = () => {
    if (!token) return <HomePage onAuth={(m) => setAuth(m)} />;

    if (role === "user" && user) {
      if (sub === "overview") return <UOverview user={user} discounts={discounts} rewards={rewards} onNav={go} onRedeem={(r) => setRedeemModal(r)} />;
      if (sub === "discs")    return <UDiscs user={user} discounts={discounts} onUse={useDiscount} />;
      if (sub === "points")   return <UPoints user={user} rewards={rewards} onRedeem={(r) => setRedeemModal(r)} />;
      if (sub === "invite")   return <UInvite user={user} />;
      if (sub === "myid")     return <UMyID user={user} />;
      if (sub === "upgrade")  return <UUpgrade user={user} onUpgrade={upgradePlan} />;
      if (sub === "settings") return <USettings user={user} onSave={saveProfile} onPwChange={changePw} onDelete={deleteAccount} />;
    }

    if (role === "admin" && adminStats) {
      if (sub === "overview")  return <AOverview stats={adminStats} users={adminUsers} />;
      if (sub === "pending")   return <APending discounts={discounts} companies={adminCos} onApprove={(id) => adminSetStatus(id, "approved")} onReject={(id) => adminSetStatus(id, "rejected")} />;
      if (sub === "users")     return <AUsers users={adminUsers} onSetPlan={adminSetPlan} onDelete={adminDelUser} onAddPts={adminAddPts} />;
      if (sub === "discs")     return <ADiscounts discounts={discounts} companies={adminCos} onAdd={adminAddDisc} onEdit={adminEditDisc} onDelete={adminDelDisc} onStatus={adminSetStatus} />;
      if (sub === "analytics") return <AAnalytics stats={adminStats} discounts={discounts} companies={adminCos} users={adminUsers} />;
    }

    if (role === "company" && company) {
      if (sub === "overview") return <COverview co={company} discounts={discounts} />;
      if (sub === "adddisc")  return <CAddDisc co={company} onSubmit={coSubmit} />;
      if (sub === "mydisc")   return <CMyDiscs co={company} discounts={discounts} />;
      if (sub === "settings") return <CSettings co={company} onSave={coSave} />;
    }

    return null;
  };

  // ── Sidebar card ──────────────────────────────────────────────
  const SideCard = () => {
    if (role === "admin") return (
      <div style={{ background: "rgba(201,168,76,.025)", border: `1px solid rgba(201,168,76,.18)`, borderRadius: 15, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, padding: 10, background: "rgba(201,168,76,.06)", borderRadius: 11 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#000", fontSize: 14 }}>A</div>
          <div><div style={{ fontSize: 13, fontWeight: 700, color: G }}>Adham</div><div style={{ fontSize: 10, color: MUTED }}>مدير النظام</div></div>
        </div>
        <Sidebar items={ADMIN_NAV(pendingCount)} active={sub} onNav={go} role="admin" />
      </div>
    );
    if (role === "company" && company) return (
      <div style={{ background: "rgba(16,185,129,.025)", border: "1px solid rgba(16,185,129,.14)", borderRadius: 15, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, padding: 10, background: "rgba(16,185,129,.06)", borderRadius: 11 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: "rgba(201,168,76,.08)", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${BORDER}` }}>{company.emoji}</div>
          <div><div style={{ fontSize: 13, fontWeight: 700, color: "#34D399", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{company.name}</div><div style={{ fontSize: 10, color: MUTED }}>{company.category}</div></div>
        </div>
        <Sidebar items={CO_NAV} active={sub} onNav={go} role="co" />
      </div>
    );
    if (role === "user" && user) return (
      <div style={{ background: "rgba(201,168,76,.03)", border: `1px solid ${BORDER}`, borderRadius: 15, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: 10, background: "#080600", borderRadius: 11, border: `1px solid ${BORDER}` }}>
          <Avatar name={user.name} sz={36} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 10, color: MUTED }}>{user.job}</div>
            <PtsBadge pts={user.points || 0} />
          </div>
        </div>
        <Sidebar items={USER_NAV} active={sub} onNav={go} role="user" />
        <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
          <PCard plan={user.plan} name={user.name} lastFour={user.card?.lastFour} compact pts={user.points} />
        </div>
      </div>
    );
    return null;
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo',sans-serif", background: "#040300", color: "#F5EDD8", minHeight: "100vh" }}>
      {/* ── NAV ─── */}
      <nav style={{ position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 400, width: "95%", maxWidth: 1200 }}>
        <div style={{ background: "rgba(4,3,0,.9)", backdropFilter: "blur(18px)", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "9px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 40px rgba(0,0,0,.75)" }}>
          <button onClick={() => setSub("overview")} style={{ display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon n="zap" sz={13} c="#000" /></div>
            <span style={{ fontSize: 13, fontWeight: 800, color: G, letterSpacing: ".02em" }}>حياة الفريلانسر</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isDash && curNav.map(({ k, lbl, badge }) => (
              <button key={k} className={`nav-link ${sub === k ? "nav-link-active" : ""}`} onClick={() => go(k)} style={{ position: "relative", fontSize: 12 }}>
                {lbl}{badge && badge > 0 ? <span style={{ position: "absolute", top: 2, right: 2, width: 7, height: 7, borderRadius: "50%", background: "#EF4444", border: `2px solid #040300` }} /> : null}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!token ? (
              <>
                <button className="btn btn-dim" style={{ height: 34, padding: "0 14px", fontSize: 13 }} onClick={() => setAuth("login")}>دخول</button>
                <button className="btn btn-gold" style={{ height: 34, padding: "0 14px", fontSize: 13 }} onClick={() => setAuth("register")}>انضم مجانًا</button>
              </>
            ) : (
              <>
                {role === "admin" && pendingCount > 0 && (
                  <button className="btn btn-dim" style={{ width: 32, height: 32, padding: 0, position: "relative" }} onClick={() => go("pending")}>
                    <Icon n="bell" sz={15} c={G} />
                    <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: "#EF4444", border: `2px solid #040300` }} />
                  </button>
                )}
                {role === "user" && user && (
                  <button className="btn btn-dim" style={{ height: 32, padding: "0 10px", fontSize: 12, gap: 5, border: "1px solid rgba(124,58,237,.3)" }} onClick={() => go("points")}>
                    <Icon n="sparkles" sz={12} c="#A78BFA" /><span style={{ color: "#A78BFA", fontFamily: "Space Mono,monospace", fontWeight: 700 }}>{(user.points || 0).toLocaleString()}</span>
                  </button>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px", borderRadius: 10, background: "rgba(201,168,76,.06)", border: `1px solid rgba(201,168,76,.18)` }}>
                  {role === "admin" ? <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000" }}>A</div>
                    : role === "company" && company ? <div style={{ fontSize: 17 }}>{company.emoji}</div>
                    : user ? <Avatar name={user.name} sz={26} /> : null}
                  <span style={{ fontSize: 12, color: G, fontWeight: 700, maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {role === "admin" ? "Adham" : role === "company" ? company?.name.split(" ")[0] : user?.name.split(" ")[0]}
                  </span>
                </div>
                <button className="btn btn-danger" style={{ height: 30, padding: "0 10px", fontSize: 12 }} onClick={() => { logout(); setSub("overview"); toast("تم تسجيل الخروج"); }}>
                  <Icon n="out" sz={13} />خروج
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── MAIN ─── */}
      {isDash ? (
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "104px 24px 60px", display: "flex", gap: 22, alignItems: "flex-start" }}>
          <div style={{ width: 220, flexShrink: 0, position: "sticky", top: 100 }}><SideCard /></div>
          <div style={{ flex: 1, minWidth: 0 }} key={sub} className="animate-fade-up"><Content /></div>
        </div>
      ) : <Content />}

      {/* ── AUTH MODAL ─── */}
      {auth && <AuthModal initMode={auth} onClose={() => setAuth(null)} />}

      {/* ── REDEEM CONFIRM ─── */}
      {redeemModal && user && (
        <Modal title="تأكيد صرف النقاط" onClose={() => setRedeemModal(null)}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{redeemModal.company.emoji}</div>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{redeemModal.description}</h3>
            <p style={{ color: MUTED, fontSize: 13, marginBottom: 12 }}>{redeemModal.company.name}</p>
            <PtsBadge pts={redeemModal.points} size="lg" />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#080600", borderRadius: 12, marginBottom: 16, border: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 13, color: MUTED }}>رصيدك بعد الصرف</span>
            <span className="font-mono" style={{ fontWeight: 700, fontSize: 16, color: "#A78BFA" }}>{((user.points || 0) - redeemModal.points).toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", gap: 9 }}>
            <button className="btn btn-dim" style={{ flex: 1, height: 46 }} onClick={() => setRedeemModal(null)}>إلغاء</button>
            <button className="btn btn-purple" style={{ flex: 2, height: 46, fontSize: 14 }} onClick={() => redeemPoints(redeemModal)}>
              <Icon n="chk" sz={14} />تأكيد الصرف
            </button>
          </div>
        </Modal>
      )}

      {/* ── TOAST ─── */}
      <Toast />
    </div>
  );
}
