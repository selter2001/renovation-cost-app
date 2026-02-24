import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '@/lib/supabase'
import { useWizardStore } from '@/stores/wizard-store'
import type { QuoteData, Database } from '@/types/database'

type QuoteRow = Database['public']['Tables']['quotes']['Row']

export function useLoadEstimate() {
  const navigate = useNavigate()

  return useCallback(
    async (quoteId: string) => {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single()

      if (error) throw error

      const row = data as unknown as QuoteRow
      const quoteData = row.data as QuoteData

      useWizardStore.setState({
        rooms: quoteData.rooms,
        vatRate: quoteData.vatRate,
        currentStep: 0,
      })

      navigate('/wizard')
    },
    [navigate],
  )
}

export function useDeleteEstimate() {
  return useCallback(async (quoteId: string) => {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', quoteId)

    if (error) throw error
  }, [])
}
