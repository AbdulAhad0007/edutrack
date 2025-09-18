'use client'

import { Suspense } from 'react'
import EmailAuth from './EmailAuth'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailAuth />
    </Suspense>
  )
}
