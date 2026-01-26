'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'ko'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null
    if (saved && (saved === 'en' || saved === 'ko')) {
      setLanguageState(saved)
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }
    return typeof value === 'string' ? value : key
  }

  if (!mounted) return <>{children}</>

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
