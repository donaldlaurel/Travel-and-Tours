'use client'

import { Shield, Clock, BadgePercent, Headphones } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const featureKeys = [
  {
    icon: BadgePercent,
    titleKey: 'home.best_price',
    descKey: 'home.best_price_desc',
  },
  {
    icon: Shield,
    titleKey: 'home.secure_booking',
    descKey: 'home.secure_booking_desc',
  },
  {
    icon: Clock,
    titleKey: 'home.free_cancellation',
    descKey: 'home.free_cancellation_desc',
  },
  {
    icon: Headphones,
    titleKey: 'home.support_24_7',
    descKey: 'home.support_24_7_desc',
  },
]

export function WhyBookWithUs() {
  const { t, language } = useLanguage()

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 text-balance" key={language}>{t('home.why_book')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('home.why_book_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureKeys.map((feature) => (
            <div key={feature.titleKey} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t(feature.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
