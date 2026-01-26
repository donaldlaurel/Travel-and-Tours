'use client'

import { useLanguage } from "@/lib/language-context"

export function FeaturedHotelsHeader() {
  const { t, language } = useLanguage()

  return (
    <div className="text-center mb-10" key={language}>
      <h2 className="text-3xl font-bold mb-3 text-balance">{t('home.featured_hotels')}</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">{t('home.featured_hotels_subtitle')}</p>
    </div>
  )
}
