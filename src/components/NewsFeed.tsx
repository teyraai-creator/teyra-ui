// src/components/NewsFeed.tsx
import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Блок "Новости" для узкой левой колонки.
 * Что изменено:
 * - Убрана внутренняя "стеклянная" подкладка (оставляем только карточку секции).
 * - В заголовке теперь двоеточие "Новости:".
 * - Каждый пункт — ОДНА колонка: сверху заголовок, ниже строка источника/даты.
 * Стили локальные, чтобы не ломать остальное.
 */

type Item = {
  id: string;
  title: string;
  source: string; // например: "TACC Наука · 21h"
  href: string;
};

const demo: Item[] = [
  {
    id: "1",
    title:
      "Исследование: осознанность снижает уровень стресса у специалистов помогающих профессий",
    source: "TACC Наука · 21h",
    href: "#",
  },
  {
    id: "2",
    title: "Психологические техники для профилактики выгорания",
    source: "PsyJournals · 1d",
    href: "#",
  },
  {
    id: "3",
    title: "Как вести заметки по сессиям: практика и этика",
    source: "ПостНаука · 2d",
    href: "#",
  },
];

export default function NewsFeed({
  items = demo,
}: {
  items?: Item[];
}): JSX.Element {
  const { t } = useTranslation();
  return (
    <aside className="nf">
      <style>{`
        .nf { 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
        }
        .nf h3 {
          margin: 0 0 6px 0;
          font-weight: 700;
          font-size: 18px;
          letter-spacing: .2px;
        }
        .nf .list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .nf .item {
          border-radius: 16px;
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.16);
          box-shadow: 0 6px 18px rgba(0,0,0,.18);
          padding: 14px 16px;
        }
        .nf .item a {
          color: #fff;
          text-decoration: none;
          display: block;
        }
        .nf .title {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.25;
          margin: 0 0 8px 0;
        }
        .nf .meta {
          opacity: .8;
          font-size: 13px;
        }
        .nf .item:hover {
          background: rgba(255,255,255,.14);
          border-color: rgba(255,255,255,.22);
        }
      `}</style>

      <h3>{t("news.title")}:</h3>

      <div className="list">
        {items.map((n) => (
          <div key={n.id} className="item">
            <a href={n.href} target="_blank" rel="noreferrer">
              <div className="title">{n.title}</div>
              <div className="meta">{n.source}</div>
            </a>
          </div>
        ))}
      </div>
    </aside>
  );
}