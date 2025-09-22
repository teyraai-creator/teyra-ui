import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const switcher: React.CSSProperties = {
    position: "absolute",
    top: 16,
    right: 16,
    display: "flex",
    gap: 8,
    fontSize: 14,
    color: "#fff",
    cursor: "pointer",
  };

  const btn: React.CSSProperties = {
    padding: "4px 10px",
    borderRadius: 6,
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.25)",
    boxShadow: "0 2px 6px rgba(0,0,0,.2)",
    backdropFilter: "blur(2px)",
  };

  const pick = (lng: "en" | "ru" | "de") => {
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem("lang", lng);
    } catch {}
  };

  return (
    <div style={switcher}>
      <div style={btn} onClick={() => pick("en")}>EN</div>
      <div style={btn} onClick={() => pick("ru")}>RU</div>
      <div style={btn} onClick={() => pick("de")}>DE</div>
    </div>
  );
}
