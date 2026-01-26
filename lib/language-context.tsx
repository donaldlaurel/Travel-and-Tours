'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

export type Language = 'en' | 'ko'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Header
    'header.list_place': 'List your place',
    'header.sign_in': 'Sign in',
    'header.create_account': 'Create account',
    
    // Navigation
    'nav.transport': 'Transport',
    'nav.activities': 'Activities',
    'nav.coupons': 'Coupons & Deals',
    'nav.esim': 'eSIM',
    'nav.guides': 'Travel Guides',
    'nav.itineraries': 'Travel Itineraries',
    
    // Home
    'home.title': 'SEE THE WORLD FOR LESS',
    'home.subtitle': 'Discover affordable hotels, flights and activities',
    'home.hotels': 'Hotels',
    'home.flights': 'Flights',
    'home.homes': 'Homes & Apts',
    'home.flight_hotel': 'Flight + Hotel',
    'home.activities': 'Activities',
    'home.airport_transfer': 'Airport transfer',
    'home.overnight': 'Overnight Stays',
    'home.day_use': 'Day Use Stays',
    'home.search_location': 'Try "Buewater Maribago Beach Resort"',
    'home.check_in': 'Check-in',
    'home.check_out': 'Check-out',
    'home.guests': 'Guests',
    'home.rooms': 'Room',
    'home.search_button': 'SEARCH',
    'home.top_destinations': 'Top destinations in the Philippines',
    'home.popular_destinations_subtitle': 'Explore our most popular destinations and find your perfect getaway',
    'home.why_book': 'Why Book With Us',
    'home.why_book_subtitle': 'We make booking easy and worry-free',
    'home.best_price': 'Best Price Guarantee',
    'home.best_price_desc': "Find a lower price? We'll match it and give you an extra 10% off.",
    'home.secure_booking': 'Secure Booking',
    'home.secure_booking_desc': 'Your payment and personal information are always protected.',
    'home.free_cancellation': 'Free Cancellation',
    'home.free_cancellation_desc': 'Plans change. That\'s why we offer free cancellation on most rooms.',
    'home.support_24_7': '24/7 Support',
    'home.support_24_7_desc': 'Our customer support team is available around the clock to help.',
    'home.exclusive_deals': 'Exclusive Deals',
    'home.exclusive_deals_desc': 'Get access to members-only offers and discounts unavailable elsewhere.',
    'home.featured_hotels': 'Featured Hotels',
    'home.featured_hotels_desc': 'Hand-picked hotels with exceptional ratings and service',
    
    // Admin
    'admin.rooms': 'Room Types',
    'admin.manage_rooms': 'Manage room types for all hotels',
    'admin.add_room': 'Add Room Type',
    'admin.hotel': 'Hotel',
    'admin.room_type': 'Room Type',
    'admin.capacity': 'Capacity',
    'admin.price': 'Price',
    'admin.actions': 'Actions',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.search': 'Search rooms or hotels...',
    
    // Auth
    'auth.sign_in': 'Sign In',
    'auth.create_account': 'Create Account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.sign_in_button': 'Sign In',
    'auth.sign_up_button': 'Create Account',
    'auth.forgot_password': 'Forgot Password?',
    'auth.no_account': "Don't have an account?",
    'auth.have_account': 'Already have an account?',
  },
  ko: {
    // Header
    'header.list_place': '숙소 등록',
    'header.sign_in': '로그인',
    'header.create_account': '계정 만들기',
    
    // Navigation
    'nav.transport': '교통편',
    'nav.activities': '액티비티',
    'nav.coupons': '쿠폰 & 거래',
    'nav.esim': 'eSIM',
    'nav.guides': '여행 가이드',
    'nav.itineraries': '여행 일정',
    
    // Home
    'home.title': '저렴하게 세계를 여행하세요',
    'home.subtitle': '저렴한 호텔, 항공편 및 액티비티 발견',
    'home.hotels': '호텔',
    'home.flights': '항공편',
    'home.homes': '홈 & 아파트',
    'home.flight_hotel': '항공편 + 호텔',
    'home.activities': '액티비티',
    'home.airport_transfer': '공항 이동',
    'home.overnight': '1박 이상',
    'home.day_use': '데이 유즈',
    'home.search_location': '"Buewater Maribago Beach Resort" 시도',
    'home.check_in': '체크인',
    'home.check_out': '체크아웃',
    'home.guests': '게스트',
    'home.rooms': '객실',
    'home.search_button': '검색',
    'home.top_destinations': '필리핀의 인기 여행지',
    'home.popular_destinations_subtitle': '가장 인기 있는 목적지를 탐색하고 완벽한 휴양지를 찾으세요',
    'home.why_book': '저희를 선택해야 하는 이유',
    'home.why_book_subtitle': '쉽고 걱정 없는 예약을 제공합니다',
    'home.best_price': '최저 가격 보장',
    'home.best_price_desc': '더 저렴한 가격을 찾으셨나요? 일치시켜드리고 추가 10% 할인까지 드립니다.',
    'home.secure_booking': '안전한 예약',
    'home.secure_booking_desc': '귀하의 결제 정보와 개인 정보는 항상 보호됩니다.',
    'home.free_cancellation': '무료 취소',
    'home.free_cancellation_desc': '계획이 변경되나요? 대부분의 객실에서 무료 취소를 제공합니다.',
    'home.support_24_7': '24/7 고객 지원',
    'home.support_24_7_desc': '저희 고객 지원 팀은 항상 도움을 드리기 위해 준비되어 있습니다.',
    'home.exclusive_deals': '특별 할인',
    'home.exclusive_deals_desc': '다른 곳에서는 찾을 수 없는 회원 전용 오퍼와 할인을 받으세요.',
    'home.featured_hotels': '추천 호텔',
    'home.featured_hotels_desc': '뛰어난 평점과 서비스의 엄선된 호텔',
    
    // Admin
    'admin.rooms': '객실 유형',
    'admin.manage_rooms': '모든 호텔의 객실 유형 관리',
    'admin.add_room': '객실 유형 추가',
    'admin.hotel': '호텔',
    'admin.room_type': '객실 유형',
    'admin.capacity': '수용력',
    'admin.price': '가격',
    'admin.actions': '작업',
    'admin.edit': '편집',
    'admin.delete': '삭제',
    'admin.search': '객실 또는 호텔 검색...',
    
    // Auth
    'auth.sign_in': '로그인',
    'auth.create_account': '계정 만들기',
    'auth.email': '이메일',
    'auth.password': '비밀번호',
    'auth.confirm_password': '비밀번호 확인',
    'auth.sign_in_button': '로그인',
    'auth.sign_up_button': '계정 만들기',
    'auth.forgot_password': '비밀번호를 잊으셨나요?',
    'auth.no_account': '계정이 없으신가요?',
    'auth.have_account': '이미 계정이 있으신가요?',
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<Language, Record<string, string>>>({
    en: {},
    ko: {},
  })

  // Load saved language and fetch dynamic translations
  useEffect(() => {
    // Load language from localStorage
    const saved = localStorage.getItem('language') as Language | null
    if (saved && (saved === 'en' || saved === 'ko')) {
      setLanguageState(saved)
    }
    
    // Fetch dynamic translations from database
    fetchTranslations()
      .then((data) => {
        if (data) {
          setDynamicTranslations(data)
          console.log('[v0] Dynamic translations loaded successfully')
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    console.log('[v0] Setting language to:', lang)
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }, [])

  const t = useCallback((key: string): string => {
    // First try dynamic translations from database
    if (dynamicTranslations[language] && dynamicTranslations[language][key]) {
      return dynamicTranslations[language][key]
    }

    // Fall back to hardcoded translations
    const keys = key.split('.')
    let value: any = translations[language]
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Return fallback to English if key doesn't exist in current language
        let fallbackValue: any = translations['en']
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
            fallbackValue = fallbackValue[fk]
          } else {
            return key
          }
        }
        return typeof fallbackValue === 'string' ? fallbackValue : key
      }
    }
    return typeof value === 'string' ? value : key
  }, [language, dynamicTranslations])

  const contextValue = useMemo(
    () => ({ language, setLanguage, t, isLoading }),
    [language, setLanguage, t, isLoading]
  )

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

// Fetch translations from the database
async function fetchTranslations(): Promise<Record<Language, Record<string, string>> | null> {
  try {
    console.log('[v0] Fetching translations for English...')
    const responseEn = await fetch('/api/translations?language=en', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('[v0] Fetching translations for Korean...')
    const responseKo = await fetch('/api/translations?language=ko', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!responseEn.ok || !responseKo.ok) {
      console.log('[v0] Failed to fetch translations from API, using hardcoded fallback')
      console.log('[v0] EN response status:', responseEn.status, 'KO response status:', responseKo.status)
      return null
    }

    const dataEn = await responseEn.json()
    const dataKo = await responseKo.json()
    
    // Transform API response into the format we need
    const result: Record<Language, Record<string, string>> = {
      en: {},
      ko: {},
    }

    if (Array.isArray(dataEn)) {
      dataEn.forEach((item: any) => {
        result['en'][item.key] = item.value
      })
      console.log('[v0] Loaded', dataEn.length, 'English translations from database')
    }

    if (Array.isArray(dataKo)) {
      dataKo.forEach((item: any) => {
        result['ko'][item.key] = item.value
      })
      console.log('[v0] Loaded', dataKo.length, 'Korean translations from database')
    }

    console.log('[v0] Successfully fetched dynamic translations from database')
    return result
  } catch (error) {
    console.error('[v0] Error fetching translations:', error)
    return null
  }
}
