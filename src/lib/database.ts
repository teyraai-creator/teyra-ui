// src/lib/database.ts
import { supabase } from './supabase';

// Типы данных
export interface UserProfile {
  id: string;
  role?: string;
  full_name?: string;
  org_name?: string;
  created_at: string;
  language?: string;
}

export interface Client {
  id: string;
  therapist_id: string;
  display_name: string;
  tags?: any;
  created_at: string;
}

// Функции для работы с профилем пользователя
export const profileService = {
  // Получить профиль пользователя
  async getProfile(userId: string): Promise<UserProfile | null> {
    console.log('profileService.getProfile called with userId:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    console.log('Supabase getProfile result:', { data, error });
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  },

  // Создать или обновить профиль
  async upsertProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    console.log('profileService.upsertProfile called with:', { userId, profileData });
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData
      })
      .select()
      .single();
    
    console.log('Supabase upsert result:', { data, error });
    
    if (error) {
      console.error('Error upserting profile:', error);
      return null;
    }
    
    return data;
  }
};

// Функции для работы с клиентами
export const clientService = {
  // Получить всех клиентов пользователя
  async getClients(userId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('therapist_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
    
    return data || [];
  },

  // Создать нового клиента
  async createClient(userId: string, clientData: Omit<Client, 'id' | 'therapist_id' | 'created_at'>): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        therapist_id: userId,
        ...clientData
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating client:', error);
      return null;
    }
    
    return data;
  },

  // Обновить клиента
  async updateClient(clientId: string, clientData: Partial<Client>): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...clientData
      })
      .eq('id', clientId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating client:', error);
      return null;
    }
    
    return data;
  },

  // Удалить клиента
  async deleteClient(clientId: string): Promise<boolean> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);
    
    if (error) {
      console.error('Error deleting client:', error);
      return false;
    }
    
    return true;
  }
};

// Интерфейс для события календаря
export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  start_time: string;
  end_time: string;
  client_id?: string;
  client_name?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

// Сервис для работы с событиями календаря
export const calendarEventService = {
  // Получить все события пользователя
  async getEvents(userId: string): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
    
    return data || [];
  },

  // Создать новое событие
  async createEvent(userId: string, eventData: Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<CalendarEvent | null> {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        user_id: userId,
        ...eventData
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating calendar event:', error);
      return null;
    }
    
    return data;
  },

  // Обновить событие
  async updateEvent(eventId: string, eventData: Partial<Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<CalendarEvent | null> {
    const { data, error } = await supabase
      .from('calendar_events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating calendar event:', error);
      return null;
    }
    
    return data;
  },

  // Удалить событие
  async deleteEvent(eventId: string): Promise<boolean> {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', eventId);
    
    if (error) {
      console.error('Error deleting calendar event:', error);
      return false;
    }
    
    return true;
  },

  // Удалить все повторяющиеся события
  async deleteRecurringEvents(baseId: string): Promise<boolean> {
    // Удаляем все события с базовым ID (включая повторяющиеся)
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .or(`id.eq.${baseId},id.like.${baseId}_%`);
    
    if (error) {
      console.error('Error deleting recurring events:', error);
      return false;
    }
    
    return true;
  }
};
