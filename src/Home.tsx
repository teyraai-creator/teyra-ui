// src/Home.tsx
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { applyLangFromStorage } from "./i18n";
import Menu from "./components/Menu";
import NewsFeed from "./components/NewsFeed";
import AIAssistant from "./components/AIAssistant";

export default function Home() {
  const { t } = useTranslation();

  // Принудительно применяем язык при загрузке компонента
  useEffect(() => {
    applyLangFromStorage();
  }, []);

  return (
    <div className="clients">
      <style>{`
        .clients {
          min-height: 100vh;
          background: linear-gradient(135deg,#004AAD 0%,#0099FF 100%);
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 20px;
          padding: 24px;
          color: #fff;
        }

        /* Левая колонка */
        .left { display: flex; flex-direction: column; gap: 16px; }
        .card {
          border-radius: 20px;
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.16);
          box-shadow: 0 12px 28px rgba(0,0,0,.22);
          padding: 12px;
        }
        .menu-title { font-weight: 700; margin: 4px 8px 10px; opacity: .95; }
        .mitem {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 14px; cursor: pointer; user-select: none;
          transition: background .15s ease, box-shadow .15s ease, border-color .15s ease;
          border: 1px solid transparent;
        }
        .mitem:hover { background: rgba(255,255,255,.12); }
        .mitem.active {
          background: rgba(255,255,255,.18);
          border-color: rgba(255,255,255,.28);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.12);
        }
        .micon { width: 24px; height: 24px; display:flex; align-items:center; justify-content:center; }
        .micon svg { width: 18px; height: 18px; fill: #fff; opacity: .95; }

        /* Правая колонка */
        .right {
          display: grid;
          grid-template-rows: auto auto auto;
          gap: 16px;
          align-content: start;
        }
        .right > * { align-self: start; }

        /* Топ-бар — компактный, логотип крупный */
        .topbar {
          border-radius: 20px;
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.16);
          box-shadow: 0 12px 28px rgba(0,0,0,.22);
          padding: 2px 6px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 8px;
        }
        .brand { display:flex; align-items:center; gap:10px; }
        .brand img { height: 60px; width: auto; filter: drop-shadow(0 10px 24px rgba(0,0,0,.25)); }

        /* Поиск тянется до двух кружков */
        .search { display:flex; align-items:center; }
        .search input {
          width: calc(100% - 80px);
          max-width: 1100px;
          min-width: 360px;
          border: 0; outline: none;
          color: #1e1e1e;
          background: #fff;
          border-radius: 999px;
          padding: 10px 14px;
        }

        .tops { display:flex; align-items:center; gap:10px; margin-left: 8px; }
        .dot {
          width: 36px; height: 36px; border-radius: 999px;
          background: rgba(255,255,255,.18);
          border: 1px solid rgba(255,255,255,.22);
          box-shadow: 0 8px 20px rgba(0,0,0,.20) inset;
        }

        /* Контент — естественная высота */
        .content {
          border-radius: 20px;
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.16);
          box-shadow: 0 12px 28px rgba(0,0,0,.22);
          padding: 12px;
        }
        .empty { opacity: .9; }

        /* Футер — чуть выше экрана */
        .footer {
          grid-column: 1 / -1;
          text-align: center;
          opacity: .95;
          font-size: 14px;
          margin-top: 8px;
          margin-bottom: 14px; /* поднимаем футер чуть выше */
        }

        @media (max-width: 1100px) {
          .brand img   { height: 48px; }
          .search input{ width: 100%; max-width: 100%; min-width: 0; }
          .topbar      { grid-template-columns: auto 1fr; }
          .tops        { display:none; }
        }
        @media (max-width: 1024px) {
          .clients { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Левая колонка */}
      <div className="left">
        <Menu />
        <div className="card">
          <NewsFeed />
        </div>
      </div>

      {/* Правая колонка */}
      <div className="right">
        <div className="topbar">
          <div className="brand">
            <img src="/teyra-logo.png" alt="TEYRA" />
          </div>

                  <div className="search">
                    <input type="text" placeholder={t("search.placeholder")} />
                  </div>

          <div className="tops">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>

                <div className="content">
                  <div className="empty">{t("home.welcome")}</div>
                </div>
      </div>

      <div className="footer">{t("footer.copyright")}</div>

      {/* AI-ассистент в правом нижнем углу */}
      <AIAssistant />
    </div>
  );
}