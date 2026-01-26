-- Create translations table for managing frontend text content
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  language TEXT NOT NULL,
  value TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(key, language)
);

-- Enable RLS
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Admin can read all translations
CREATE POLICY "Admins can read translations" ON translations FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admin can insert translations
CREATE POLICY "Admins can insert translations" ON translations FOR INSERT
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admin can update translations
CREATE POLICY "Admins can update translations" ON translations FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admin can delete translations
CREATE POLICY "Admins can delete translations" ON translations FOR DELETE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Public can read published translations
CREATE POLICY "Public can read translations" ON translations FOR SELECT
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_translations_key_language ON translations(key, language);
CREATE INDEX IF NOT EXISTS idx_translations_category ON translations(category);

-- Insert default translations
INSERT INTO translations (key, language, value, category) VALUES
-- Header - English
('header.list_place', 'en', 'List your place', 'header'),
('header.sign_in', 'en', 'Sign in', 'header'),
('header.create_account', 'en', 'Create account', 'header'),

-- Navigation - English
('nav.transport', 'en', 'Transport', 'navigation'),
('nav.activities', 'en', 'Activities', 'navigation'),
('nav.coupons', 'en', 'Coupons & Deals', 'navigation'),
('nav.esim', 'en', 'eSIM', 'navigation'),
('nav.guides', 'en', 'Travel Guides', 'navigation'),
('nav.itineraries', 'en', 'Travel Itineraries', 'navigation'),

-- Home - English
('home.title', 'en', 'SEE THE WORLD FOR LESS', 'home'),
('home.subtitle', 'en', 'Discover affordable hotels, flights and activities', 'home'),
('home.hotels', 'en', 'Hotels', 'home'),
('home.flights', 'en', 'Flights', 'home'),
('home.homes', 'en', 'Homes & Apts', 'home'),
('home.flight_hotel', 'en', 'Flight + Hotel', 'home'),
('home.activities', 'en', 'Activities', 'home'),
('home.airport_transfer', 'en', 'Airport transfer', 'home'),
('home.overnight', 'en', 'Overnight Stays', 'home'),
('home.day_use', 'en', 'Day Use Stays', 'home'),
('home.search_location', 'en', 'Try "Buewater Maribago Beach Resort"', 'home'),
('home.check_in', 'en', 'Check-in', 'home'),
('home.check_out', 'en', 'Check-out', 'home'),
('home.guests', 'en', 'Guests', 'home'),
('home.rooms', 'en', 'Room', 'home'),
('home.search_button', 'en', 'SEARCH', 'home'),
('home.top_destinations', 'en', 'Top destinations in the Philippines', 'home'),

-- Admin - English
('admin.rooms', 'en', 'Room Types', 'admin'),
('admin.manage_rooms', 'en', 'Manage room types for all hotels', 'admin'),
('admin.add_room', 'en', 'Add Room Type', 'admin'),
('admin.hotel', 'en', 'Hotel', 'admin'),
('admin.room_type', 'en', 'Room Type', 'admin'),
('admin.capacity', 'en', 'Capacity', 'admin'),
('admin.price', 'en', 'Price', 'admin'),
('admin.actions', 'en', 'Actions', 'admin'),
('admin.edit', 'en', 'Edit', 'admin'),
('admin.delete', 'en', 'Delete', 'admin'),
('admin.search', 'en', 'Search rooms or hotels...', 'admin'),

-- Auth - English
('auth.sign_in', 'en', 'Sign In', 'auth'),
('auth.create_account', 'en', 'Create Account', 'auth'),
('auth.email', 'en', 'Email', 'auth'),
('auth.password', 'en', 'Password', 'auth'),
('auth.confirm_password', 'en', 'Confirm Password', 'auth'),
('auth.sign_in_button', 'en', 'Sign In', 'auth'),
('auth.sign_up_button', 'en', 'Create Account', 'auth'),
('auth.forgot_password', 'en', 'Forgot Password?', 'auth'),
('auth.no_account', 'en', 'Don''t have an account?', 'auth'),
('auth.have_account', 'en', 'Already have an account?', 'auth'),

-- Header - Korean
('header.list_place', 'ko', '숙소 등록', 'header'),
('header.sign_in', 'ko', '로그인', 'header'),
('header.create_account', 'ko', '계정 만들기', 'header'),

-- Navigation - Korean
('nav.transport', 'ko', '교통편', 'navigation'),
('nav.activities', 'ko', '액티비티', 'navigation'),
('nav.coupons', 'ko', '쿠폰 & 거래', 'navigation'),
('nav.esim', 'ko', 'eSIM', 'navigation'),
('nav.guides', 'ko', '여행 가이드', 'navigation'),
('nav.itineraries', 'ko', '여행 일정', 'navigation'),

-- Home - Korean
('home.title', 'ko', '저렴하게 세계를 여행하세요', 'home'),
('home.subtitle', 'ko', '저렴한 호텔, 항공편 및 액티비티 발견', 'home'),
('home.hotels', 'ko', '호텔', 'home'),
('home.flights', 'ko', '항공편', 'home'),
('home.homes', 'ko', '홈 & 아파트', 'home'),
('home.flight_hotel', 'ko', '항공편 + 호텔', 'home'),
('home.activities', 'ko', '액티비티', 'home'),
('home.airport_transfer', 'ko', '공항 이동', 'home'),
('home.overnight', 'ko', '1박 이상', 'home'),
('home.day_use', 'ko', '데이 유즈', 'home'),
('home.search_location', 'ko', '"Buewater Maribago Beach Resort" 시도', 'home'),
('home.check_in', 'ko', '체크인', 'home'),
('home.check_out', 'ko', '체크아웃', 'home'),
('home.guests', 'ko', '게스트', 'home'),
('home.rooms', 'ko', '객실', 'home'),
('home.search_button', 'ko', '검색', 'home'),
('home.top_destinations', 'ko', '필리핀의 인기 여행지', 'home'),

-- Admin - Korean
('admin.rooms', 'ko', '객실 유형', 'admin'),
('admin.manage_rooms', 'ko', '모든 호텔의 객실 유형 관리', 'admin'),
('admin.add_room', 'ko', '객실 유형 추가', 'admin'),
('admin.hotel', 'ko', '호텔', 'admin'),
('admin.room_type', 'ko', '객실 유형', 'admin'),
('admin.capacity', 'ko', '수용력', 'admin'),
('admin.price', 'ko', '가격', 'admin'),
('admin.actions', 'ko', '작업', 'admin'),
('admin.edit', 'ko', '편집', 'admin'),
('admin.delete', 'ko', '삭제', 'admin'),
('admin.search', 'ko', '객실 또는 호텔 검색...', 'admin'),

-- Auth - Korean
('auth.sign_in', 'ko', '로그인', 'auth'),
('auth.create_account', 'ko', '계정 만들기', 'auth'),
('auth.email', 'ko', '이메일', 'auth'),
('auth.password', 'ko', '비밀번호', 'auth'),
('auth.confirm_password', 'ko', '비밀번호 확인', 'auth'),
('auth.sign_in_button', 'ko', '로그인', 'auth'),
('auth.sign_up_button', 'ko', '계정 만들기', 'auth'),
('auth.forgot_password', 'ko', '비밀번호를 잊으셨나요?', 'auth'),
('auth.no_account', 'ko', '계정이 없으신가요?', 'auth'),
('auth.have_account', 'ko', '이미 계정이 있으신가요?', 'auth')
ON CONFLICT (key, language) DO NOTHING;
