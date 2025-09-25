import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Menu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const go = (path: string) => () => navigate(path);
  const isActive = (path: string) => pathname === path;

  return (
    <div className="card">
      <div className="menu-title">{t("menu.title")}</div>

      <div className={`mitem ${isActive("/home") ? "active" : ""}`} onClick={go("/home")}>
        <div className="micon"><svg viewBox="0 0 24 24"><path d="M12 3l9 8h-3v10h-5V15H11v6H6V11H3z"/></svg></div>
        <div>{t("menu.home")}</div>
      </div>

      <div className={`mitem ${isActive("/profile") ? "active" : ""}`} onClick={go("/profile")}>
        <div className="micon"><svg viewBox="0 0 24 24"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/></svg></div>
        <div>{t("menu.profile")}</div>
      </div>

      <div className={`mitem ${isActive("/clients") ? "active" : ""}`} onClick={go("/clients")}>
        <div className="micon"><svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/></svg></div>
        <div>{t("menu.clients")}</div>
      </div>

      <div className={`mitem ${isActive("/calendar") ? "active" : ""}`} onClick={go("/calendar")}>
        <div className="micon"><svg viewBox="0 0 24 24"><path d="M7 10h5v5H7zM5 2h2v2h10V2h2v2h2v18H3V4h2zm0 6v12h14V8H5z"/></svg></div>
        <div>{t("menu.calendar")}</div>
      </div>

      <div className={`mitem ${isActive("/notes") ? "active" : ""}`} onClick={go("/notes")}>
        <div className="micon"><svg viewBox="0 0 24 24"><path d="M3 3h18v14H8l-5 5z"/></svg></div>
        <div>{t("menu.notes")}</div>
      </div>

      <div className={`mitem ${isActive("/reports") ? "active" : ""}`} onClick={go("/reports")}>
        <div className="micon"><svg viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h14v-2H7v2zm0-4h14v-2H7v2zm0-6v2h14V7H7z"/></svg></div>
        <div>{t("menu.reports")}</div>
      </div>

      <div className={`mitem ${isActive("/disk") ? "active" : ""}`} onClick={go("/disk")}>
        <div className="micon"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
        <div>{t("menu.disk")}</div>
      </div>

      <div className={`mitem ${isActive("/settings") ? "active" : ""}`} onClick={go("/settings")}>
        <div className="micon"><svg viewBox="0 0 24 24"><path d="M19.14 12.94a7.43 7.43 0 000-1.88l2.03-1.58-1.92-3.32-2.39.96a7.6 7.6 0 00-1.63-.95l-.36-2.54h-3.84l-.36 2.54a7.6 7.6 0 00-1.63.95l-2.39-.96L2.83 9.48l2.03 1.58a7.43 7.43 0 000 1.88L2.83 14.6l1.92 3.32 2.39-.96c.5.38 1.04.69 1.63.95l.36 2.54h3.84l.36-2.54c.59-.26 1.13-.57 1.63-.95l2.39.96 1.92-3.32-2.03-1.66zM12 15.5A3.5 3.5 0 1115.5 12 3.5 3.5 0 0112 15.5z"/></svg></div>
        <div>{t("menu.settings")}</div>
      </div>
    </div>
  );
}
