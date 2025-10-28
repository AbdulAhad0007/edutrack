'use client'

import { Suspense } from 'react'
import EmailAuth from './EmailAuth'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailAuth />
    </Suspense>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> e72ad566b79fdad6a6790dcdbf09158b3490aec0
