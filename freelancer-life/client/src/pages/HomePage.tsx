import { Plan } from "../types";
import { PTS } from "../constants";
import PCard from "../components/shared/PCard";
import Icon from "../components/shared/Icon";

interface HomePageProps { onAuth: (m: "login" | "register") => void; }

export default function HomePage({ onAuth }: HomePageProps) {
  return (
    <div className="grid-bg">
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "118px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "32%", left: "50%", transform: "translate(-50%,-50%)", width: 640, height: 640, background: "radial-gradient(circle,rgba(201,168,76,.055) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 860, position: "relative" }}>
          <div className="animate-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 17px", borderRadius: 999, border: "1px solid rgba(201,168,76,.28)", background: "rgba(201,168,76,.06)", marginBottom: 26, fontSize: 12, color: "#C9A84C" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulseDim 2s ease-in-out infinite" }} />
            المنصة الأولى لحياة الفريلانسر · نقاط · دعوات · خصومات
          </div>

          <h1 className="animate-fade-up" style={{ fontSize: "clamp(36px,7.5vw,78px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-.04em", marginBottom: 20, animationDelay: ".04s" }}>
            استقرار حقيقي<br /><span className="grad-text">لحياتك كفريلانسر</span>
          </h1>

          <p className="animate-fade-up" style={{ fontSize: "clamp(14px,1.8vw,17px)", color: "#8B7040", lineHeight: 1.8, maxWidth: 600, margin: "0 auto 36px", animationDelay: ".08s" }}>
            منصة متكاملة — هوية رقمية، خصومات حصرية، <span style={{ color: "#A78BFA" }}>نظام نقاط ومكافآت</span>، ودعوة الأصدقاء لكسب النقاط معاً.
          </p>

          {/* cards preview */}
          <div className="animate-fade-up" style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 36, flexWrap: "wrap", animationDelay: ".12s" }}>
            {(["free", "premium", "elite"] as Plan[]).map((p) => (
              <PCard key={p} plan={p} name="أحمد الخالد" compact pts={p === "elite" ? 1850 : p === "premium" ? 620 : 120} />
            ))}
          </div>

          {/* CTA */}
          <div className="animate-fade-up" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 54, animationDelay: ".16s" }}>
            <button className="btn btn-gold" style={{ height: 52, fontSize: 15, padding: "0 30px" }} onClick={() => onAuth("register")}>
              ابدأ مجانًا <Icon n="arr" sz={15} c="#000" />
            </button>
            <button className="btn btn-ghost" style={{ height: 52, fontSize: 15, padding: "0 30px" }} onClick={() => onAuth("login")}>
              تسجيل الدخول
            </button>
          </div>

          {/* stats */}
          <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, maxWidth: 680, margin: "0 auto", animationDelay: ".20s" }}>
            {[["4.35B", "فريلانسر عالميًا"], ["3 باقات", "مجانية·بريميوم·إليت"], ["نقاط", `ابدأ بـ ${PTS.SIGNUP} نقطة ترحيبية`], ["200+", "نقطة لكل دعوة صديق"]].map(([v, l]) => (
              <div key={l} style={{ background: "rgba(201,168,76,.04)", border: "1px solid rgba(201,168,76,.14)", borderRadius: 12, padding: "13px 10px", textAlign: "center" }}>
                <div className="font-mono" style={{ fontSize: 17, fontWeight: 900, color: "#C9A84C", marginBottom: 3 }}>{v}</div>
                <div style={{ fontSize: 10, color: "#8B7040" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(201,168,76,.14)", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <div style={{ width: 20, height: 20, borderRadius: 5, background: "linear-gradient(135deg,#8B6914,#C9A84C)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon n="zap" sz={10} c="#000" /></div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#C9A84C" }}>حياة الفريلانسر</span>
        <span style={{ fontSize: 11, color: "#8B7040" }}>© 2025</span>
      </footer>
    </div>
  );
}
