import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LanguageScreen from "./pages/LanguageScreen";
import Auth from "./Auth";
import Home from "./Home";
import Clients from "./pages/Clients"; // ← ВАЖНО: правильный путь
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import Disk from "./pages/Disk";
import ResetPassword from "./pages/ResetPassword";
import { supabase } from "./lib/supabase";
import { applyLangFromStorage } from "./i18n";

/** Ловим сценарии письма восстановления пароля и ведём на /reset */
function AuthWatcher() {
  const navigate = useNavigate();

  useEffect(() => {
    // Если Supabase прислал на корень с #...type=recovery
    const hash = window.location.hash?.replace(/^#/, "");
    if (hash) {
      const params = new URLSearchParams(hash);
      if (params.get("type") === "recovery") {
        navigate("/reset", { replace: true });
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/reset", { replace: true });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return null;
}

/** Умный редирект из "/" */
function RootRedirect() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // На всякий случай синхронизируем язык при первом заходе
    applyLangFromStorage();
    (async () => {
      // 1) язык выбран?
      const lang = localStorage.getItem("teyra_lang");
      if (!lang) {
        navigate("/language", { replace: true });
        setReady(true);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/home", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
      setReady(true);
    })();
  }, [navigate]);

  return ready ? null : null;
}

export default function App() {
  return (
    <>
      <AuthWatcher />

      <Routes>
        {/* 0. Корень — авто-редирект */}
        <Route path="/" element={<RootRedirect />} />

        {/* 1. Выбор языка */}
        <Route path="/language" element={<LanguageScreen />} />

        {/* 2. Аутентификация */}
        <Route path="/auth" element={<Auth />} />

        {/* 3. Смена пароля */}
        <Route path="/reset" element={<ResetPassword />} />

        {/* 4. Главная (Dashboard) */}
        <Route path="/home" element={<Home />} />

        {/* 5. Профиль */}
        <Route path="/profile" element={<Profile />} />

        {/* 6. Клиенты */}
        <Route path="/clients" element={<Clients />} />

        {/* 7. Календарь */}
        <Route path="/calendar" element={<Calendar />} />

        {/* 8. Диск */}
        <Route path="/disk" element={<Disk />} />

        {/* 9. Фолбэк */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}