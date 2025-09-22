import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";

/** Хелпер: t с fallback, чтобы не видеть ключи, если переводов ещё нет */
function useTT() {
  const { t } = useTranslation();
  return (key: string, fallback: string) => {
    const v = t(key);
    return v === key ? fallback : v;
  };
}

type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  lastSession?: string;
  status?: "active" | "paused" | "archived";
  tags?: string[];
};

export default function ClientsPage() {
  const tt = useTT();
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState<any>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [query, setQuery] = useState("");

  // Модалка "Добавить клиента"
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  useEffect(() => {
    if (session === null) return;
    if (!session) navigate("/auth", { replace: true });
  }, [session, navigate]);

  // Поиск по демоданным
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.phone || "").toLowerCase().includes(q)
    );
  }, [clients, query]);

  const addClient = () => {
    if (!form.name.trim()) return;
    setClients((prev) => [
      {
        id: String(Date.now()),
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        lastSession: "—",
        status: "active",
        tags: [],
      },
      ...prev,
    ]);
    setForm({ name: "", email: "" });
    setShowAdd(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#004AAD 0%,#0099FF 100%)",
        display: "flex",
        gap: 24,
        padding: 24,
        color: "white",
      }}
    >
      {/* ===== Левое меню (статичное) ===== */}
      <aside
        style={{
          width: 220,
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 18,
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          padding: 12,
          height: "calc(100dvh - 48px)",
          position: "sticky",
          top: 24,
          overflow: "auto",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            opacity: 0.9,
            padding: "10px 12px",
            marginBottom: 6,
          }}
        >
          {tt("menu.title", "Menu")}
        </div>

        <NavItem
          active={isActive("/home")}
          onClick={() => navigate("/home")}
          label={tt("menu.home", "Home")}
          icon={<HomeIcon />}
        />
        <NavItem
          active={isActive("/clients")}
          onClick={() => navigate("/clients")}
          label={tt("menu.clients", "Clients")}
          icon={<UsersIcon />}
        />
        <NavItem
          active={isActive("/calendar")}
          onClick={() => navigate("/home")}
          label={tt("menu.calendar", "Calendar")}
          icon={<CalendarIcon />}
          disabled
        />
        <NavItem
          active={isActive("/notes")}
          onClick={() => navigate("/home")}
          label={tt("menu.notes", "Notes")}
          icon={<NotesIcon />}
          disabled
        />
        <NavItem
          active={isActive("/reports")}
          onClick={() => navigate("/home")}
          label={tt("menu.reports", "Reports")}
          icon={<ReportsIcon />}
          disabled
        />
        <NavItem
          active={isActive("/settings")}
          onClick={() => navigate("/home")}
          label={tt("menu.settings", "Settings")}
          icon={<SettingsIcon />}
          disabled
        />
      </aside>

      {/* ===== Контент ===== */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Topbar: большой логотип + БЕЛЫЙ поиск + 3 круглые иконки (не наезжают) */}
        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 18,
            boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            padding: 10,
            display: "grid",
            gridTemplateColumns: "220px 1fr 132px", // логотип / поиск / круглые кнопки
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* лого стало КРУПНЕЕ и плотнее по отступам */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/teyra-logo.png"
              alt="TEYRA"
              style={{
                height: 72, // было 48 → 64 → 72
                width: "auto",
                filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.25))",
              }}
            />
          </div>

          {/* Белое поле поиска — никогда не налезает на иконки */}
          <div style={{ display: "flex" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tt("clients.searchPlaceholder", "Search clients & notes...")}
              style={{
                width: "100%",
                padding: "12px 18px",
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "#FFFFFF",
                color: "#0E1E2F",
                outline: "none",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.06), 0 8px 20px rgba(0,0,0,0.18)",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <RoundIcon />
            <RoundIcon />
            <RoundIcon />
          </div>
        </div>

        {/* Панель действий */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button className="btn" onClick={() => setShowAdd(true)}>
            + {tt("clients.add", "Add client")}
          </button>
          <button className="btn" onClick={() => alert("Coming soon ✨")}>
            ✉️ {tt("clients.addCampaign", "Add campaign")}
          </button>

          <style>{`
            .btn {
              padding: 10px 18px;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,0.35);
              background: rgba(255,255,255,0.18);
              color: #fff;
              box-shadow: 0 10px 24px rgba(0,0,0,0.22);
              backdrop-filter: blur(3px);
              cursor: pointer;
            }
            .card {
              background: rgba(255,255,255,0.12);
              border: 1px solid rgba(255,255,255,0.25);
              border-radius: 18px;
              box-shadow: 0 12px 30px rgba(0,0,0,0.25);
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 14px 16px;
              text-align: left;
            }
            th {
              font-weight: 700;
              opacity: 0.95;
            }
            tr + tr td {
              border-top: 1px solid rgba(255,255,255,0.15);
            }
            .tag {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 999px;
              background: rgba(255,255,255,0.18);
              border: 1px solid rgba(255,255,255,0.35);
              margin-right: 6px;
            }
            .status {
              padding: 4px 10px;
              border-radius: 999px;
              border: 1px solid rgba(255,255,255,0.35);
              background: rgba(255,255,255,0.18);
            }
          `}</style>
        </div>

        {/* Таблица/пустое состояние */}
        <div className="card" style={{ padding: 12, overflow: "auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 16, opacity: 0.9 }}>
              {tt("clients.empty", "No clients yet")}
            </div>
          ) : (
            <ClientsTable tt={tt} rows={filtered} />
          )}
        </div>

        {/* Футер */}
        <div style={{ textAlign: "center", marginTop: "auto", opacity: 0.95, fontSize: 14 }}>
          © 2025 Teyra
        </div>
      </main>

      {/* === Модалка: добавить клиента === */}
      {showAdd && (
        <div
          onClick={() => setShowAdd(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{
              width: "min(520px, 96vw)",
              padding: 16,
              color: "white",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 12 }}>
              {tt("clients.addTitle", "Add client")}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <input
                placeholder={tt("clients.form.name", "Full name")}
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                style={pillInputStyle}
              />
              <input
                placeholder={tt("clients.form.email", "Email")}
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                style={pillInputStyle}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
              <button className="btn" onClick={() => setShowAdd(false)}>
                {tt("common.cancel", "Cancel")}
              </button>
              <button className="btn" onClick={addClient}>
                {tt("common.save", "Save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================== Подкомпоненты ================== */

function ClientsTable({
  tt,
  rows,
}: {
  tt: ReturnType<typeof useTT>;
  rows: Client[];
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>{tt("clients.table.name", "Name")}</th>
          <th>{tt("clients.table.contact", "Contact")}</th>
          <th>{tt("clients.table.last", "Last session")}</th>
          <th>{tt("clients.table.status", "Status")}</th>
          <th>{tt("clients.table.tags", "Tags")}</th>
          <th style={{ width: 120 }}>{tt("clients.table.actions", "Actions")}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((c) => (
          <tr key={c.id}>
            <td style={{ fontWeight: 600 }}>{c.name}</td>
            <td style={{ opacity: 0.95 }}>{c.email || c.phone || "—"}</td>
            <td style={{ opacity: 0.95 }}>{c.lastSession || "—"}</td>
            <td>
              <span className="status">
                {c.status === "active"
                  ? tt("clients.status.active", "Active")
                  : c.status === "paused"
                  ? tt("clients.status.paused", "Paused")
                  : tt("clients.status.archived", "Archived")}
              </span>
            </td>
            <td>
              {(c.tags || []).length === 0
                ? "—"
                : c.tags!.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
            </td>
            <td>
              <button className="btn" onClick={() => alert("Edit — coming soon")}>
                {tt("clients.actions.edit", "Edit")}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function NavItem({
  label,
  onClick,
  active,
  disabled,
  icon,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        textAlign: "left",
        width: "100%",
        padding: "10px 12px",
        borderRadius: 12,
        marginBottom: 6,
        border: "1px solid rgba(255,255,255,0.28)",
        background: active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
        color: "white",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <span style={{ display: "inline-flex" }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function RoundIcon() {
  return (
    <div
      style={{
        height: 36,
        width: 36,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.35)",
        background: "rgba(255,255,255,0.18)",
        boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
      }}
    />
  );
}

const pillInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 18px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.35)",
  background: "rgba(255,255,255,0.18)",
  color: "white",
  outline: "none",
  boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
};

/* ===== SVG иконки (простые, читабельные) ===== */
function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="10" cy="7" r="4" stroke="white" strokeWidth="1.6"/>
      <path d="M21 21v-2a4 4 0 0 0-3-3.87" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M17 11a4 4 0 0 0 0-6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="white" strokeWidth="1.6"/>
      <path d="M16 3v4M8 3v4M3 10h18" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function NotesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="white" strokeWidth="1.6"/>
      <path d="M8 8h8M8 12h8M8 16h6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
function ReportsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 21h18" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      <rect x="5" y="10" width="3" height="7" rx="1" stroke="white" strokeWidth="1.6"/>
      <rect x="10.5" y="6" width="3" height="11" rx="1" stroke="white" strokeWidth="1.6"/>
      <rect x="16" y="12" width="3" height="5" rx="1" stroke="white" strokeWidth="1.6"/>
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="white" strokeWidth="1.6"/>
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1-1.4 1.4l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V19a1 1 0 0 1-1 1h-1a1 1 0 0 0-.9.6 1 1 0 0 1-1.8 0 1 1 0 0 0-.9-.6H9a1 1 0 0 1-1-1v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1A1 1 0 1 1 4.8 16l.1-.1A1 1 0 0 0 5 14.8a1 1 0 0 0-.9-.6H4a1 1 0 0 1-1-1v-1c0-.4.2-.8.6-.9a1 1 0 0 0 .4-1.6l-.1-.1A1 1 0 1 1 5.4 6l.1.1a1 1 0 0 0 1.1.2c.4-.2.6-.6.6-1V5a1 1 0 0 1 1-1h1c.4 0 .8.2.9.6.2.4.6.6 1 .6s.8-.2 1-.6c.1-.4.5-.6.9-.6h1a1 1 0 0 1 1 1v.1c0 .4.2.8.6 1 .4.2.8.1 1.1-.2l.1-.1A1 1 0 1 1 19.8 8l-.1.1c-.3.3-.4.7-.2 1.1.2.3.6.6 1 .6h.1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-.1c-.4 0-.8.2-1 .6Z" stroke="white" strokeWidth="1.1"/>
    </svg>
  );
}