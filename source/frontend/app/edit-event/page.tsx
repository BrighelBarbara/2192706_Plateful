export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import EditEventClient from './EditEventClient'

export default function EditEventPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditEventClient />
    </Suspense>
  )
}
