-- Add missing homepage translation keys for all components

-- Featured Hotels - English
INSERT INTO translations (key, language, value, category) VALUES
('home.featured_hotels', 'en', 'Featured Hotels', 'home'),
('home.featured_hotels_subtitle', 'en', 'Discover our handpicked selection of premium hotels', 'home'),
('home.featured_hotels_error', 'en', 'Error loading featured hotels. Please try again later.', 'home'),
('home.featured_hotels_no_data', 'en', 'No hotels available yet. Please run the database scripts to add sample data.', 'home')
ON CONFLICT (key, language) DO NOTHING;

-- Featured Hotels - Korean
INSERT INTO translations (key, language, value, category) VALUES
('home.featured_hotels', 'ko', '추천 호텔', 'home'),
('home.featured_hotels_subtitle', 'ko', '엄선된 프리미엄 호텔을 발견하세요', 'home'),
('home.featured_hotels_error', 'ko', '호텔 로드 중 오류가 발생했습니다. 나중에 다시 시도하세요.', 'home'),
('home.featured_hotels_no_data', 'ko', '아직 사용 가능한 호텔이 없습니다. 샘플 데이터를 추가하려면 데이터베이스 스크립트를 실행하세요.', 'home')
ON CONFLICT (key, language) DO NOTHING;

-- Popular Destinations (already has home.top_destinations and home.popular_destinations_subtitle)
-- Adding hotel count label - English
INSERT INTO translations (key, language, value, category) VALUES
('home.hotels_count', 'en', 'hotels', 'home')
ON CONFLICT (key, language) DO NOTHING;

-- Adding hotel count label - Korean
INSERT INTO translations (key, language, value, category) VALUES
('home.hotels_count', 'ko', '개의 호텔', 'home')
ON CONFLICT (key, language) DO NOTHING;

-- Hero Slider Navigation - English
INSERT INTO translations (key, language, value, category) VALUES
('hero.previous_slide', 'en', 'Previous slide', 'hero'),
('hero.next_slide', 'en', 'Next slide', 'hero'),
('hero.go_to_slide', 'en', 'Go to slide', 'hero')
ON CONFLICT (key, language) DO NOTHING;

-- Hero Slider Navigation - Korean
INSERT INTO translations (key, language, value, category) VALUES
('hero.previous_slide', 'ko', '이전 슬라이드', 'hero'),
('hero.next_slide', 'ko', '다음 슬라이드', 'hero'),
('hero.go_to_slide', 'ko', '슬라이드로 이동', 'hero')
ON CONFLICT (key, language) DO NOTHING;
