import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";

type TClient = {
  id: string;
  display_name: string;
  created_at: string;
  therapist_id: string | null;
};

export default function Clients() {
  const { t } = useTranslation();
  const [clients, setClients] = useState<TClient[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    setErrorText(null);
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("display_name", { ascending: true });

    if (error) {
      console.error("Select clients error:", error);
      setErrorText(error.message);
    } else {
      setClients((data as TClient[]) ?? []);
    }
    setLoading(false);
  }

  async function addClient() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    setErrorText(null);

    const { error } = await supabase
      .from("clients")
      .insert({ display_name: trimmed }); // therapist_id не отправляем

    if (error) {
      console.error("Insert client error:", error);
      setErrorText(error.message);
    } else {
      setName("");
      await loadClients();
    }
    setLoading(false);
  }


  return (
    <div style={{ padding: 20, maxWidth: 520 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => { try { localStorage.removeItem('lang'); } catch {}; location.reload(); }}>
          ← {t('common.changeLanguage')}
        </button>
        <h1 style={{ margin: 0 }}>{t('clients.title')}</h1>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder={t('clients.placeholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button onClick={addClient} disabled={loading}>
          {loading ? '...' : t('clients.add')}
        </button>
      </div>

      {errorText && (
        <div style={{ color: "tomato", marginBottom: 12 }}>{errorText}</div>
      )}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {clients.map((c) => (
          <li
            key={c.id}
            style={{
              border: "1px solid #444",
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <div style={{ fontWeight: 600 }}>{c.display_name}</div>
            <div style={{ opacity: 0.7, fontSize: 12 }}>
              created: {new Date(c.created_at).toLocaleString()}
            </div>
          </li>
        ))}
        {clients.length === 0 && <li style={{ opacity: 0.7 }}>No clients yet</li>}
      </ul>
    </div>
  );
}
