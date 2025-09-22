import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Lang = "en" | "ru" | "de";

const UI = {
  en: {
    title: "Reset password",
    emailLabel: "Email",
    sendLink: "Send reset link",
    sent: "Reset link sent. Check your email.",
    setTitle: "Set a new password",
    pass1: "New password",
    pass2: "Repeat password",
    save: "Save password",
    toAuth: "Go to sign in",
    mismatch: "Passwords do not match",
    tooShort: "Password is too short (min 6 chars)",
    unexpected: "Unexpected error",
  },
  ru: {
    title: "Смена пароля",
    emailLabel: "Почта",
    sendLink: "Отправить ссылку для сброса",
    sent: "Ссылка для сброса отправлена. Проверьте почту.",
    setTitle: "Установить новый пароль",
    pass1: "Новый пароль",
    pass2: "Повторите пароль",
    save: "Сохранить пароль",
    toAuth: "Перейти ко входу",
    mismatch: "Пароли не совпадают",
    tooShort: "Слишком короткий пароль (мин. 6 символов)",
    unexpected: "Неожиданная ошибка",
  },
  de: {
    title: "Passwort zurücksetzen",
    emailLabel: "E-Mail",
    sendLink: "Link zum Zurücksetzen senden",
    sent: "Link gesendet. Bitte E-Mail prüfen.",
    setTitle: "Neues Passwort setzen",
    pass1: "Neues Passwort",
    pass2: "Passwort wiederholen",
    save: "Passwort speichern",
    toAuth: "Zum Login",
    mismatch: "Passwörter stimmen nicht überein",
    tooShort: "Passwort zu kurz (mind. 6 Zeichen)",
    unexpected: "Unerwarteter Fehler",
  },
} as const;

export default function ResetPassword() {
  const lang = (localStorage.getItem("teyra_lang") as Lang) || "ru";
  const t = UI[lang] || UI.en;
  const navigate = useNavigate();

  // режимы:
  // - "request" — отправка ссылки на почту
  // - "set" — пришли из письма: показываем форму установки нового пароля
  const [mode, setMode] = useState<"request" | "set">("request");

  // формы
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  // статусы
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<"ok" | "err" | null>(null);
  const [errText, setErrText] = useState("");

  const styles = useMemo(
    () => ({
      card: {
        width: "100%",
        maxWidth: 520,
        margin: "0 auto",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.28)",
        borderRadius: 18,
        padding: 16,
        boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
        backdropFilter: "blur(4px)",
      } as React.CSSProperties,
      input: {
        width: "100%",
        padding: "12px 14px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.35)",
        background: "rgba(255,255,255,0.96)",
        outline: "none",
        marginTop: 6,
        color: "#1a1a1a",
      } as React.CSSProperties,
      btn: {
        width: "100%",
        height: 44,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.35)",
        background: "rgba(255,255,255,0.22)",
        color: "white",
        boxShadow: "0 10px 24px rgba(0,0,0,0.22) inset, 0 10px 24px rgba(0,0,0,0.18)",
        cursor: "pointer",
      } as React.CSSProperties,
      link: {
        textAlign: "center" as const,
        marginTop: 12,
        opacity: 0.95,
        textDecoration: "underline",
        cursor: "pointer",
      },
      msgOk: { textAlign: "center" as const, marginTop: 10, opacity: 0.95 },
      msgErr: { textAlign: "center" as const, marginTop: 10, color: "#FFD1D1" },
    }),
    []
  );

  // 1) Если пришли по ссылке из письма — токены лежат в URL-хеше.
  useEffect(() => {
    const hash = window.location.hash?.replace(/^#/, "");
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      // Встаём на сессию и включаем режим установки пароля
      supabase.auth.setSession({ access_token, refresh_token }).catch(() => {});
      setMode("set");
    }
  }, []);

  // Отправить письмо для сброса
  const onSendLink = async () => {
    setDone(null);
    setErrText("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset`,
      });
      if (error) throw error;
      setDone("ok");
    } catch (e: any) {
      setDone("err");
      setErrText(e?.message || UI[lang].unexpected);
    } finally {
      setLoading(false);
    }
  };

  // Установить новый пароль
  const onSaveNew = async () => {
    setDone(null);
    setErrText("");

    if (pass1 !== pass2) {
      setDone("err");
      setErrText(UI[lang].mismatch);
      return;
    }
    if (pass1.length < 6) {
      setDone("err");
      setErrText(UI[lang].tooShort);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pass1 });
      if (error) throw error;
      setDone("ok");
    } catch (e: any) {
      setDone("err");
      setErrText(e?.message || UI[lang].unexpected);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#004AAD 0%,#0099FF 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        {/* Лого сверху по центру */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <img src="/teyra-logo.png" alt="TEYRA" style={{ height: 84, filter: "drop-shadow(0 8px 22px rgba(0,0,0,.28))" }} />
        </div>

        <div style={styles.card}>
          {/* Заголовок */}
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, opacity: 0.98 }}>
            {mode === "set" ? t.setTitle : t.title}
          </div>

          {mode === "request" ? (
            <>
              <label style={{ opacity: 0.95 }}>
                {t.emailLabel}
                <input
                  style={styles.input}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </label>

              <div style={{ height: 10 }} />
              <button style={styles.btn} disabled={loading || !email} onClick={onSendLink}>
                {t.sendLink}
              </button>

              {done === "ok" && <div style={styles.msgOk}>{t.sent}</div>}
              {done === "err" && <div style={styles.msgErr}>{errText}</div>}
            </>
          ) : (
            <>
              <label style={{ opacity: 0.95 }}>
                {t.pass1}
                <input
                  style={styles.input}
                  type="password"
                  autoComplete="new-password"
                  value={pass1}
                  onChange={(e) => setPass1(e.target.value)}
                  placeholder="••••••••"
                />
              </label>

              <div style={{ height: 8 }} />

              <label style={{ opacity: 0.95 }}>
                {t.pass2}
                <input
                  style={styles.input}
                  type="password"
                  autoComplete="new-password"
                  value={pass2}
                  onChange={(e) => setPass2(e.target.value)}
                  placeholder="••••••••"
                />
              </label>

              <div style={{ height: 10 }} />
              <button style={styles.btn} disabled={loading || !pass1 || !pass2} onClick={onSaveNew}>
                {t.save}
              </button>

              {done === "ok" && (
                <div style={styles.msgOk}>
                  ✓ {t.save} — OK
                  <div style={styles.link} onClick={() => navigate("/auth")}>
                    {t.toAuth}
                  </div>
                </div>
              )}
              {done === "err" && <div style={styles.msgErr}>{errText}</div>}
            </>
          )}
        </div>

        {/* Футер */}
        <div style={{ textAlign: "center", marginTop: 18, opacity: 0.95 }}>© 2025 Teyra</div>
      </div>
    </div>
  );
}
