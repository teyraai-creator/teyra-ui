import { useState, useMemo } from "react";

/**
 * Плавающий чат-виджет Teyra.
 * - В свернутом состоянии: только большая иконка-аватар в правом нижнем углу.
 * - При клике открывается окно чата, иконка скрывается.
 * - При закрытии окна чат скрывается, иконка снова появляется.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  const avatarUrl = "/avatars/teyra-assistant.png";

  const safeBottom = 24; // px

  const commonFixed = useMemo<React.CSSProperties>(
    () => ({
      position: "fixed",
      right: 24,
      bottom: safeBottom,
      zIndex: 50,
    }),
    [safeBottom]
  );

  if (!open) {
    // свернутое состояние: только аватар
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Открыть чат Teyra"
        style={{
          ...commonFixed,
          width: 160, // увеличили в 2 раза (было 80)
          height: 160,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,.9)",
          padding: 0,
          overflow: "hidden",
          background: "transparent",
          boxShadow: "0 10px 24px rgba(0,0,0,.25)",
          cursor: "pointer",
        }}
      >
        <img
          src={avatarUrl}
          alt="TEYRA Assistant"
          onError={(e) => {
            e.currentTarget.src = "/teyra-logo.png"; // fallback
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </button>
    );
  }

  // открытое состояние: окно чата
  return (
    <div
      style={{
        ...commonFixed,
        width: 420,
        maxWidth: "calc(100vw - 32px)",
        height: 520,
        maxHeight: "calc(100vh - 140px)",
        borderRadius: 16,
        background:
          "linear-gradient(180deg, rgba(255,255,255,.2) 0%, rgba(255,255,255,.12) 100%)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,.35)",
        boxShadow: "0 20px 48px rgba(0,0,0,.35)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Шапка */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          borderBottom: "1px solid rgba(255,255,255,.25)",
          color: "white",
        }}
      >
        <img
          src={avatarUrl}
          alt="TEYRA Assistant"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid rgba(255,255,255,.6)",
          }}
        />
        <div style={{ fontWeight: 700 }}>TEYRA Assistant</div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Закрыть чат"
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: 18,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      {/* История */}
      <div
        style={{
          flex: 1,
          padding: 12,
          color: "white",
          overflow: "auto",
        }}
      >
        <div
          style={{
            fontSize: 14,
            opacity: 0.95,
            lineHeight: 1.4,
            marginBottom: 8,
          }}
        >
          Привет! Я твой ассистент. Задавай вопросы про клиентов, заметки, тесты
          и сессии.
        </div>
      </div>

      {/* Ввод */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        style={{
          display: "flex",
          gap: 8,
          padding: 12,
          borderTop: "1px solid rgba(255,255,255,.25)",
        }}
      >
        <input
          placeholder="Задайте вопрос…"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,.55)",
            outline: "none",
            background: "white",
            color: "#0b1030",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,.65)",
            background: "rgba(255,255,255,.22)",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Отправить
        </button>
      </form>
    </div>
  );
}