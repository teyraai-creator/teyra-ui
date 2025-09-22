import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Clients page (CRM-вид)
 * - Левое статичное меню (подсвечен пункт "Клиенты")
 * - Верхняя панель (логотип + глобальный поиск + иконки)
 * - Панель действий: [+ Добавить клиента]  [✉ Добавить рассылку]
 * - Табличный список клиентов (пока статичный демо-контент)
 * - Локализация читается из localStorage("teyra_lang")
 */
export default function Clients() {
  const navigate = useNavigate();

  // --- локализация (простая, читает язык из localStorage) ---
  const lang = (localStorage.getItem("teyra_lang") || "ru") as "ru" | "en" | "de";
  const t = useMemo(() => {
    const ru = {
      menu: {
        home: "Главная",
        clients: "Клиенты",
        calendar: "Календарь",
        session: "Сессии",
        notes: "Заметки",
        templates: "Шаблоны",
        tasks: "Задачи",
        reports: "Отчёты",
        settings: "Настройки",
      },
      searchPlaceholder: "Поиск клиентов и заметок…",
      actionsTitle: "Действия",
      addClient: "Добавить клиента",
      addCampaign: "Добавить рассылку",
      table: {
        title: "База клиентов",
        name: "Имя",
        contact: "Контакты",
        last: "Последняя сессия",
        notes: "Заметок",
        status: "Статус",
        actions: "Действия",
        view: "Открыть",
        edit: "Редакт.",
        remove: "Удалить",
        empty: "Пока нет клиентов. Нажмите «Добавить клиента».",
      },
      footer: "© 2025 Teyra",
      statuses: {
        active: "Активен",
        inProgress: "В работе",
        done: "Завершён",
      },
    };

    const en = {
      menu: {
        home: "Home",
        clients: "Clients",
        calendar: "Calendar",
        session: "Sessions",
        notes: "Notes",
        templates: "Templates",
        tasks: "Tasks",
        reports: "Reports",
        settings: "Settings",
      },
      searchPlaceholder: "Search clients & notes…",
      actionsTitle: "Quick actions",
      addClient: "Add client",
      addCampaign: "Add campaign",
      table: {
        title: "Clients database",
        name: "Name",
        contact: "Contacts",
        last: "Last session",
        notes: "Notes",
        status: "Status",
        actions: "Actions",
        view: "Open",
        edit: "Edit",
        remove: "Delete",
        empty: "No clients yet. Click \"Add client\".",
      },
      footer: "© 2025 Teyra",
      statuses: {
        active: "Active",
        inProgress: "In progress",
        done: "Completed",
      },
    };

    const de = {
      menu: {
        home: "Start",
        clients: "Klienten",
        calendar: "Kalender",
        session: "Sitzungen",
        notes: "Notizen",
        templates: "Vorlagen",
        tasks: "Aufgaben",
        reports: "Berichte",
        settings: "Einstellungen",
      },
      searchPlaceholder: "Suche nach Klienten & Notizen…",
      actionsTitle: "Aktionen",
      addClient: "Klient hinzufügen",
      addCampaign: "Kampagne hinzufügen",
      table: {
        title: "Klienten-Datenbank",
        name: "Name",
        contact: "Kontakt",
        last: "Letzte Sitzung",
        notes: "Notizen",
        status: "Status",
        actions: "Aktionen",
        view: "Öffnen",
        edit: "Bearb.",
        remove: "Löschen",
        empty: "Noch keine Klienten. Klicke \"Klient hinzufügen\".",
      },
      footer: "© 2025 Teyra",
      statuses: {
        active: "Aktiv",
        inProgress: "In Arbeit",
        done: "Abgeschlossen",
      },
    };

    return lang === "en" ? en : lang === "de" ? de : ru;
  }, [lang]);

  // демо-данные (потом заменим на Supabase)
  const [rows] = useState([
    {
      id: "c-001",
      name: "Анна К.",
      contact: "anna@example.com",
      last: "16.09.2025",
      notes: 8,
      status: "active",
    },
    {
      id: "c-002",
      name: "Иван П.",
      contact: "+49 176 123 45 67",
      last: "14.09.2025",
      notes: 2,
      status: "inProgress",
    },
    {
      id: "c-003",
      name: "Мария Л.",
      contact: "maria@mail.com",
      last: "—",
      notes: 0,
      status: "done",
    },
  ]);

  return (
    <div className="page">
      <style>{css}</style>

      {/* общая сетка: левый сайдбар + контент */}
      <div className="shell">
        {/* Сайдбар */}
        <aside className="sidebar">
          <div className="sb-title">Меню</div>
          <div
            className="sb-item"
            onClick={() => navigate("/home")}
          >
            {t.menu.home}
          </div>
          <div className="sb-item active">{t.menu.clients}</div>
          <div className="sb-item">{t.menu.calendar}</div>
          <div className="sb-item">{t.menu.session}</div>
          <div className="sb-item">{t.menu.notes}</div>
          <div className="sb-item">{t.menu.templates}</div>
          <div className="sb-item">{t.menu.tasks}</div>
          <div className="sb-item">{t.menu.reports}</div>
          <div className="sb-item">{t.menu.settings}</div>
        </aside>

        {/* Контент */}
        <main className="content">
          {/* Топ-бар */}
          <div className="topbar card">
            <div className="brand">
              {/* тут только логотип, без надписи — как договаривались */}
              <img src="/teyra-logo.png" className="brand-logo" alt="TEYRA" />
            </div>
            <input
              className="search"
              placeholder={t.searchPlaceholder}
            />
            <div className="icons">
              <div className="ic" />
              <div className="ic" />
              <div className="ic" />
            </div>
          </div>

          {/* Панель действий */}
          <div className="actions">
            <div className="act-left">
              <div className="act-title">{t.actionsTitle}</div>
            </div>
            <div className="act-right">
              <button className="btn primary" onClick={() => alert("+ client")}>
                <span className="plus">＋</span> {t.addClient}
              </button>
              <button className="btn ghost" onClick={() => alert("campaign")}>
                ✉ {t.addCampaign}
              </button>
            </div>
          </div>

          {/* Таблица клиентов */}
          <div className="card table-card">
            <div className="table-title">{t.table.title}</div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 280, textAlign: "left" }}>{t.table.name}</th>
                    <th style={{ width: 260, textAlign: "left" }}>{t.table.contact}</th>
                    <th style={{ width: 160 }}>{t.table.last}</th>
                    <th style={{ width: 120 }}>{t.table.notes}</th>
                    <th style={{ width: 160 }}>{t.table.status}</th>
                    <th style={{ width: 200 }}>{t.table.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty">
                        {t.table.empty}
                      </td>
                    </tr>
                  )}

                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="cell-left">
                        <span className="avatar">{r.name.slice(0, 1)}</span>
                        <span>{r.name}</span>
                      </td>
                      <td className="cell-left">{r.contact}</td>
                      <td className="cell-center">{r.last}</td>
                      <td className="cell-center">{r.notes}</td>
                      <td className="cell-center">
                        <span className={`badge ${r.status}`}>
                          {r.status === "active"
                            ? t.statuses.active
                            : r.status === "inProgress"
                            ? t.statuses.inProgress
                            : t.statuses.done}
                        </span>
                      </td>
                      <td className="cell-center">
                        <div className="row-actions">
                          <button className="mini" onClick={() => alert(`open ${r.id}`)}>
                            {t.table.view}
                          </button>
                          <button className="mini" onClick={() => alert(`edit ${r.id}`)}>
                            {t.table.edit}
                          </button>
                          <button className="mini danger" onClick={() => alert(`remove ${r.id}`)}>
                            {t.table.remove}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Футер */}
          <div className="footer">{t.footer}</div>
        </main>
      </div>
    </div>
  );
}

/* ===== CSS (inline в файле, чтобы выглядело точно как на Home) ===== */
const css = `
.page {
  min-height: 100vh;
  background: linear-gradient(135deg,#004AAD 0%,#0099FF 100%);
  color: #fff;
}

/* layout */
.shell { display: grid; grid-template-columns: 280px 1fr; gap: 20px; padding: 20px; }
.sidebar {
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 18px;
  padding: 16px 12px;
  backdrop-filter: blur(6px);
  box-shadow: 0 18px 42px rgba(0,0,0,0.25);
}
.sb-title { opacity:.95; font-weight:700; padding: 6px 12px 10px 12px; }
.sb-item {
  padding: 10px 12px;
  margin: 4px 0;
  border-radius: 12px;
  opacity: .95;
  cursor: pointer;
}
.sb-item:hover { background: rgba(255,255,255,0.12); }
.sb-item.active { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.25); }

.content { display: flex; flex-direction: column; gap: 18px; }

/* cards / topbar */
.card {
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 18px;
  padding: 14px;
  backdrop-filter: blur(6px);
  box-shadow: 0 18px 42px rgba(0,0,0,0.25);
}
.topbar { display: grid; grid-template-columns: 220px 1fr 148px; align-items: center; gap: 14px; }
.brand { display:flex; align-items:center; gap:10px; padding-left: 6px; }
.brand-logo { height: 38px; width: auto; filter: drop-shadow(0 12px 26px rgba(0,0,0,.28)); }

.search {
  width: 100%;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.35);
  padding: 14px 18px;
  outline: none;
  background: rgba(255,255,255,0.18);
  color: #fff;
}
.search::placeholder { color: rgba(255,255,255,0.85); }

.icons { display:flex; gap: 10px; justify-content: flex-end; }
.ic { width: 38px; height: 38px; border-radius: 999px; background: rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.28); }

/* actions */
.actions { display:flex; justify-content: space-between; align-items: center; padding: 0 6px; }
.act-title { opacity:.95; font-weight:700; }
.act-right { display:flex; gap: 10px; }
.btn {
  border-radius: 999px;
  padding: 12px 18px;
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.14);
  color:#fff;
  cursor:pointer;
  box-shadow: 0 10px 24px rgba(0,0,0,0.22);
}
.btn.ghost { background: rgba(255,255,255,0.10); }
.btn.primary { background: rgba(64,180,255,0.40); }
.btn:hover { filter: brightness(1.05); }
.plus { font-weight:700; margin-right: 6px; }

/* table */
.table-card { padding: 10px 12px; }
.table-title { font-weight: 800; opacity:.98; padding: 6px 4px 10px 4px; }
.table-wrap { overflow: auto; }
.table { width:100%; border-collapse: collapse; }
.table th, .table td {
  border-top: 1px solid rgba(255,255,255,0.18);
  padding: 12px 10px;
}
.table thead th { border-top: none; opacity:.95; text-align:center; }
.cell-left { text-align:left; }
.cell-center { text-align:center; }

.avatar {
  display:inline-grid; place-items:center;
  width:26px; height:26px; border-radius:999px;
  background: rgba(255,255,255,0.20);
  border:1px solid rgba(255,255,255,0.28);
  margin-right:8px; font-weight:700;
}

.badge {
  display:inline-block; padding:6px 10px; border-radius:999px;
  border:1px solid rgba(255,255,255,0.28);
  background: rgba(255,255,255,0.12);
}
.badge.active { background: rgba(76, 217, 100, 0.22); }
.badge.inProgress { background: rgba(255, 214, 10, 0.22); }
.badge.done { background: rgba(142, 142, 147, 0.22); }

.row-actions { display:flex; gap:8px; justify-content: center; }
.mini {
  border-radius: 999px;
  border:1px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.14);
  color:#fff; padding:6px 10px; cursor:pointer;
}
.mini.danger { background: rgba(255,69,58,0.30); }

.empty { text-align:center; opacity:.9; padding: 28px 12px; }

/* footer */
.footer {
  text-align:center; margin: 6px auto 8px auto; opacity:.95; font-size:14px;
}

/* адаптив */
@media (max-width: 1100px) {
  .topbar { grid-template-columns: 180px 1fr 120px; }
}
@media (max-width: 900px) {
  .shell { grid-template-columns: 1fr; }
  .sidebar { order: 2; }
  .content { order: 1; }
}
`;
