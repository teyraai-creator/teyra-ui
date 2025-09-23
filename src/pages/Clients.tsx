// src/pages/Clients.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NewsFeed from "../components/NewsFeed";
import ChatWidget from "../components/ChatWidget";

type Client = { id: string; name: string; email?: string };

export default function Clients() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // простая in-memory база, чтобы кнопка «Добавить клиента» реально работала
  const [clients, setClients] = useState<Client[]>([]);

  const handleAddClient = () => {
    const name = prompt("Имя клиента:");
    if (!name) return;
    const email = prompt("Почта (необязательно):") || undefined;
    setClients((prev) => [{ id: crypto.randomUUID(), name, email }, ...prev]);
  };

  const go = (path: string) => () => navigate(path);
  const isActive = (path: string) => pathname === path;

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
          padding: 8px 12px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 12px;
        }
        .brand { display:flex; align-items:center; gap:10px; }
        .brand img { height: 120px; width: auto; filter: drop-shadow(0 10px 24px rgba(0,0,0,.25)); }

        /* Поиск тянется почти до круглых кнопок */
        .search { display:flex; align-items:center; }
        .search input {
          width: calc(100% - 120px);
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

        /* Действия — без подложки */
        .actions { display:flex; align-items:center; gap:12px; padding: 0; }
        .btn {
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.35);
          background: rgba(255,255,255,.18);
          color: #fff;
          cursor: pointer;
          display:flex; align-items:center; gap:8px;
        }
        .btn:hover { background: rgba(255,255,255,.26); }

        /* Список клиентов — естественная высота */
        .content {
          border-radius: 20px;
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.16);
          box-shadow: 0 12px 28px rgba(0,0,0,.22);
          padding: 12px;
        }
        .empty { opacity: .9; }
        .client-row{
          display:flex; align-items:center; justify-content:space-between;
          padding:10px 12px; border-radius:12px; margin-bottom:8px;
          background: rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.16);
        }
        .client-name { font-weight:600; }
        .client-email { opacity:.9; }

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
          .brand img   { height: 72px; }
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
        <div className="card">
          <div className="menu-title">Меню</div>

          <div className={`mitem ${isActive("/home") ? "active" : ""}`} onClick={go("/home")}>
            <div className="micon"><svg viewBox="0 0 24 24"><path d="M12 3l9 8h-3v10h-5V15H11v6H6V11H3z"/></svg></div>
            <div>Главная</div>
          </div>

          <div className={`mitem ${isActive("/profile") ? "active" : ""}`} onClick={go("/profile")}>
            <div className="micon"><svg viewBox="0 0 24 24"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/></svg></div>
            <div>Профиль</div>
          </div>

          <div className={`mitem ${isActive("/clients") ? "active" : ""}`} onClick={go("/clients")}>
            <div className="micon"><svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/></svg></div>
            <div>Клиенты</div>
          </div>

          <div className={`mitem ${isActive("/calendar") ? "active" : ""}`} onClick={go("/calendar")}>
            <div className="micon"><svg viewBox="0 0 24 24"><path d="M7 10h5v5H7zM5 2h2v2h10V2h2v2h2v18H3V4h2zm0 6v12h14V8H5z"/></svg></div>
            <div>Календарь</div>
          </div>

          <div className={`mitem ${isActive("/notes") ? "active" : ""}`} onClick={go("/notes")}>
            <div className="micon"><svg viewBox="0 0 24 24"><path d="M3 3h18v14H8l-5 5z"/></svg></div>
            <div>Заметки</div>
          </div>

          <div className={`mitem ${isActive("/reports") ? "active" : ""}`} onClick={go("/reports")}>
            <div className="micon"><svg viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h14v-2H7v2zm0-4h14v-2H7v2zm0-6v2h14V7H7z"/></svg></div>
            <div>Отчёты</div>
          </div>

          <div className={`mitem ${isActive("/settings") ? "active" : ""}`} onClick={go("/settings")}>
            <div className="micon"><svg viewBox="0 0 24 24"><path d="M19.14 12.94a7.43 7.43 0 000-1.88l2.03-1.58-1.92-3.32-2.39.96a7.6 7.6 0 00-1.63-.95l-.36-2.54h-3.84l-.36 2.54a7.6 7.6 0 00-1.63.95l-2.39-.96L2.83 9.48l2.03 1.58a7.43 7.43 0 000 1.88L2.83 14.6l1.92 3.32 2.39-.96c.5.38 1.04.69 1.63.95l.36 2.54h3.84l.36-2.54c.59-.26 1.13-.57 1.63-.95l2.39.96 1.92-3.32-2.03-1.66zM12 15.5A3.5 3.5 0 1115.5 12 3.5 3.5 0 0112 15.5z"/></svg></div>
            <div>Настройки</div>
          </div>
        </div>

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
            <input type="text" placeholder="Поиск по клиентам и заметкам ..." />
          </div>

          <div className="tops">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>

        <div className="actions">
          <button className="btn" onClick={handleAddClient}>+ Добавить клиента</button>
          <button className="btn">📄 Добавить рассылку</button>
        </div>

        <div className="content">
          {clients.length === 0 ? (
            <div className="empty">Пока нет клиентов</div>
          ) : (
            clients.map((c) => (
              <div className="client-row" key={c.id}>
                <div className="client-name">{c.name}</div>
                {c.email && <div className="client-email">{c.email}</div>}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="footer">© 2025 Teyra</div>

      {/* плавающий чат в правом нижнем углу */}
      <ChatWidget />
    </div>
  );
}