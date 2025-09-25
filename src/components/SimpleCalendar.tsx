// src/components/SimpleCalendar.tsx
import React, { useState, useRef, useEffect } from "react";
import { type Client, calendarEventService } from "../lib/database";
import { supabase } from "../lib/supabase";

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  client_id?: string;
  client_name?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  created_at: string;
  color: string;
}

interface CalendarProps {
  clients: Client[];
}

export default function SimpleCalendar({ clients }: CalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const calendarBodyRef = useRef<HTMLDivElement>(null);

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
    setEditingEvent(null);
    setShowEventForm(true);
  };

  // Сохранение события
  const handleSaveEvent = async (eventData: any) => {
    console.log('Saving event:', eventData);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const eventToSave = {
        title: eventData.title,
        start_time: `${eventData.date}T${eventData.start_time}:00`,
        end_time: `${eventData.date}T${eventData.end_time}:00`,
        client_id: eventData.client_id,
        client_name: clients.find(c => c.id === eventData.client_id)?.display_name,
        is_recurring: eventData.is_recurring,
        recurrence_pattern: eventData.recurrence_pattern,
        recurrence_end_date: eventData.recurrence_end_date,
        color: eventData.color || editingEvent?.color || '#3b82f6'
      };

      if (editingEvent) {
        // Обновляем существующее событие
        console.log('Updating existing event:', eventToSave);
        const updatedEvent = await calendarEventService.updateEvent(editingEvent.id, eventToSave);
        if (updatedEvent) {
          const convertedEvent: CalendarEvent = {
            id: updatedEvent.id,
            title: updatedEvent.title,
            start_time: updatedEvent.start_time,
            end_time: updatedEvent.end_time,
            client_id: updatedEvent.client_id,
            client_name: updatedEvent.client_name,
            is_recurring: updatedEvent.is_recurring,
            recurrence_pattern: updatedEvent.recurrence_pattern,
            recurrence_end_date: updatedEvent.recurrence_end_date,
            created_at: updatedEvent.created_at,
            color: updatedEvent.color
          };
          setEvents(prev => prev.map(e => e.id === editingEvent.id ? convertedEvent : e));
        }
      } else {
        // Создаем новое событие
        console.log('Creating new event:', eventToSave);
        const createdEvent = await calendarEventService.createEvent(user.id, eventToSave);
        if (createdEvent) {
          const convertedEvent: CalendarEvent = {
            id: createdEvent.id,
            title: createdEvent.title,
            start_time: createdEvent.start_time,
            end_time: createdEvent.end_time,
            client_id: createdEvent.client_id,
            client_name: createdEvent.client_name,
            is_recurring: createdEvent.is_recurring,
            recurrence_pattern: createdEvent.recurrence_pattern,
            recurrence_end_date: createdEvent.recurrence_end_date,
            created_at: createdEvent.created_at,
            color: createdEvent.color
          };
          setEvents(prev => [...prev, convertedEvent]);
          
          // Если событие повторяющееся, создаем повторения
          if (eventData.is_recurring) {
            console.log('Creating recurring events...');
            await createRecurringEvents(convertedEvent, eventData);
          }
        }
      }
      
      console.log('Event saved successfully!');
      // Перезагружаем события из базы данных
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const dbEvents = await calendarEventService.getEvents(currentUser.id);
        const convertedEvents: CalendarEvent[] = dbEvents.map(event => ({
          id: event.id,
          title: event.title,
          start_time: event.start_time,
          end_time: event.end_time,
          client_id: event.client_id,
          client_name: event.client_name,
          is_recurring: event.is_recurring,
          recurrence_pattern: event.recurrence_pattern,
          recurrence_end_date: event.recurrence_end_date,
          created_at: event.created_at,
          color: event.color
        }));
        setEvents(convertedEvents);
        console.log('Reloaded events after save:', convertedEvents);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Ошибка при сохранении события: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  // Создание повторяющихся событий
  const createRecurringEvents = async (baseEvent: CalendarEvent, eventData: any) => {
    console.log('=== CREATING RECURRING EVENTS ===');
    console.log('Base event:', baseEvent);
    console.log('Event data:', eventData);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const startDate = new Date(eventData.date);
      const endDate = eventData.recurrence_end_date ? new Date(eventData.recurrence_end_date) : null;
      const pattern = eventData.recurrence_pattern;
      
      let currentDate = new Date(startDate);
      const recurringEvents: CalendarEvent[] = [];
      
      // Создаем события на 52 недели вперед (или до даты окончания)
      for (let i = 0; i < 52; i++) {
        if (endDate && currentDate > endDate) break;
        
        currentDate = new Date(startDate);
        
        switch (pattern) {
          case 'daily':
            currentDate.setDate(startDate.getDate() + i);
            break;
          case 'weekly':
            currentDate.setDate(startDate.getDate() + (i * 7));
            break;
          case 'monthly':
            currentDate.setMonth(startDate.getMonth() + i);
            break;
        }
        
        if (i > 0) { // Пропускаем первое событие (оно уже добавлено)
          const recurringEventData = {
            title: baseEvent.title,
            start_time: `${currentDate.toISOString().split('T')[0]}T${eventData.start_time}:00`,
            end_time: `${currentDate.toISOString().split('T')[0]}T${eventData.end_time}:00`,
            client_id: baseEvent.client_id,
            client_name: baseEvent.client_name,
            is_recurring: baseEvent.is_recurring,
            recurrence_pattern: baseEvent.recurrence_pattern,
            recurrence_end_date: baseEvent.recurrence_end_date,
            color: baseEvent.color,
          };
          
          console.log(`Creating recurring event ${i}:`, recurringEventData);
          
          // Сохраняем в базу данных
          const createdEvent = await calendarEventService.createEvent(user.id, recurringEventData);
          if (createdEvent) {
            const convertedEvent: CalendarEvent = {
              id: createdEvent.id,
              title: createdEvent.title,
              start_time: createdEvent.start_time,
              end_time: createdEvent.end_time,
              client_id: createdEvent.client_id,
              client_name: createdEvent.client_name,
              is_recurring: createdEvent.is_recurring,
              recurrence_pattern: createdEvent.recurrence_pattern,
              recurrence_end_date: createdEvent.recurrence_end_date,
              created_at: createdEvent.created_at,
              color: createdEvent.color
            };
            recurringEvents.push(convertedEvent);
          }
        }
      }
      
      console.log('All recurring events created:', recurringEvents);
      setEvents(prev => {
        const newEvents = [...prev, ...recurringEvents];
        console.log('Events after adding recurring:', newEvents);
        return newEvents;
      });
      console.log('=== END CREATING RECURRING EVENTS ===');
    } catch (error) {
      console.error('Error creating recurring events:', error);
    }
  };


  // Функция getEventPosition убрана - события теперь размещаются прямо в ячейках

  // Проверка, является ли событие прошедшим
  const isPastEvent = (event: CalendarEvent) => {
    const now = new Date();
    const eventEnd = new Date(event.end_time);
    return eventEnd < now;
  };

  // Функция получения позиции времени убрана для MVP

  // Удаление события
  const handleDeleteEvent = async (eventId: string, deleteType: 'single' | 'all' = 'single') => {
    console.log('=== DELETE EVENT DEBUG ===');
    console.log('Event ID to delete:', eventId);
    console.log('Delete type:', deleteType);
    console.log('Current events before deletion:', events);
    console.log('Event to delete details:', events.find(e => e.id === eventId));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      // Проверяем, является ли это повторяющимся событием
      const eventToDelete = events.find(e => e.id === eventId);
      const isRecurring = eventToDelete?.is_recurring;
      
      if (isRecurring && deleteType === 'all') {
        // Удаляем все повторяющиеся события
        const baseId = eventId.includes('_') ? eventId.split('_')[0] : eventId;
        console.log('Deleting ALL recurring events, base ID:', baseId);
        const success = await calendarEventService.deleteRecurringEvents(baseId);
        if (success) {
          setEvents(prev => {
            const filtered = prev.filter(e => {
              const eventBaseId = e.id.includes('_') ? e.id.split('_')[0] : e.id;
              return eventBaseId !== baseId;
            });
            console.log('Events after deletion:', filtered);
            return filtered;
          });
        }
      } else {
        // Удаляем только одно событие
        const success = await calendarEventService.deleteEvent(eventId);
        if (success) {
          setEvents(prev => {
            const filtered = prev.filter(e => e.id !== eventId);
            console.log('Events after deletion:', filtered);
            return filtered;
          });
        }
      }
      
      console.log('=== END DELETE DEBUG ===');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Автоматическая прокрутка к 8:00 при загрузке
  useEffect(() => {
    const timer = setTimeout(() => {
      if (calendarBodyRef.current) {
        const scrollToHour = 7; // 8:00 - это 7-й слот
        const slotHeight = 60;
        const scrollPosition = scrollToHour * slotHeight;
        calendarBodyRef.current.scrollTop = scrollPosition - 100;
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentWeek]);

  // Обновление времени каждую секунду
  useEffect(() => {
    // Устанавливаем текущее время сразу при загрузке
    setCurrentTime(new Date());
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Каждую секунду

    return () => clearInterval(interval);
  }, []);

  // Загрузка событий из базы данных
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const dbEvents = await calendarEventService.getEvents(user.id);
          // Конвертируем события из базы данных в формат компонента
          const convertedEvents: CalendarEvent[] = dbEvents.map(event => ({
            id: event.id,
            title: event.title,
            start_time: event.start_time,
            end_time: event.end_time,
            client_id: event.client_id,
            client_name: event.client_name,
            is_recurring: event.is_recurring,
            recurrence_pattern: event.recurrence_pattern,
            recurrence_end_date: event.recurrence_end_date,
            created_at: event.created_at,
            color: event.color
          }));
          setEvents(convertedEvents);
          console.log('Loaded events from database:', convertedEvents);
        }
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    loadEvents();
  }, []); // Загружаем события только при монтировании компонента

  const weekDays = getWeekDays(currentWeek);
  
  // Отладка дней недели
  console.log('Week days debug:', {
    currentWeek: currentWeek.toLocaleDateString(),
    weekDays: weekDays.map((day, index) => ({
      index,
      date: day.toLocaleDateString(),
      dayName: day.toLocaleDateString('ru-RU', { weekday: 'short' })
    }))
  });
  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];
  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  // Отладочная информация
  console.log('Current events count:', events.length);
  console.log('Current events:', events);

  return (
    <div className="simple-calendar">
      <style>{`
        .simple-calendar {
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
          width: auto;
          padding: 0 16px;
          font-size: 14px;
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
          border-radius: 8px;
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
          background: rgba(76, 175, 80, 0.8);
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 10px;
          font-weight: 600;
          color: white;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(2px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .event:hover {
          background: rgba(76, 175, 80, 0.95);
          transform: scale(1.05);
          z-index: 5;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }
        
        .event:active {
          transform: scale(0.98);
        }
        
        .event::after {
          content: '✏️';
          position: absolute;
          top: 1px;
          right: 1px;
          font-size: 8px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .event:hover::after {
          opacity: 1;
        }

        /* Стили для событий в ячейках времени */

        .event-block {
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
          border-radius: 6px;
          padding: 4px 6px;
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
          z-index: 5;
          overflow: hidden;
        }

        .event-block:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          z-index: 15;
        }

        .event-title {
          font-size: 11px;
          font-weight: 600;
          color: white;
          margin-bottom: 1px;
          line-height: 1.1;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-time {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .past-event {
          opacity: 0.6 !important;
        }

        .future-event {
          opacity: 1;
        }

        /* Стили для временной линии убраны для MVP */
        
        .event-details {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #004AAD 0%, #0099FF 100%);
          border-radius: 20px;
          padding: 24px;
          color: white;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          z-index: 1001;
          min-width: 400px;
          max-width: 500px;
        }
        
        .event-details h3 {
          margin: 0 0 16px 0;
          font-size: 20px;
          font-weight: 700;
        }
        
        .event-details p {
          margin: 8px 0;
          opacity: 0.9;
        }
        
        .event-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          justify-content: flex-end;
        }
        
        .event-btn {
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .event-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .event-btn.delete {
          background: rgba(244, 67, 54, 0.8);
          border-color: rgba(244, 67, 54, 0.8);
        }
        
        .event-btn.delete:hover {
          background: rgba(244, 67, 54, 0.9);
        }
        
        .calendar-body {
          max-height: 600px;
          overflow-y: auto;
          border-radius: 12px;
          position: relative;
        }
        
        .days-header {
          display: grid;
          grid-template-columns: 80px repeat(7, 1fr);
          gap: 1px;
          margin-bottom: 8px;
        }
        
        .day-header {
          background: rgba(255,255,255,.2);
          padding: 12px 8px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          border-radius: 8px;
        }
        
        .time-column-header {
          background: rgba(255,255,255,.15);
          padding: 12px 8px;
          text-align: center;
          font-weight: 600;
          font-size: 12px;
          border-radius: 8px;
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
        
        <div style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginLeft: '20px' }}>
          {currentTime.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
        
        <div className="week-navigation">
          <button className="nav-button" onClick={goToPreviousWeek}>
            ←
          </button>
          <button className="nav-button today-btn" onClick={goToToday} title="Сегодня">
            Сегодня
          </button>
          <button className="nav-button" onClick={goToNextWeek}>
            →
          </button>
        </div>
        
        {/* Отладочная информация убрана для MVP */}
      </div>

      {/* Заголовки дней недели - над таблицей */}
      <div className="days-header">
        <div className="time-column-header">Время</div>
        {dayNames.map((day, index) => (
          <div key={index} className="day-header">
            <div>{day}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>
              {weekDays[index].getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Календарная сетка */}
      <div className="calendar-body" ref={calendarBodyRef}>
        <div className="calendar-grid">
          {/* Временные слоты */}
          {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={time}>
              <div className="time-column">{time}</div>
              {weekDays.map((date, dayIndex) => {
                // Находим события для этого дня и времени
                const dayEvents = events.filter(event => {
                  const eventDate = new Date(event.start_time);
                  const eventDateStr = eventDate.toISOString().split('T')[0];
                  const dayDateStr = date.toISOString().split('T')[0];
                  return eventDateStr === dayDateStr;
                });

                return (
                  <div
                    key={`${dayIndex}-${timeIndex}`}
                    className="time-slot"
                    onClick={() => handleTimeSlotClick(date, time)}
                  >
                    {/* События для этого дня и времени */}
                    {dayEvents.map((event) => {
                      const eventStartTime = new Date(event.start_time);
                      const eventEndTime = new Date(event.end_time);
                      const slotTime = new Date(`2000-01-01T${time}:00`);
                      const slotEndTime = new Date(`2000-01-01T${time}:00`);
                      slotEndTime.setHours(slotEndTime.getHours() + 1);

                      // Проверяем, пересекается ли событие с этим слотом
                      const eventStart = eventStartTime.getHours() * 60 + eventStartTime.getMinutes();
                      const eventEnd = eventEndTime.getHours() * 60 + eventEndTime.getMinutes();
                      const slotStart = slotTime.getHours() * 60;
                      const slotEnd = slotEndTime.getHours() * 60;

                      if (eventStart < slotEnd && eventEnd > slotStart) {
                        const isPast = isPastEvent(event);
                        return (
                          <div
                            key={event.id}
                            className={`event-block ${isPast ? 'past-event' : 'future-event'}`}
                            style={{
                              backgroundColor: event.color,
                              opacity: isPast ? 0.6 : 1
                            }}
                            title={`${event.title} - ${new Date(event.start_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.end_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingEvent(event);
                              setSelectedSlot({ 
                                date: new Date(event.start_time.split('T')[0]), 
                                time: event.start_time.split('T')[1].substring(0, 5)
                              });
                              setShowEventForm(true);
                            }}
                          >
                            <div className="event-title">{event.title}</div>
                            <div className="event-time">
                              {new Date(event.start_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        
        {/* События размещаются прямо в ячейках времени */}
      </div>

      {/* Форма добавления события */}
      {showEventForm && selectedSlot && (
        <EventForm
          selectedSlot={selectedSlot}
          clients={clients}
          editingEvent={editingEvent}
          onClose={() => {
            setShowEventForm(false);
            setSelectedSlot(null);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
}

// Компонент формы добавления события
interface EventFormProps {
  selectedSlot: { date: Date; time: string };
  clients: Client[];
  editingEvent?: CalendarEvent | null;
  onClose: () => void;
  onSave: (eventData: any) => void;
  onDelete?: (eventId: string, deleteType?: 'single' | 'all') => void;
}

function EventForm({ selectedSlot, clients, editingEvent, onClose, onSave, onDelete }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: editingEvent?.title || '',
    start_time: editingEvent ? editingEvent.start_time.split('T')[1].substring(0, 5) : selectedSlot.time,
    end_time: editingEvent ? editingEvent.end_time.split('T')[1].substring(0, 5) : `${(parseInt(selectedSlot.time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
    client_id: editingEvent?.client_id || '',
    is_recurring: editingEvent?.is_recurring || false,
    recurrence_pattern: editingEvent?.recurrence_pattern || 'weekly',
    recurrence_end_date: editingEvent?.recurrence_end_date || '',
    color: editingEvent?.color || '#3b82f6'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave({
        ...formData,
        date: editingEvent ? editingEvent.start_time.split('T')[0] : selectedSlot.date.toISOString().split('T')[0]
      });
      onClose(); // Закрываем форму после сохранения
    }
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    if (editingEvent && onDelete) {
      console.log('=== FORM DELETE DEBUG ===');
      console.log('Editing event in form:', editingEvent);
      console.log('Event ID to delete:', editingEvent.id);
      
      if (editingEvent.is_recurring) {
        // Для повторяющихся событий показываем кастомный диалог
        setShowDeleteDialog(true);
      } else {
        // Для обычных событий стандартное подтверждение
        const confirmDelete = window.confirm(
          `Вы уверены, что хотите удалить событие "${editingEvent.title}"?`
        );
        
        if (confirmDelete) {
          console.log('User confirmed deletion of single event');
          onDelete(editingEvent.id, 'single');
          onClose();
        } else {
          console.log('User cancelled deletion');
        }
      }
      console.log('=== END FORM DELETE DEBUG ===');
    }
  };

  const handleDeleteChoice = (deleteType: 'single' | 'all') => {
    if (editingEvent && onDelete) {
      console.log(`User chose to delete: ${deleteType}`);
      onDelete(editingEvent.id, deleteType);
      setShowDeleteDialog(false);
      onClose();
    }
  };

  return (
    <>
      {/* Диалог выбора типа удаления */}
      {showDeleteDialog && (
        <div className="delete-dialog-overlay">
          <div className="delete-dialog">
            <h3>Удаление повторяющегося события</h3>
            <p>Событие "<strong>{editingEvent?.title}</strong>" является повторяющимся.</p>
            <p>Что вы хотите удалить?</p>
            <div className="delete-dialog-buttons">
              <button 
                className="btn btn-secondary" 
                onClick={() => handleDeleteChoice('single')}
              >
                Только это событие
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDeleteChoice('all')}
              >
                Все повторяющиеся события
              </button>
              <button 
                className="btn btn-cancel" 
                onClick={() => setShowDeleteDialog(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

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
        
        .btn.delete {
          background: rgba(244, 67, 54, 0.8);
          border-color: rgba(244, 67, 54, 0.8);
        }
        
        .btn.delete:hover {
          background: rgba(244, 67, 54, 0.9);
        }

        /* Стили для диалога удаления */
        .delete-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
        }

        .delete-dialog {
          background: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .delete-dialog h3 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }

        .delete-dialog p {
          margin: 0 0 12px 0;
          color: #666;
          line-height: 1.5;
        }

        .delete-dialog-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }

        .delete-dialog-buttons .btn {
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .delete-dialog-buttons .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .delete-dialog-buttons .btn-secondary:hover {
          background: #5a6268;
        }

        .delete-dialog-buttons .btn-danger {
          background: #dc3545;
          color: white;
        }

        .delete-dialog-buttons .btn-danger:hover {
          background: #c82333;
        }

        .delete-dialog-buttons .btn-cancel {
          background: #f8f9fa;
          color: #6c757d;
          border: 1px solid #dee2e6;
        }

        .delete-dialog-buttons .btn-cancel:hover {
          background: #e9ecef;
        }

        /* Стили для выбора цвета */
        .color-picker {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .color-option {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .color-option input[type="radio"] {
          display: none;
        }

        .color-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid transparent;
          transition: all 0.2s ease;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .color-option input[type="radio"]:checked + .color-circle {
          border-color: #333;
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .color-option:hover .color-circle {
          transform: scale(1.05);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="event-form">
        <div className="form-header">
          <h2 className="form-title">{editingEvent ? 'Редактировать событие' : 'Добавить событие'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {editingEvent && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              fontSize: '12px',
              opacity: 0.8
            }}>
              <div>📅 Дата: {editingEvent.start_time.split('T')[0]}</div>
              <div>🕐 Время: {editingEvent.start_time.split('T')[1].substring(0, 5)} - {editingEvent.end_time.split('T')[1].substring(0, 5)}</div>
              {editingEvent.client_name && <div>👤 Клиент: {editingEvent.client_name}</div>}
              {editingEvent.is_recurring && <div>🔄 Повторяющееся: {editingEvent.recurrence_pattern}</div>}
            </div>
          )}
          
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
            <label className="form-label">Цвет события</label>
            <div className="color-picker">
              {[
                { name: 'Синий', value: '#3b82f6' },
                { name: 'Зеленый', value: '#10b981' },
                { name: 'Розовый', value: '#ec4899' },
                { name: 'Фиолетовый', value: '#8b5cf6' },
                { name: 'Оранжевый', value: '#f59e0b' },
                { name: 'Красный', value: '#ef4444' },
                { name: 'Голубой', value: '#06b6d4' },
                { name: 'Серый', value: '#6b7280' }
              ].map((color) => (
                <label key={color.value} className="color-option">
                  <input
                    type="radio"
                    name="color"
                    value={color.value}
                    checked={formData.color === color.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  />
                  <span 
                    className="color-circle" 
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                </label>
              ))}
            </div>
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
            <>
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
              <div className="form-group">
                <label className="form-label">Дата окончания повторения</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.recurrence_end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurrence_end_date: e.target.value }))}
                />
              </div>
            </>
          )}

          <div className="form-actions">
            {editingEvent && onDelete && (
              <button type="button" className="btn delete" onClick={handleDelete}>
                Удалить
              </button>
            )}
            <button type="button" className="btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {editingEvent ? 'Обновить' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
      </div>
    </>
  );
}
