import React from "react";
import ChatWidget from "./components/ChatWidget";
import NewsFeed from "./components/NewsFeed";

type Lang = "en" | "ru" | "de";

const UI = {
  en: {
    menuTitle: "Menu",
    menu: {
      home: "Home",
      clients: "Clients",
      schedule: "Calendar",
      liveSession: "Session",
      notes: "Notes",
      templates: "Templates",
      tasks: "Tasks",
      reports: "Reports",
      settings: "Settings",
    },
    searchPlaceholder: "Search clients & notes…",
    widgets: {
      quick: "Quick actions",
      today: "Today",
      recent: "Recent clients",
      drafts: "Draft notes",
    },
    hints: {
      quick: "Add client • Start session • Note • Task",
      today: "Today's sessions will appear here.",
      recent: "Your recently opened clients.",
      drafts: "Your unfinished drafts.",
    },
    footer: "© 2025 Teyra",
  },
  ru: {
    menuTitle: "Меню",
    menu: {
      home: "Главная",
      clients: "Клиенты",
      schedule: "Расписание",
      liveSession: "Сессия",
      notes: "Заметки",
      templates: "Шаблоны",
      tasks: "Задачи",
      reports: "Отчёты",
      settings: "Настройки",
    },
    searchPlaceholder: "Поиск по клиентам и заметкам…",
    widgets: {
      quick: "Быстрые действия",
      today: "Сегодня",
      recent: "Недавние клиенты",
      drafts: "Черновики заметок",
    },
    hints: {
      quick: "Добавить клиента • Создать сессию • Заметка • Задача",
      today: "Сессии на сегодня появятся здесь.",
      recent: "Список последних открытых клиентов.",
      drafts: "Ваши незавершённые черновики.",
    },
    footer: "© 2025 Teyra",
  },
  de: {
    menuTitle: "Menü",
    menu: {
      home: "Startseite",
      clients: "Kunden",
      schedule: "Kalender",
      liveSession: "Sitzung",
      notes: "Notizen",
      templates: "Vorlagen",
      tasks: "Aufgaben",
      reports: "Berichte",
      settings: "Einstellungen",
    },
    searchPlaceholder: "Suche nach Kunden & Notizen…",
    widgets: {
      quick: "Schnelle Aktionen",
      today: "Heute",
      recent: "Zuletzt verwendete Kunden",
      drafts: "Entwürfe",
    },
    hints: {
      quick: "Kunde hinzufügen • Sitzung starten • Notiz • Aufgabe",
      today: "Heutige Sitzungen erscheinen hier.",
      recent: "Ihre zuletzt geöffneten Kunden.",
      drafts: "Ihre unvollendeten Entwürfe.",
    },
    footer: "© 2025 Teyra",
  },
} as const;

export default function Home() {
  const lang = (localStorage.getItem("teyra_lang") as Lang) || "ru";
  const t = UI[lang] || UI.en;

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
      <style>{`
        .wrap { width:100%; max-width:1200px; margin:0 auto; padding:24px; box-sizing:border-box; }
        .layout { display:grid; grid-template-columns: 260px 1fr; gap:20px; }

        .sidebar {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 18px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.22);
          backdrop-filter: blur(4px);
          padding: 14px;
        }
        .sb-title { opacity:.95; font-weight:700; letter-spacing:.3px; margin:8px 10px 12px; }
        .sb-list { list-style:none; margin:0; padding:0; }
        .sb-item { padding:10px 12px; border-radius:12px; cursor:pointer; opacity:.95; }
        .sb-item:hover { background: rgba(255,255,255,0.14); }
        .active { background: rgba(255,255,255,0.20); }

        .main { display:flex; flex-direction:column; gap:16px; }

        .topbar {
          display:flex; align-items:center; gap:16px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 18px;
          padding: 12px 16px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.22);
          backdrop-filter: blur(4px);
        }
        .brand-logo {
          height: 96px; /* увеличен размер логотипа */
          width: auto;
          filter: drop-shadow(0 8px 22px rgba(0,0,0,.28));
        }
        .search {
          flex:1; height: 46px;
          border-radius: 999px;
          border:none; outline:none;
          padding:0 16px; font-size:16px; color:#1a1a1a;
          background: rgba(255,255,255,0.96);
          box-shadow: 0 10px 24px rgba(0,0,0,0.18);
        }
        .icons { display:flex; align-items:center; gap:8px; }
        .ic {
          width:36px; height:36px; border-radius:999px;
          background: rgba(255,255,255,0.18);
          border:1px solid rgba(255,255,255,0.35);
          box-shadow: 0 8px 20px rgba(0,0,0,.22);
        }

        .grid { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
        .card {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.22);
          backdrop-filter: blur(4px);
          min-height: 140px;
        }
        .card h3 { margin:0 0 10px; font-size:18px; opacity:.98; }
        .muted { opacity:.9; }

        /* Адаптив */
        @media (max-width: 1024px) {
          .layout { grid-template-columns: 1fr; }
          .sidebar { order:2; }
          .main { order:1; }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="wrap">
        <div className="layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sb-title">{t.menuTitle}</div>
            <ul className="sb-list">
              <li className="sb-item active">{t.menu.home}</li>
              <li className="sb-item">{t.menu.clients}</li>
              <li className="sb-item">{t.menu.schedule}</li>
              <li className="sb-item">{t.menu.liveSession}</li>
              <li className="sb-item">{t.menu.notes}</li>
              <li className="sb-item">{t.menu.templates}</li>
              <li className="sb-item">{t.menu.tasks}</li>
              <li className="sb-item">{t.menu.reports}</li>
              <li className="sb-item">{t.menu.settings}</li>
            </ul>
            {/* Блок новостей внизу меню */}
            <NewsFeed />
          </aside>

          {/* Main */}
          <main className="main">
            {/* Topbar */}
            <div className="topbar">
              {/* только иконка-логотип без текстовой надписи */}
              <img src="/teyra-logo.png" alt="TEYRA" className="brand-logo" />
              <input className="search" placeholder={t.searchPlaceholder} />
              <div className="icons">
                <div className="ic" title="Notifications"></div>
                <div className="ic" title="Language"></div>
                <div className="ic" title="Profile"></div>
              </div>
            </div>

            {/* Widgets */}
            <div className="grid">
              <section className="card">
                <h3>{t.widgets.quick}</h3>
                <div className="muted">{t.hints.quick}</div>
              </section>

              <section className="card">
                <h3>{t.widgets.today}</h3>
                <div className="muted">{t.hints.today}</div>
              </section>

              <section className="card">
                <h3>{t.widgets.recent}</h3>
                <div className="muted">{t.hints.recent}</div>
              </section>

              <section className="card">
                <h3>{t.widgets.drafts}</h3>
                <div className="muted">{t.hints.drafts}</div>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "auto", marginBottom: 16, opacity: .95, fontSize: 14 }}>
        {t.footer}
      </div>
      {/* Чат-виджет */}
      <div style={{ position: "relative", zIndex: 5 }}>
        {/* импорт компонента выше в начале файла, если его нет — добавь:  */}
        {/* import ChatWidget from "./components/ChatWidget"; */}
        {/* а здесь отрисовываем сам виджет: */}
        {/* @ts-ignore */}
        <ChatWidget />
      </div>
    </div>
  );
}
