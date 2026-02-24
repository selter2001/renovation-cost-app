import type { Room } from '@/types/wizard'

export interface QuoteData {
  rooms: Room[]
  vatRate: 8 | 23
}

export interface Database {
  public: {
    Tables: {
      quotes: {
        Row: {
          id: string
          user_id: string
          name: string
          data: QuoteData
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          data: QuoteData
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          data?: QuoteData
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
