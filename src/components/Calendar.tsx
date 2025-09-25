// src/components/Calendar.tsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import { clientService, type Client } from "../lib/database";

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  client_id?: string;
  client_name?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  created_at: string;
}

interface CalendarProps {
  clients: Client[];
}

export default function Calendar({ clients }: CalendarProps) {
  const { t } = useTranslation();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const calendarBodyRef = useRef<HTMLDivElement>(null);

  // Автоматическая прокрутка к 8:00 при загрузке
  useEffect(() => {
    try {
      if (calendarBodyRef.current) {
        // Находим позицию 8:00 (7-й слот, так как начинаем с 01:00)
        const scrollToHour = 7; // 8:00 - это 7-й слот (01:00, 02:00, ..., 08:00)
        const slotHeight = 60; // высота одного слота
        const scrollPosition = scrollToHour * slotHeight;
        
        // Прокручиваем к 8:00 с небольшим отступом сверху
        calendarBodyRef.current.scrollTop = scrollPosition - 100;
      }
    } catch (err) {
      console.error('Error scrolling calendar:', err);
      setError('Ошибка при прокрутке календаря');
    }
  }, [currentWeek]); // Перепрокручиваем при смене недели

  // Генерируем дни недели
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Понедельник
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Генерируем временные слоты с 01:00 до 24:00
  const timeSlots = [];
  for (let hour = 1; hour < 24; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  // Получаем номер недели
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Навигация по неделям
  const goToPreviousWeek = () => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  const goToNextWeek = () => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  // Обработка клика по временному слоту
  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedSlot({ date, time });
    setShowEventForm(true);
  };

  // Получаем события для конкретного дня и времени
  const getEventsForSlot = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = event.start_time.split('T')[0];
      const eventTime = event.start_time.split('T')[1].substring(0, 5);
      return eventDate === dateStr && eventTime === time;
    });
  };

  // Определяем CSS класс для временного слота
  const getTimeSlotClass = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    const now = new Date();
    const currentHour = now.getHours();
    const currentDate = now.toDateString();
    
    let className = '';
    
    // Проверяем, является ли это текущим временем
    if (hour === currentHour) {
      className += ' current-time';
    }
    
    // Добавляем классы для разных периодов дня
    if (hour >= 1 && hour < 6) {
      className += ' early-morning';
    } else if (hour >= 6 && hour < 18) {
      className += ' working-hours';
    } else if (hour >= 18 && hour < 24) {
      className += ' evening';
    }
    
    return className.trim();
  };

  // Обработка ошибок
  if (error) {
    return (
      <div className="calendar-error">
        <style>{`
          .calendar-error {
            background: rgba(255,255,255,.10);
            border: 1px solid rgba(255,255,255,.16);
            border-radius: 20px;
            padding: 24px;
            color: white;
            text-align: center;
          }
        `}</style>
        <h3>Ошибка загрузки календаря</h3>
        <p>{error}</p>
        <button onClick={() => setError(null)} style={{
          padding: '10px 20px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,.3)',
          background: 'rgba(255,255,255,.1)',
          color: 'white',
          cursor: 'pointer'
        }}>
          Попробовать снова
        </button>
      </div>
    );
  }

  try {
    const weekDays = getWeekDays(currentWeek);
    const monthNames = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];
    const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    return (
    <div className="calendar">
      <style>{`
        .calendar {
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 12px 28px rgba(0,0,0,.22);
          color: white;
        }
        
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,.2);
        }
        
        .calendar-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }
        
        .week-navigation {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .nav-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.3);
          background: rgba(255,255,255,.1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all .2s ease;
        }
        
        .nav-button:hover {
          background: rgba(255,255,255,.2);
          transform: scale(1.05);
        }
        
        .today-btn {
          background: rgba(76, 175, 80, 0.3);
          border-color: rgba(76, 175, 80, 0.5);
        }
        
        .today-btn:hover {
          background: rgba(76, 175, 80, 0.4);
        }
        
        .calendar-grid {
          display: grid;
          grid-template-columns: 80px repeat(7, 1fr);
          gap: 1px;
          background: rgba(255,255,255,.1);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .time-column {
          background: rgba(255,255,255,.15);
          padding: 8px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,.2);
        }
        
        .day-header {
          background: rgba(255,255,255,.2);
          padding: 12px 8px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
        }
        
        .time-slot {
          height: 60px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          position: relative;
          cursor: pointer;
          transition: all .2s ease;
        }
        
        .time-slot:hover {
          background: rgba(255,255,255,.1);
        }
        
        .time-slot.current-time {
          background: rgba(76, 175, 80, 0.2);
          border-color: rgba(76, 175, 80, 0.4);
        }
        
        .time-slot.early-morning {
          background: rgba(33, 150, 243, 0.1);
        }
        
        .time-slot.working-hours {
          background: rgba(255, 193, 7, 0.1);
        }
        
        .time-slot.evening {
          background: rgba(156, 39, 176, 0.1);
        }
        
        .time-slot:hover::after {
          content: '+';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 20px;
          font-weight: bold;
          color: #4CAF50;
          opacity: 0.8;
        }
        
        .event {
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
          background: #4CAF50;
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 10px;
          font-weight: 600;
          color: white;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .calendar-body {
          max-height: 600px;
          overflow-y: auto;
          border-radius: 12px;
        }
        
        .calendar-body::-webkit-scrollbar {
          width: 8px;
        }
        
        .calendar-body::-webkit-scrollbar-track {
          background: rgba(255,255,255,.1);
          border-radius: 4px;
        }
        
        .calendar-body::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,.3);
          border-radius: 4px;
        }
        
        .calendar-body::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,.5);
        }
      `}</style>

      {/* Заголовок календаря */}
      <div className="calendar-header">
        <div>
          <h2 className="calendar-title">
            {monthNames[currentWeek.getMonth()]} {currentWeek.getFullYear()}
          </h2>
          <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
            Неделя {getWeekNumber(currentWeek)}
          </div>
        </div>
        
        <div className="week-navigation">
          <button className="nav-button" onClick={goToPreviousWeek}>
            ←
          </button>
          <button className="nav-button today-btn" onClick={goToToday} title="Сегодня">
            📅
          </button>
          <button className="nav-button" onClick={goToNextWeek}>
            →
          </button>
        </div>
      </div>

      {/* Календарная сетка */}
      <div className="calendar-body" ref={calendarBodyRef}>
        <div className="calendar-grid">
          {/* Заголовки дней недели */}
          <div className="time-column"></div>
          {dayNames.map((day, index) => (
            <div key={index} className="day-header">
              <div>{day}</div>
              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>
                {weekDays[index].getDate()}
              </div>
            </div>
          ))}

          {/* Временные слоты */}
          {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={time}>
              <div className="time-column">{time}</div>
              {weekDays.map((date, dayIndex) => {
                const slotEvents = getEventsForSlot(date, time);
                const timeSlotClass = getTimeSlotClass(time);
                return (
                  <div
                    key={`${dayIndex}-${timeIndex}`}
                    className={`time-slot ${timeSlotClass}`}
                    onClick={() => handleTimeSlotClick(date, time)}
                  >
                    {slotEvents.map((event) => (
                      <div key={event.id} className="event" title={event.title}>
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Форма добавления события */}
      {showEventForm && selectedSlot && (
        <EventForm
          selectedSlot={selectedSlot}
          clients={clients}
          onClose={() => {
            setShowEventForm(false);
            setSelectedSlot(null);
          }}
          onSave={(eventData) => {
            // TODO: Сохранение события
            console.log('Saving event:', eventData);
            setShowEventForm(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
  } catch (err) {
    console.error('Calendar render error:', err);
    return (
      <div className="calendar-error">
        <style>{`
          .calendar-error {
            background: rgba(255,255,255,.10);
            border: 1px solid rgba(255,255,255,.16);
            border-radius: 20px;
            padding: 24px;
            color: white;
            text-align: center;
          }
        `}</style>
        <h3>Ошибка отображения календаря</h3>
        <p>Произошла ошибка при загрузке календаря. Попробуйте обновить страницу.</p>
        <button onClick={() => window.location.reload()} style={{
          padding: '10px 20px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,.3)',
          background: 'rgba(255,255,255,.1)',
          color: 'white',
          cursor: 'pointer'
        }}>
          Обновить страницу
        </button>
      </div>
    );
  }
}

// Компонент формы добавления события
interface EventFormProps {
  selectedSlot: { date: Date; time: string };
  clients: Client[];
  onClose: () => void;
  onSave: (eventData: any) => void;
}

function EventForm({ selectedSlot, clients, onClose, onSave }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    start_time: selectedSlot.time,
    end_time: `${(parseInt(selectedSlot.time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
    client_id: '',
    is_recurring: false,
    recurrence_pattern: 'weekly'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave({
        ...formData,
        date: selectedSlot.date.toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="event-form-overlay">
      <style>{`
        .event-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .event-form {
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
        .form-input, .form-select {
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
        .form-input:focus, .form-select:focus {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.15);
        }
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
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
      `}</style>

      <div className="event-form">
        <div className="form-header">
          <h2 className="form-title">Добавить событие</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Название события *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Введите название события"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Время начала</label>
              <input
                type="time"
                className="form-input"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Время окончания</label>
              <input
                type="time"
                className="form-input"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Клиент</label>
            <select
              className="form-select"
              value={formData.client_id}
              onChange={(e) => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
            >
              <option value="">Выберите клиента</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.display_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.is_recurring}
                onChange={(e) => setFormData(prev => ({ ...prev, is_recurring: e.target.checked }))}
              />
              <label htmlFor="recurring" className="form-label" style={{ margin: 0 }}>
                Повторяющееся событие
              </label>
            </div>
          </div>

          {formData.is_recurring && (
            <div className="form-group">
              <label className="form-label">Повторять</label>
              <select
                className="form-select"
                value={formData.recurrence_pattern}
                onChange={(e) => setFormData(prev => ({ ...prev, recurrence_pattern: e.target.value }))}
              >
                <option value="daily">Ежедневно</option>
                <option value="weekly">Еженедельно</option>
                <option value="monthly">Ежемесячно</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
