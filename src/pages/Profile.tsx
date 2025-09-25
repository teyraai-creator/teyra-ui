// src/pages/Profile.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import { profileService, type UserProfile } from "../lib/database";
import { applyLangFromStorage } from "../i18n";
import Menu from "../components/Menu";
import NewsFeed from "../components/NewsFeed";
import AIAssistant from "../components/AIAssistant";

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Принудительно применяем язык при загрузке компонента
  useEffect(() => {
    applyLangFromStorage();
  }, []);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");

  // Загружаем данные пользователя и профиль
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          console.log('Loading profile for user:', user.id);
          // Загружаем профиль из базы данных
          const userProfile = await profileService.getProfile(user.id);
          console.log('Loaded profile:', userProfile);
          
          if (userProfile) {
            setProfile(userProfile);
            setFullName(userProfile.full_name || "");
            setOrgName(userProfile.org_name || "");
          } else {
            console.log('No profile found, creating new one');
            // Создаем новый профиль, если его нет
            const newProfile = await profileService.upsertProfile(user.id, {
              full_name: user.user_metadata?.full_name || "",
              org_name: user.user_metadata?.org_name || ""
            });
            console.log('Created new profile:', newProfile);
            if (newProfile) {
              setProfile(newProfile);
              setFullName(newProfile.full_name || "");
              setOrgName(newProfile.org_name || "");
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/language");
  };

  // Сохранение профиля
  const saveProfile = async () => {
    if (!user || saving) return;
    
    setSaving(true);
    try {
      console.log('Saving profile for user:', user.id);
      console.log('Profile data:', { full_name: fullName, org_name: orgName });
      
              const updatedProfile = await profileService.upsertProfile(user.id, {
                full_name: fullName,
                org_name: orgName
              });
      
      console.log('Updated profile result:', updatedProfile);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        alert("Профиль сохранен!");
      } else {
        alert("Ошибка: профиль не был сохранен");
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert("Ошибка при сохранении профиля: " + error.message);
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="clients">
      <style>{`
        .clients {
          min-height: 100vh;
          background: linear-gradient(135deg,#004AAD 0%,#0099FF 100%);
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 20px;
          padding: 24px;
          color: #fff;
        }

        /* Левая колонка */
        .left { display: flex; flex-direction: column; gap: 16px; }
        .card {
          border-radius: 20px;
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.16);
          box-shadow: 0 12px 28px rgba(0,0,0,.22);
          padding: 12px;
        }
        .menu-title { font-weight: 700; margin: 4px 8px 10px; opacity: .95; }
        .mitem {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 14px; cursor: pointer; user-select: none;
          transition: background .15s ease, box-shadow .15s ease, border-color .15s ease;
          border: 1px solid transparent;
        }
        .mitem:hover { background: rgba(255,255,255,.12); }
        .mitem.active {
          background: rgba(255,255,255,.18);
          border-color: rgba(255,255,255,.28);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.12);
        }
        .micon { width: 24px; height: 24px; display:flex; align-items:center; justify-content:center; }
        .micon svg { width: 18px; height: 18px; fill: #fff; opacity: .95; }

        /* Правая колонка */
        .right {
          display: grid;
          grid-template-rows: auto auto;
          gap: 16px;
          align-content: start;
        }
        .right > * { align-self: start; }

        /* Топ-бар — компактный, логотип крупный */
        .topbar {
          border-radius: 20px;
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.16);
          box-shadow: 0 12px 28px rgba(0,0,0,.22);
          padding: 2px 6px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 8px;
        }
        .brand { display:flex; align-items:center; gap:10px; }
        .brand img { height: 60px; width: auto; filter: drop-shadow(0 10px 24px rgba(0,0,0,.25)); }

        /* Поиск тянется до двух кружков */
        .search { display:flex; align-items:center; }
        .search input {
          width: calc(100% - 80px);
          max-width: 1100px;
          min-width: 360px;
          border: 0; outline: none;
          color: #1e1e1e;
          background: #fff;
          border-radius: 999px;
          padding: 10px 14px;
        }

        .tops { display:flex; align-items:center; gap:10px; margin-left: 8px; }
        .dot {
          width: 36px; height: 36px; border-radius: 999px;
          background: rgba(255,255,255,.18);
          border: 1px solid rgba(255,255,255,.22);
          box-shadow: 0 8px 20px rgba(0,0,0,.20) inset;
        }

        /* Блок профиля */
        .profile-card {
          border-radius: 20px;
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.16);
          box-shadow: 0 12px 28px rgba(0,0,0,.22);
          padding: 24px;
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255,255,255,.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
          cursor: pointer;
          position: relative;
          transition: all .2s ease;
        }
        .profile-avatar:hover {
          background: rgba(255,255,255,.3);
          transform: scale(1.05);
        }
        .avatar-upload {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #4CAF50;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
        }
        .profile-info h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .profile-email {
          opacity: 0.8;
          font-size: 14px;
        }
        .profile-form {
          display: grid;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-label {
          font-weight: 600;
          opacity: 0.9;
        }
        .form-input {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.3);
          background: rgba(255,255,255,.1);
          color: #fff;
          font-size: 16px;
        }
        .form-input::placeholder {
          color: rgba(255,255,255,.6);
        }
        .form-input:focus {
          outline: none;
          border-color: rgba(255,255,255,.5);
          background: rgba(255,255,255,.15);
        }
        .plan-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          background: rgba(0,255,150,.2);
          border: 1px solid rgba(0,255,150,.3);
          color: #00ff96;
          font-weight: 600;
          font-size: 14px;
        }
        .signout-btn {
          margin: 24px auto 0;
          padding: 10px 20px;
          border-radius: 20px;
          border: none;
          background: #ff4444;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s ease;
          box-shadow: 0 4px 12px rgba(255,68,68,.3);
          width: fit-content;
          display: block;
        }
        .signout-btn:hover {
          background: #ff3333;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255,68,68,.4);
        }

        /* Футер — чуть выше экрана */
        .footer {
          grid-column: 1 / -1;
          text-align: center;
          opacity: .95;
          font-size: 14px;
          margin-top: 8px;
          margin-bottom: 14px;
        }

        @media (max-width: 1100px) {
          .brand img   { height: 48px; }
          .search input{ width: 100%; max-width: 100%; min-width: 0; }
          .topbar      { grid-template-columns: auto 1fr; }
          .tops        { display:none; }
        }
        @media (max-width: 1024px) {
          .clients { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Левая колонка */}
      <div className="left">
        <Menu />
        <div className="card">
          <NewsFeed />
        </div>
      </div>

      {/* Правая колонка */}
      <div className="right">
        <div className="topbar">
          <div className="brand">
            <img src="/teyra-logo.png" alt="TEYRA" />
          </div>

          <div className="search">
                    <input type="text" placeholder={t("search.placeholder")} />
          </div>

          <div className="tops">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>

        {/* Блок профиля */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="profile-info">
                        <h2>{t("profile.title")}</h2>
              <div className="profile-email">
                {loading ? t("profile.loading") : user?.email || t("profile.notAuthorized")}
              </div>
            </div>
          </div>


          <div className="profile-form">
            <div className="form-group">
                          <label className="form-label">{t("profile.fullName")}</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Введите ваше полное имя"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Название организации</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Введите название организации"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>

            <div className="form-group">
                          <label className="form-label">{t("profile.plan")}</label>
              <div className="plan-badge">
                <span>⭐</span>
                <span>Базовый план</span>
            </div>
          </div>

          <button 
            className="save-btn" 
            onClick={saveProfile}
            disabled={saving}
            style={{
              margin: "16px auto 0",
              padding: "10px 20px",
              borderRadius: "20px",
              border: "none",
              background: "#4CAF50",
              color: "white",
              fontWeight: "600",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              width: "fit-content",
              display: "block"
            }}
          >
            {saving ? "Сохранение..." : "Сохранить профиль"}
          </button>

          <button className="signout-btn" onClick={handleSignOut}>
            {t("profile.signOut")}
          </button>
          </div>
        </div>
      </div>

      <div className="footer">{t("footer.copyright")}</div>

      {/* AI-ассистент в правом нижнем углу */}
      <AIAssistant />
    </div>
  );
}
