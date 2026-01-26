'use client'

import React from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LanguageProvider } from '@/lib/language-context'

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </LanguageProvider>
  )
}
