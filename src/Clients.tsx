// src/Clients.tsx
import BrandLayout from "./components/BrandLayout";
import NewsFeed from "./components/NewsFeed";

export default function Clients() {
  return (
    <BrandLayout
      active="clients"
      // Передаём сразу несколько вариантов названий слота —
      // тот, который поддерживает BrandLayout, подхватится.
      leftExtra={<NewsFeed />}
      leftAside={<NewsFeed />}
      sidebarExtra={<NewsFeed />}
    >
      {/* Верхняя плашка: логотип + поиск + 3 кружка справа */}
      <div className="topbar">
        <div className="brand">
          <img src="/teyra-logo.png" alt="TEYRA" />
        </div>

        <div className="searchWrap">
          <input
            className="search"
            placeholder="Поиск по клиентам и заметкам..."
          />
          <div className="iconDots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="actions">
        <button className="pill">+ Добавить клиента</button>
        <button className="pill">
          <span style={{ marginRight: 8 }}>📬</span>
          Добавить рассылку
        </button>
      </div>

      {/* Пустое состояние списка клиентов */}
      <section className="card">Пока нет клиентов</section>

      <style>{`
        .topbar {
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 22px;
          padding: 14px 16px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.18);
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .brand img { height: 18px; opacity: .95; }
        .searchWrap { flex: 1; display: flex; align-items: center; gap: 12px; }
        .search {
          flex: 1;
          height: 34px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.35);
          background: white;
          outline: none;
          padding: 0 16px;
        }
        .iconDots { display: flex; gap: 10px; }
        .dot {
          width: 32px; height: 32px; border-radius: 999px;
          background: rgba(255,255,255,0.22);
          border: 1px solid rgba(255,255,255,0.28);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
        }
        .actions { display: flex; gap: 12px; margin: 14px 0; }
        .pill {
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.18);
          color: #fff;
          box-shadow: 0 10px 24px rgba(0,0,0,0.22);
          backdrop-filter: blur(3px);
          cursor: pointer;
        }
        .card {
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 18px;
          padding: 18px 16px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.18);
        }
      `}</style>
    </BrandLayout>
  );
}