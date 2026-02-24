import { lazy, Suspense } from 'react'
import { createHashRouter } from 'react-router'
import { Layout } from '@/components/layout/Layout'
import { Skeleton } from '@/components/ui/skeleton'
import HomePage from '@/pages/HomePage'

const WizardPage = lazy(() => import('@/pages/WizardPage'))

function WizardPageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex justify-between">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
      <div className="space-y-4 pt-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'wizard',
        element: (
          <Suspense fallback={<WizardPageSkeleton />}>
            <WizardPage />
          </Suspense>
        ),
      },
    ],
  },
])

export default router
