import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { applyLangFromStorage } from "../i18n";
import Menu from "../components/Menu";
import NewsFeed from "../components/NewsFeed";
import AIAssistant from "../components/AIAssistant";

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: Date;
  shared?: boolean;
}

export default function Disk() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  // Принудительно применяем язык при загрузке компонента
  useEffect(() => {
    applyLangFromStorage();
  }, []);

  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Загруженные файлы',
      type: 'folder',
      modified: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Маркетинг продажи',
      type: 'folder',
      modified: new Date('2024-01-14'),
      shared: true,
    },
    {
      id: '3',
      name: 'Маркетинг с Лид М...',
      type: 'folder',
      modified: new Date('2024-01-13'),
      shared: true,
    },
    {
      id: '4',
      name: 'Поддержка Битри...',
      type: 'folder',
      modified: new Date('2024-01-12'),
      shared: true,
    },
    {
      id: '5',
      name: 'Созданные файлы',
      type: 'folder',
      modified: new Date('2024-01-11'),
    },
    {
      id: '6',
      name: 'Сохраненные файлы',
      type: 'folder',
      modified: new Date('2024-01-10'),
    },
    {
      id: '7',
      name: 'Отдел продаж',
      type: 'folder',
      modified: new Date('2024-01-09'),
      shared: true,
    },
    {
      id: '8',
      name: 'Стратегическое ра...',
      type: 'folder',
      modified: new Date('2024-01-08'),
      shared: true,
    },
    {
      id: '9',
      name: 'Внутренняя логист...',
      type: 'folder',
      modified: new Date('2024-01-07'),
      shared: true,
    },
    {
      id: '10',
      name: 'ВсеИнструменты....',
      type: 'folder',
      modified: new Date('2024-01-06'),
      shared: true,
    },
    {
      id: '11',
      name: 'Сервисный центр ...',
      type: 'folder',
      modified: new Date('2024-01-05'),
      shared: true,
    },
    {
      id: '12',
      name: 'Финансы, бухгалт...',
      type: 'folder',
      modified: new Date('2024-01-04'),
      shared: true,
    },
    {
      id: '13',
      name: 'HR внедрение',
      type: 'folder',
      modified: new Date('2024-01-03'),
      shared: true,
    },
    {
      id: '14',
      name: 'Техническая докумен...',
      type: 'folder',
      modified: new Date('2024-01-02'),
    },
    {
      id: '15',
      name: 'Открытие сервисн...',
      type: 'folder',
      modified: new Date('2024-01-01'),
      shared: true,
    },
    {
      id: '16',
      name: 'Кадры - Human Re...',
      type: 'folder',
      modified: new Date('2023-12-31'),
      shared: true,
    },
  ]);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Add button clicked, current state:', showAddMenu);
    setShowAddMenu(!showAddMenu);
  };

  const handleSubmenuToggle = (item: string) => {
    setShowSubmenu(showSubmenu === item ? null : item);
  };

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(fileId);
  };

  const handleContextAction = (action: string, fileId: string) => {
    console.log(`Action: ${action} for file: ${fileId}`);
    setShowContextMenu(null);
  };

  const handleFileUpload = () => {
    setShowAddMenu(false);
    setShowFileUpload(true);
    fileInputRef.current?.click();
  };

  const handleCreateFolder = () => {
    setShowAddMenu(false);
    setShowCreateFolder(true);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Здесь можно добавить логику загрузки файлов
      console.log('Files to upload:', files);
      // Добавляем файлы в список
      const newFiles: FileItem[] = Array.from(files).map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        name: file.name,
        type: 'file' as const,
        size: file.size,
        modified: new Date(),
      }));
      setFiles(prev => [...newFiles, ...prev]);
    }
    setShowFileUpload(false);
  };

  const handleCreateFolderSubmit = () => {
    if (newFolderName.trim()) {
      const newFolder: FileItem = {
        id: `folder-${Date.now()}`,
        name: newFolderName.trim(),
        type: 'folder',
        modified: new Date(),
      };
      setFiles(prev => [newFolder, ...prev]);
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const handleGoogleDocsAction = (type: string) => {
    console.log(`Creating Google ${type}`);
    setShowAddMenu(false);
    setShowSubmenu(null);
    // Здесь можно добавить логику создания Google Docs
    return "";
  };

  // Закрываем контекстное меню при клике вне его
  useEffect(() => {
    const handleClickOutside = () => {
      setShowContextMenu(null);
      setShowAddMenu(false);
      setShowSubmenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Закрываем модальные окна при нажатии Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCreateFolder(false);
        setShowFileUpload(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="disk">
      <style>{`
        .disk {
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
          grid-template-rows: auto auto auto;
          gap: 16px;
          align-content: start;
        }
        .right > * { align-self: start; }

        /* Топ-бар */
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

        /* Поиск */
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

        /* Контент */
        .content {
          border-radius: 20px;
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.16);
          box-shadow: 0 12px 28px rgba(0,0,0,.22);
          padding: 24px;
        }

        /* Заголовок страницы */
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: white;
        }

        /* Кнопка добавления */
        .add-button {
          background: rgba(255,255,255,0.15);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }
        .add-button:hover {
          background: rgba(255,255,255,0.25);
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-1px);
        }

        /* Выпадающее меню */
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          padding: 8px 0;
          min-width: 200px;
          z-index: 1000;
        }
        .dropdown-item {
          padding: 12px 16px;
          cursor: pointer;
          color: #333;
          font-size: 14px;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dropdown-item:hover {
          background: #f5f5f5;
        }
        .dropdown-item.has-submenu::after {
          content: '▶';
          font-size: 10px;
          color: #666;
        }

        /* Подменю */
        .submenu {
          position: absolute;
          top: 0;
          left: 100%;
          background: white;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          padding: 8px 0;
          min-width: 180px;
          z-index: 1001;
        }

        /* Панель инструментов */
        .toolbar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .search-bar {
          flex: 1;
          max-width: 300px;
        }
        .search-bar input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 20px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 14px;
        }
        .search-bar input::placeholder {
          color: rgba(255,255,255,0.7);
        }
        .toolbar-text {
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          white-space: nowrap;
        }
        .trash-button {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 6px;
          background: rgba(255,255,255,0.1);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-size: 16px;
        }
        .trash-button:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.1);
        }
        .sort-dropdown {
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 20px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 14px;
        }
        .view-toggle {
          display: flex;
          gap: 4px;
        }
        .view-button {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 6px;
          background: rgba(255,255,255,0.1);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .view-button:hover {
          background: rgba(255,255,255,0.2);
        }
        .view-button.active {
          background: rgba(255,255,255,0.3);
        }

        /* Сетка файлов */
        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 16px;
        }
        .file-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .file-item:hover {
          background: rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }
        .file-icon {
          width: 48px;
          height: 48px;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          font-size: 24px;
        }
        .file-name {
          font-size: 12px;
          text-align: center;
          color: white;
          word-break: break-word;
          line-height: 1.3;
        }
        .shared-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 16px;
          height: 16px;
          background: #4CAF50;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: white;
        }
        .file-menu {
          position: absolute;
          top: 4px;
          left: 4px;
          width: 20px;
          height: 20px;
          background: rgba(0,0,0,0.3);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .file-item:hover .file-menu {
          opacity: 1;
        }
        .file-menu::before {
          content: '⋮';
          color: white;
          font-size: 14px;
          transform: rotate(90deg);
        }

        /* Контекстное меню */
        .context-menu {
          position: fixed;
          background: white;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          padding: 8px 0;
          min-width: 160px;
          z-index: 1002;
        }
        .context-menu-item {
          padding: 12px 16px;
          cursor: pointer;
          color: #333;
          font-size: 14px;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .context-menu-item:hover {
          background: #f5f5f5;
        }
        .context-menu-item.danger {
          color: #d32f2f;
        }
        .context-menu-item.danger:hover {
          background: #ffebee;
        }

        /* Модальное окно */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1003;
        }
        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 24px;
          min-width: 300px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .modal-content h3 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }
        .modal-content input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 16px;
          box-sizing: border-box;
        }
        .modal-content input:focus {
          outline: none;
          border-color: #0099FF;
          box-shadow: 0 0 0 3px rgba(0, 153, 255, 0.1);
        }
        .modal-buttons {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .modal-buttons button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .modal-buttons button:first-child {
          background: #f5f5f5;
          color: #666;
        }
        .modal-buttons button:first-child:hover {
          background: #e0e0e0;
        }
        .modal-buttons button:last-child {
          background: #0099FF;
          color: white;
        }
        .modal-buttons button:last-child:hover:not(:disabled) {
          background: #007acc;
        }
        .modal-buttons button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        /* Информационная панель */
        .info-panel {
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 12px;
          margin-top: 16px;
          font-size: 14px;
          color: rgba(255,255,255,0.8);
        }

        /* Футер */
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
          .disk { grid-template-columns: 1fr; }
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

        <div className="content">
          {/* Заголовок страницы */}
          <div className="page-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h1 className="page-title">Мой Диск</h1>
              <div style={{ position: 'relative' }}>
                <button className="add-button" onClick={handleAddClick}>
                  + Добавить
                </button>
              
              {showAddMenu && (
                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleFileUpload(); }}>
                    📄 Файл
                  </div>
                  <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleCreateFolder(); }}>
                    📁 Папка
                  </div>
                  <div className="dropdown-item" onClick={(e) => e.stopPropagation()}>📋 Доска</div>
                  <div 
                    className="dropdown-item has-submenu"
                    onMouseEnter={() => handleSubmenuToggle('bitrix')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    📄 Битрикс24.Docs
                  </div>
                  <div 
                    className="dropdown-item has-submenu"
                    onMouseEnter={() => handleSubmenuToggle('google')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    📄 Google Docs
                  </div>
                  <div 
                    className="dropdown-item has-submenu"
                    onMouseEnter={() => handleSubmenuToggle('office')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    📄 MS Office Online
                  </div>
                  <div 
                    className="dropdown-item has-submenu"
                    onMouseEnter={() => handleSubmenuToggle('office365')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    📄 Office365
                  </div>
                  <div 
                    className="dropdown-item has-submenu"
                    onMouseEnter={() => handleSubmenuToggle('programs')}
                    onClick={(e) => e.stopPropagation()}
                  >
                    💻 Программы на компьютере
                  </div>
                  
                  {/* Подменю для Google Docs */}
                  {showSubmenu === 'google' && (
                    <div className="submenu" onClick={(e) => e.stopPropagation()}>
                      <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleGoogleDocsAction('Документ'); }}>
                        📄 Документ
                      </div>
                      <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleGoogleDocsAction('Таблица'); }}>
                        📊 Таблица
                      </div>
                      <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleGoogleDocsAction('Презентация'); }}>
                        📽️ Презентация
                      </div>
                    </div>
                  )}
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Панель инструментов */}
          <div className="toolbar">
            <div className="search-bar">
              <input type="text" placeholder="Фильтр + поиск" />
            </div>
            <div className="toolbar-text">
              Файлы в корзине хранятся 30 дней после удаления
            </div>
            <button className="trash-button" title="Корзина">
              🗑️
            </button>
            <select className="sort-dropdown">
              <option>По дате изменения</option>
              <option>По имени</option>
              <option>По размеру</option>
            </select>
            <div className="view-toggle">
              <button className="view-button active">☰</button>
              <button className="view-button">⊞</button>
            </div>
          </div>

          {/* Сетка файлов */}
          <div className="files-grid">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="file-item"
                onContextMenu={(e) => handleContextMenu(e, file.id)}
              >
                <div 
                  className="file-menu"
                  onClick={(e) => handleContextMenu(e, file.id)}
                ></div>
                {file.shared && <div className="shared-badge">👥</div>}
                <div className="file-icon">
                  {file.type === 'folder' ? '📁' : '📄'}
                </div>
                <div className="file-name">{file.name}</div>
              </div>
            ))}
          </div>

          {/* Контекстное меню */}
          {showContextMenu && (
            <div 
              className="context-menu"
              style={{
                left: contextMenuPosition.x,
                top: contextMenuPosition.y,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="context-menu-item"
                onClick={() => handleContextAction('open', showContextMenu)}
              >
                📂 Открыть
              </div>
              <div 
                className="context-menu-item"
                onClick={() => handleContextAction('download', showContextMenu)}
              >
                ⬇️ Скачать
              </div>
              <div 
                className="context-menu-item"
                onClick={() => handleContextAction('rename', showContextMenu)}
              >
                ✏️ Переименовать
              </div>
              <div 
                className="context-menu-item"
                onClick={() => handleContextAction('move', showContextMenu)}
              >
                📁 Переместить
              </div>
              <div 
                className="context-menu-item danger"
                onClick={() => handleContextAction('delete', showContextMenu)}
              >
                🗑️ Удалить
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="footer">{t("footer.copyright")}</div>

      {/* Скрытый input для загрузки файлов */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        accept="*/*"
      />

      {/* Модальное окно для создания папки */}
      {showCreateFolder && (
        <div className="modal-overlay" onClick={() => setShowCreateFolder(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Создать новую папку</h3>
            <input
              type="text"
              placeholder="Введите название папки"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolderSubmit()}
              autoFocus
            />
            <div className="modal-buttons">
              <button onClick={() => setShowCreateFolder(false)}>Отмена</button>
              <button onClick={handleCreateFolderSubmit} disabled={!newFolderName.trim()}>
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI-ассистент в правом нижнем углу */}
      <AIAssistant />
    </div>
  );
}
