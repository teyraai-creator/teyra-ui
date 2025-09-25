import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { changeLanguage } from "../i18n";

export default function LanguageScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const pick = async (lang: "en" | "ru" | "de") => {
    if (loading) return;
    setLoading(lang);
    try {
      // Сохраняем язык и применяем его
      await changeLanguage(lang);
      // Небольшая задержка, чтобы i18n успел примениться
      await new Promise(resolve => setTimeout(resolve, 100));
    } finally {
      navigate("/auth");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#004AAD 0%,#0099FF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
      }}
    >
      {/* ЛОГОК и сетка — строго по центру, с небольшими отступами */}
      <style>{`
        .wrap { width: 100%; max-width: 1200px; padding: 0 24px; }
        .logo { 
          /* БОЛЬШОЙ логотип: заметный на первом экране и при этом адаптивный */
          height: min(520px, 42vh); 
          width: auto; 
          filter: drop-shadow(0 14px 36px rgba(0,0,0,0.28));
        }
        .grid { 
          display: grid; 
          gap: 28px; 
          grid-template-columns: 1fr; 
          text-align: center;
        }
        @media (min-width: 900px) { .grid { grid-template-columns: 1fr 1fr 1fr; } }
        .pill {
          padding: 12px 28px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.18);
          color: #fff;
          box-shadow: 0 10px 24px rgba(0,0,0,0.22);
          backdrop-filter: blur(3px);
          cursor: pointer;
        }
        .title { opacity: .95; margin-bottom: 10px; line-height: 1.3; }
      `}</style>

      {/* ЛОГО — ближе к верху */}
      <div className="wrap" style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <img src="/teyra-logo.png" alt="TEYRA" className="logo" />
      </div>

      {/* КНОПКИ — сразу под логотипом, по центру колонок */}
      <div className="wrap" style={{ marginTop: 16 }}>
        <div className="grid">
          <LangCol
            title="Choose your AI assistant's language"
            label={loading === "en" ? "Saving..." : "English"}
            onClick={() => pick("en")}
            disabled={!!loading}
          />
          <LangCol
            title="Выберите язык AI-ассистента"
            label={loading === "ru" ? "Сохраняю..." : "Русский"}
            onClick={() => pick("ru")}
            disabled={!!loading}
          />
          <LangCol
            title="Wählen Sie die Sprache Ihres KI-Assistenten"
            label={loading === "de" ? "Speichere..." : "Deutsch"}
            onClick={() => pick("de")}
            disabled={!!loading}
          />
        </div>
      </div>

      {/* ФУТЕР — всегда внизу */}
      <div
        className="wrap"
        style={{
          textAlign: "center",
          marginTop: "auto",
          marginBottom: 16,
          opacity: 0.95,
          fontSize: 14,
        }}
      >
        © 2025 Teyra
      </div>
    </div>
  );
}

type ColProps = { title: string; label: string; onClick: () => void; disabled: boolean };
function LangCol({ title, label, onClick, disabled }: ColProps) {
  return (
    <div>
      <div className="title">{title}</div>
      <button className="pill" onClick={onClick} disabled={disabled}>
        {label}
      </button>
    </div>
  );
}
