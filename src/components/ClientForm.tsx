// src/components/ClientForm.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ClientFormProps {
  onSubmit: (clientData: { display_name: string; tags?: any }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ClientForm({ onSubmit, onCancel, loading = false }: ClientFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    display_name: "",
    tags: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.display_name.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="client-form-overlay">
      <style>{`
        .client-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .client-form {
          background: linear-gradient(135deg, #004AAD 0%, #0099FF 100%);
          border-radius: 20px;
          padding: 24px;
          width: 90%;
          max-width: 500px;
          color: white;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .form-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          opacity: 0.9;
        }
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 16px;
          outline: none;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.15);
        }
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }
        .btn {
          padding: 10px 20px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.35);
          background: rgba(255, 255, 255, 0.18);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn:hover {
          background: rgba(255, 255, 255, 0.26);
        }
        .btn-primary {
          background: #4CAF50;
          border-color: #4CAF50;
        }
        .btn-primary:hover {
          background: #45a049;
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="client-form">
        <div className="form-header">
          <h2 className="form-title">Добавить клиента</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Имя клиента *</label>
            <input
              type="text"
              className="form-input"
              value={formData.display_name}
              onChange={(e) => handleChange("display_name", e.target.value)}
              placeholder="Введите имя клиента"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Теги (JSON)</label>
            <input
              type="text"
              className="form-input"
              value={JSON.stringify(formData.tags)}
              onChange={(e) => {
                try {
                  const tags = JSON.parse(e.target.value);
                  handleChange("tags", tags);
                } catch {
                  // Игнорируем невалидный JSON
                }
              }}
              placeholder='{"category": "VIP", "status": "active"}'
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={onCancel}>
              {t("clients.form.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !formData.display_name.trim()}>
              {loading ? "Сохранение..." : t("clients.form.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
