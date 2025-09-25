import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "./lib/supabase";
import { applyLangFromStorage } from "./i18n";

export default function Auth() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Принудительно применяем язык при загрузке компонента
  useEffect(() => {
    applyLangFromStorage();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"up" | "in" | "reset" | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const canSubmit = useMemo(() => email.trim() && password.length >= 6, [email, password]);

  const handleSignUp = async () => {
    if (loading || !canSubmit) return;
    setLoading("up"); setMsg(null);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/home`
        }
      });
      if (error) throw error;
      setMsg({ type: "ok", text: t("auth.checkEmail") });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || t("auth.emailVerification") });
    } finally { setLoading(null); }
  };

  const handleSignIn = async () => {
    if (loading || !canSubmit) return;
    setLoading("in"); setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/home", { replace: true }); // ← и сюда
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || t("auth.emailVerification") });
    } finally { setLoading(null); }
  };

  const handleForgot = async () => {
    if (loading || !email.trim()) return;
    setLoading("reset"); setMsg(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMsg({ type: "ok", text: t("auth.checkEmail") });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || t("auth.emailVerification") });
    } finally { setLoading(null); }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#004AAD 0%,#0099FF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        color: "white",
      }}
    >
      <style>{`
        .wrap { width: 100%; max-width: 520px; padding: 0 24px; }
        .logo { height: min(340px, 32vh); width: auto; filter: drop-shadow(0 10px 30px rgba(0,0,0,0.25)); }
        .card {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.22);
          backdrop-filter: blur(3px);
        }
        /* ЕДИНАЯ база размеров для ВСЕХ контролов */
        .control {
          width: 100%;
          height: 52px;
          border-radius: 9999px;
          font-size: 17px;
          box-sizing: border-box;   /* критично: одинаковая ширина */
        }
        /* Инпуты = белые капсулы */
        .input {
          border: none;
          background: rgba(255,255,255,0.96);
          color: #1a1a1a;
          padding: 0 18px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.18);
          outline: none;
        }
        .input::placeholder { color: #666; opacity: .9; }
        /* Кнопки = прозрачные капсулы */
        .pill {
          border: 1px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.18);
          color: #fff;
          box-shadow: 0 10px 24px rgba(0,0,0,0.22);
          backdrop-filter: blur(3px);
          cursor: pointer;
          padding: 0 18px;           /* тот же горизонтальный отступ, что и у инпутов */
        }
        .muted { opacity: .92; }
        .link { color: #fff; opacity: .95; text-decoration: underline; cursor: pointer; }
        .msg-ok { color: #C8FFD4; font-size: 14px; }
        .msg-err { color: #FFD1D1; font-size: 14px; }
        .spacer { height: 12px; }
      `}</style>

      {/* Лого */}
      <div className="wrap" style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <img src="/teyra-logo.png" alt="TEYRA" className="logo" />
      </div>

      {/* Центр — форма */}
      <div className="wrap" style={{ flexGrow: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", marginTop: -20 }}>
        <div className="card" style={{ width: "100%" }}>
          <div className="muted" style={{ marginBottom: 8 }}>{t("auth.email")}</div>
          <input
            className="control input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.email")}
            autoComplete="email"
          />

          <div className="spacer" />

          <div className="muted" style={{ marginBottom: 8 }}>{t("auth.password")}</div>
          <input
            className="control input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.password")}
            autoComplete="current-password"
          />

          <div style={{ textAlign: "center", marginTop: 10 }}>
            <span className="link" onClick={handleForgot}>
              {loading === "reset" ? "…" : t("auth.forgotPassword")}
            </span>
          </div>

          <div className="spacer" />

          <button className="control pill" onClick={handleSignUp} disabled={!canSubmit || !!loading}>
            {loading === "up" ? "…" : t("auth.signUp")}
          </button>
          <div className="spacer" />
          <button className="control pill" onClick={handleSignIn} disabled={!canSubmit || !!loading}>
            {loading === "in" ? "…" : t("auth.signIn")}
          </button>

          {msg && (
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <span className={msg.type === "ok" ? "msg-ok" : "msg-err"}>{msg.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Футер */}
      <div className="wrap" style={{ textAlign: "center", marginTop: "auto", marginBottom: 16, opacity: .95, fontSize: 14 }}>
        © 2025 Teyra
      </div>
    </div>
  );
}
