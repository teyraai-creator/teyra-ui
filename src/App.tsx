import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./Home";
import Auth from "./Auth";
import LanguageScreen from "./pages/LanguageScreen";
import ResetPassword from "./pages/ResetPassword";
import { supabase } from "./lib/supabase";

// Экран загрузки
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004AAD] to-[#0099FF]">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl text-white">
        Loading…
      </div>
    </div>
  );
}

/**
 * RootRedirect — проверка порядка:
 * 1) hash с type=recovery -> /reset + hash
 * 2) язык
 * 3) сессия -> /home или /auth
 */
function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash || "";
    if (hash.includes("type=recovery")) {
      navigate("/reset" + hash, { replace: true });
      return;
    }

    const savedLang = localStorage.getItem("teyra_lang");
    if (!savedLang) {
      navigate("/language", { replace: true });
      return;
    }

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        navigate("/home", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
    })();
  }, [navigate]);

  return <LoadingScreen />;
}

export default function App() {
  // ВНИМАНИЕ: тут БЕЗ <BrowserRouter/>. Он должен быть только в main.tsx.
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/language" element={<LanguageScreen />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/home" element={<Home />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}