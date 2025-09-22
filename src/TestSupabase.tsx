import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function TestSupabase() {
  const [clients, setClients] = useState<any[]>([]);
  const [newClientName, setNewClientName] = useState("");
  const [loading, setLoading] = useState(false);

  // Загружаем список клиентов при старте
  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ошибка при загрузке:", error.message);
    } else {
      setClients(data || []);
    }
  }

  async function addClient() {
    if (!newClientName.trim()) return;

    setLoading(true);
    const { error } = await supabase
      .from("clients")
      .insert([{ display_name: newClientName }]); // therapist_id подставится из RLS

    setLoading(false);

    if (error) {
      alert("Ошибка: " + error.message);
      console.error(error);
    } else {
      setNewClientName("");
      fetchClients();
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Клиенты</h1>
      <p>успешно!</p>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Имя клиента"
          value={newClientName}
          onChange={(e) => setNewClientName(e.target.value)}
        />
        <button onClick={addClient} disabled={loading}>
          {loading ? "Добавление..." : "Добавить"}
        </button>
      </div>

      <div>
        {clients.map((client) => (
          <div
            key={client.id}
            style={{
              border: "1px solid #444",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <strong>{client.display_name}</strong>
            <div>создано: {new Date(client.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
