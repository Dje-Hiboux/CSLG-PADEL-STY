export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          nickname: string | null
          role: 'admin' | 'member' | 'guest'
          is_active: boolean
          email: string
          created_at: string
          updated_at: string
          avatar_url: string | null
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          nickname?: string | null
          role?: 'admin' | 'member' | 'guest'
          is_active?: boolean
          email: string
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          nickname?: string | null
          role?: 'admin' | 'member' | 'guest'
          is_active?: boolean
          email?: string
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
      }
      courts: {
        Row: {
          id: string
          name: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          court_id: string
          user_id: string
          start_time: string
          end_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          court_id: string
          user_id?: string
          start_time: string
          end_time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          court_id?: string
          user_id?: string
          start_time?: string
          end_time?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}