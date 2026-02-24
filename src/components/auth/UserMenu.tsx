import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { LogIn, User, LogOut, FileText } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) {
    return <Skeleton className="h-8 w-20" />
  }

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => navigate('/login')}
      >
        <LogIn className="size-4" />
        {t('auth.login')}
      </Button>
    )
  }

  const truncatedEmail =
    user.email && user.email.length > 20
      ? user.email.slice(0, 20) + '...'
      : user.email

  async function handleSignOut() {
    try {
      await supabase.auth.signOut()
    } catch {
      // Gracefully handle sign-out errors
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="size-4" />
          <span className="hidden md:inline">{truncatedEmail}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => navigate('/estimates')}>
          <FileText className="mr-2 size-4" />
          {t('auth.myEstimates')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 size-4" />
          {t('auth.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
