-- Clear existing hotels and related data
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE favorites CASCADE;
TRUNCATE TABLE bookings CASCADE;
TRUNCATE TABLE hotel_images CASCADE;
TRUNCATE TABLE room_types CASCADE;
TRUNCATE TABLE hotels CASCADE;

-- =============================================
-- MACTAN HOTELS (50 hotels)
-- =============================================
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('Shangri-La Mactan Resort', 'World-class beachfront resort with pristine private beach, multiple pools, and exceptional dining options overlooking the Cebu Strait.', 'Punta Engaño Road', 'Mactan', 'Philippines', 5, 12500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Private Beach', 'Spa', 'Restaurant', 'Gym', 'Free WiFi', 'Kids Club', 'Water Sports']),
('Plantation Bay Resort', 'Award-winning resort featuring the largest man-made saltwater lagoon in the country with overwater bungalows and lush tropical gardens.', 'Marigondon', 'Mactan', 'Philippines', 5, 9800.00, '/placeholder.svg?height=400&width=600', ARRAY['Lagoon', 'Pool', 'Spa', 'Restaurant', 'Free WiFi', 'Water Sports', 'Tennis']),
('Crimson Resort & Spa', 'Contemporary luxury resort with beachfront villas, infinity pools, and a world-class spa sanctuary.', 'Seascapes Resort Town', 'Mactan', 'Philippines', 5, 11000.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Private Beach', 'Spa', 'Restaurant', 'Gym', 'Free WiFi', 'Room Service']),
('Movenpick Hotel Mactan', 'Swiss hospitality meets tropical paradise with direct beach access and signature chocolate hour.', 'Punta Engaño Road', 'Mactan', 'Philippines', 5, 8500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa', 'Gym', 'Free WiFi']),
('Bluewater Maribago Resort', 'Charming beachfront resort with native-inspired architecture and excellent diving facilities.', 'Buyong, Maribago', 'Mactan', 'Philippines', 4, 5500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Dive Center', 'Restaurant', 'Free WiFi', 'Spa']),
('Costabella Tropical Beach Hotel', 'Mediterranean-inspired resort with lush gardens and a prime beachfront location.', 'Buyong', 'Mactan', 'Philippines', 4, 4800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Restaurant', 'Spa', 'Free WiFi', 'Garden']),
('Jpark Island Resort', 'All-suite luxury resort featuring waterpark attractions and premium beachfront accommodations.', 'M.L. Quezon Highway', 'Mactan', 'Philippines', 5, 10500.00, '/placeholder.svg?height=400&width=600', ARRAY['Water Park', 'Pool', 'Beach Access', 'Spa', 'Casino', 'Restaurant', 'Free WiFi']),
('Dusit Thani Mactan', 'Thai-inspired luxury with gracious hospitality, beachfront dining, and serene spa experiences.', 'Punta Engaño Road', 'Mactan', 'Philippines', 5, 9200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Spa', 'Restaurant', 'Gym', 'Free WiFi', 'Kids Club']),
('Solea Mactan Resort', 'Family-friendly resort with spacious suites and extensive recreational facilities.', 'Alegria Road, Cordova', 'Mactan', 'Philippines', 4, 6200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Restaurant', 'Kids Club', 'Free WiFi', 'Water Sports']),
('BE Resort Mactan', 'Modern beachfront hotel with infinity pool and stunning sunset views.', 'Maribago', 'Mactan', 'Philippines', 4, 4200.00, '/placeholder.svg?height=400&width=600', ARRAY['Infinity Pool', 'Beach Access', 'Restaurant', 'Bar', 'Free WiFi']),
('Pacific Cebu Resort', 'Secluded paradise with private cove and pristine coral gardens for snorkeling.', 'Suba-Basbas', 'Mactan', 'Philippines', 4, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Private Cove', 'Snorkeling', 'Restaurant', 'Free WiFi']),
('EGI Resort & Hotel', 'Value resort offering comfortable beachfront accommodations with Filipino hospitality.', 'Maribago', 'Mactan', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Restaurant', 'Free WiFi']),
('Sotogrande Hotel', 'Boutique hotel with modern amenities and convenient location near the airport.', 'Lapu-Lapu City', 'Mactan', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi', 'Airport Transfer']),
('Maribago Bluewater Beach Resort', 'Authentic Filipino resort experience with native cottages and pristine beach.', 'Maribago', 'Mactan', 'Philippines', 4, 5800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Spa', 'Restaurant', 'Free WiFi', 'Dive Center']),
('Cordova Reef Village Resort', 'Peaceful retreat with reef access and stunning views of Cebu City skyline.', 'Cordova', 'Mactan', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Reef Access', 'Restaurant', 'Free WiFi']),
('Alta Cebu Village Garden Resort', 'Garden resort offering tranquil escape with pool and lush landscaping.', 'Cordova', 'Mactan', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Garden', 'Restaurant', 'Free WiFi']),
('Tambuli Seaside Resort', 'Beachfront resort with excellent snorkeling and diving just off the shore.', 'Buyong', 'Mactan', 'Philippines', 4, 4600.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Dive Center', 'Restaurant', 'Free WiFi']),
('Cebu White Sands Resort', 'Classic beach resort with white sand beach and crystal-clear waters.', 'Maribago', 'Mactan', 'Philippines', 4, 5100.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Restaurant', 'Spa', 'Free WiFi']),
('Palm Beach Resort', 'Cozy beachfront property with palm-lined shores and relaxed atmosphere.', 'Maribago', 'Mactan', 'Philippines', 3, 2900.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Vista Mar Beach Resort', 'Scenic resort with panoramic sea views and excellent hospitality.', 'Dapdap', 'Mactan', 'Philippines', 4, 4300.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Restaurant', 'Free WiFi', 'Spa']),
('Ocean Suites Mactan', 'Modern suites with kitchenette and beach access for extended stays.', 'Punta Engaño', 'Mactan', 'Philippines', 3, 3500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Kitchenette', 'Free WiFi']),
('Mactan Tropics Beach Resort', 'Tropical getaway with authentic Filipino charm and friendly service.', 'Marigondon', 'Mactan', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Restaurant', 'Free WiFi']),
('Goldberry Suites Mactan', 'Comfortable suites near Mactan Shrine with modern amenities.', 'Lapu-Lapu City', 'Mactan', 'Philippines', 3, 2100.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi', 'Parking']),
('Savemore Beach Resort', 'Budget-friendly beach resort with basic amenities and good location.', 'Buyong', 'Mactan', 'Philippines', 2, 1500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Abaca Boutique Resort', 'Exclusive boutique resort with personalized service and private villas.', 'Punta Engaño', 'Mactan', 'Philippines', 5, 15000.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Pool', 'Beach Access', 'Spa', 'Restaurant', 'Butler Service', 'Free WiFi']),
('Maayo Hotel', 'Contemporary hotel with rooftop pool and wellness facilities.', 'Lapu-Lapu City', 'Mactan', 'Philippines', 4, 4000.00, '/placeholder.svg?height=400&width=600', ARRAY['Rooftop Pool', 'Gym', 'Restaurant', 'Free WiFi', 'Spa']),
('Bellevue Resort Mactan', 'Elegant resort with French-inspired hospitality and beachfront elegance.', 'Punta Engaño', 'Mactan', 'Philippines', 5, 8800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Spa', 'Restaurant', 'Free WiFi', 'Kids Club']),
('Kandaya Resort', 'Secluded luxury resort with pristine beach and world-class spa.', 'Daanbantayan', 'Mactan', 'Philippines', 5, 13500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Private Beach', 'Spa', 'Restaurant', 'Free WiFi', 'Yoga']),
('Mactan Newtown Beach', 'Urban beach resort in the heart of Mactan Newtown township.', 'Mactan Newtown', 'Mactan', 'Philippines', 4, 5200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi', 'Shopping']),
('Hilton Mactan Resort', 'International brand hospitality with extensive facilities and premium service.', 'Punta Engaño', 'Mactan', 'Philippines', 5, 9500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Spa', 'Restaurant', 'Gym', 'Free WiFi', 'Kids Club']),
('Days Hotel Mactan', 'Reliable accommodation with pool and convenient location.', 'Lapu-Lapu City', 'Mactan', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi', 'Parking']),
('Maribago Bay Resort', 'Charming bay-side resort with excellent diving and snorkeling.', 'Maribago', 'Mactan', 'Philippines', 4, 4400.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Dive Center', 'Restaurant', 'Free WiFi']),
('Sunset Bay Beach Resort', 'Perfect spot for watching stunning Mactan sunsets.', 'Cordova', 'Mactan', 'Philippines', 3, 3100.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Restaurant', 'Free WiFi']),
('Island Jewel Inn', 'Budget hotel offering clean rooms and island convenience.', 'Lapu-Lapu City', 'Mactan', 'Philippines', 2, 1200.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Air Conditioning', 'Parking']),
('Marco Polo Beach Resort', 'Well-appointed resort with excellent beachfront location.', 'Punta Engaño', 'Mactan', 'Philippines', 4, 5600.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Spa', 'Restaurant', 'Free WiFi']),
('Sea Breeze Mactan', 'Relaxing beachside hotel with refreshing sea breezes.', 'Maribago', 'Mactan', 'Philippines', 3, 2700.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Tropicana Ocean Villa', 'Private villa resort with personalized tropical experience.', 'Cordova', 'Mactan', 'Philippines', 4, 7500.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Pool', 'Beach Access', 'Restaurant', 'Free WiFi', 'Butler Service']),
('Isla Reef Hotel', 'Affordable reef-side accommodation for diving enthusiasts.', 'Maribago', 'Mactan', 'Philippines', 3, 2300.00, '/placeholder.svg?height=400&width=600', ARRAY['Dive Center', 'Restaurant', 'Free WiFi']),
('Paradise Garden Resort', 'Garden-view resort with tranquil atmosphere and pool.', 'Lapu-Lapu City', 'Mactan', 'Philippines', 3, 2000.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Garden', 'Restaurant', 'Free WiFi']),
('Aqua Mira Resort', 'Water-themed resort perfect for families with kids.', 'Cordova', 'Mactan', 'Philippines', 4, 4700.00, '/placeholder.svg?height=400&width=600', ARRAY['Water Park', 'Pool', 'Restaurant', 'Kids Club', 'Free WiFi']),
('Portofino Beach Resort', 'Italian-inspired beachfront property with Mediterranean flair.', 'Buyong', 'Mactan', 'Philippines', 4, 5000.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Restaurant', 'Spa', 'Free WiFi']),
('Azure Beach Club', 'Trendy beach club resort with vibrant atmosphere.', 'Maribago', 'Mactan', 'Philippines', 4, 4900.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Bar', 'Restaurant', 'Free WiFi']),
('Oceanview Lodge', 'Simple lodge with stunning ocean panoramas.', 'Cordova', 'Mactan', 'Philippines', 2, 1800.00, '/placeholder.svg?height=400&width=600', ARRAY['Ocean View', 'Restaurant', 'Free WiFi']),
('Grand Isla Mactan', 'Grand hotel with comprehensive facilities and beach access.', 'Punta Engaño', 'Mactan', 'Philippines', 4, 5400.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Spa', 'Restaurant', 'Gym', 'Free WiFi']),
('Coral Sands Resort', 'Coral-rich shoreline perfect for snorkeling adventures.', 'Maribago', 'Mactan', 'Philippines', 4, 4100.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Snorkeling', 'Restaurant', 'Free WiFi']),
('Seaside Escape Hotel', 'Peaceful seaside retreat away from the crowds.', 'Cordova', 'Mactan', 'Philippines', 3, 2850.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Restaurant', 'Free WiFi']),
('Lighthouse Point Resort', 'Unique resort near historic lighthouse with character.', 'Punta Engaño', 'Mactan', 'Philippines', 3, 3300.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Restaurant', 'Free WiFi']),
('Marina Bay Mactan', 'Modern marina-side hotel with yacht-watching views.', 'Lapu-Lapu City', 'Mactan', 'Philippines', 4, 4800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Marina Access']),
('Beachcomber Hotel', 'Laid-back beachcomber vibe with hammocks and chill atmosphere.', 'Maribago', 'Mactan', 'Philippines', 3, 2450.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Bar', 'Free WiFi']),
('Royal Mactan Resort', 'Regal resort experience with premium amenities and service.', 'Punta Engaño', 'Mactan', 'Philippines', 5, 10200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Spa', 'Restaurant', 'Gym', 'Free WiFi', 'Butler Service']);

-- =============================================
-- CEBU CITY HOTELS (50 hotels)
-- =============================================
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('Radisson Blu Cebu', 'Upscale city hotel in SM City complex with stunning city and sea views.', 'Sergio Osmeña Boulevard', 'Cebu City', 'Philippines', 5, 7500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Spa', 'Restaurant', 'Gym', 'Free WiFi', 'Business Center']),
('Marco Polo Plaza Cebu', 'Hillside luxury hotel with panoramic views of Cebu City and beyond.', 'Cebu Veterans Drive', 'Cebu City', 'Philippines', 5, 6800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Spa', 'Restaurant', 'Gym', 'Free WiFi', 'Tennis']),
('Waterfront Cebu City Hotel', 'Landmark hotel and casino with extensive entertainment options.', 'Salinas Drive', 'Cebu City', 'Philippines', 5, 5500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Casino', 'Spa', 'Restaurant', 'Gym', 'Free WiFi']),
('Seda Ayala Center Cebu', 'Contemporary hotel in the heart of Cebu Business Park.', 'Cardinal Rosales Avenue', 'Cebu City', 'Philippines', 5, 6200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Gym', 'Restaurant', 'Free WiFi', 'Business Center']),
('Quest Hotel Cebu', 'Modern hotel with rooftop pool and central location.', 'Archbishop Reyes Avenue', 'Cebu City', 'Philippines', 4, 4200.00, '/placeholder.svg?height=400&width=600', ARRAY['Rooftop Pool', 'Gym', 'Restaurant', 'Free WiFi']),
('Harolds Hotel', 'Stylish hotel in IT Park with hip dining options.', 'Gorordo Avenue', 'Cebu City', 'Philippines', 4, 3800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Bar', 'Free WiFi']),
('Bayfront Hotel Cebu', 'Harbor-view hotel near major shopping centers.', 'North Reclamation Area', 'Cebu City', 'Philippines', 4, 3500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi', 'Parking']),
('Crown Regency Hotel', 'Adventure hotel with sky experience and edge coaster.', 'Fuente Osmeña', 'Cebu City', 'Philippines', 4, 4000.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Sky Walk', 'Restaurant', 'Gym', 'Free WiFi']),
('Castle Peak Hotel', 'Value hotel with modern amenities and friendly service.', 'F. Cabahug Street', 'Cebu City', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Bai Hotel Cebu', 'Grand hotel with comprehensive facilities and city views.', 'Mandaue City', 'Cebu City', 'Philippines', 5, 5800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Spa', 'Restaurant', 'Gym', 'Free WiFi', 'Ballroom']),
('Cebu Parklane International', 'Established hotel near Fuente Osmeña Circle.', 'Fuente Osmeña', 'Cebu City', 'Philippines', 4, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Gym', 'Free WiFi']),
('The Henry Hotel', 'Boutique heritage hotel with artistic interiors.', 'Cardinal Rosales Avenue', 'Cebu City', 'Philippines', 4, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Bar', 'Free WiFi', 'Garden']),
('Montebello Villa Hotel', 'Garden hotel with Spanish colonial charm.', 'Banilad', 'Cebu City', 'Philippines', 4, 3900.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Garden', 'Restaurant', 'Free WiFi']),
('Red Planet Cebu', 'Smart budget hotel with essential amenities.', 'Fuente Osmeña', 'Cebu City', 'Philippines', 3, 1800.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Air Conditioning']),
('Sugbutel Family Hotel', 'Family-friendly hotel in the heart of the city.', 'General Maxilom Avenue', 'Cebu City', 'Philippines', 3, 2000.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Grand Convention Center Hotel', 'Large hotel ideal for events and conferences.', 'Archbishop Reyes Avenue', 'Cebu City', 'Philippines', 4, 3600.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Convention Center', 'Restaurant', 'Free WiFi']),
('Best Western Plus Metro Cebu', 'International brand hotel with consistent quality.', 'Mango Avenue', 'Cebu City', 'Philippines', 4, 3400.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Gym', 'Free WiFi']),
('Summit Circle Cebu', 'Hilltop hotel with excellent city panoramas.', 'Nivel Hills', 'Cebu City', 'Philippines', 4, 3700.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi', 'City View']),
('Alba Uno Hotel', 'Convenient hotel near IT Park and business centers.', 'IT Park', 'Cebu City', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Golden Prince Hotel', 'Mid-range hotel with comfortable rooms and good location.', 'Colon Street', 'Cebu City', 'Philippines', 3, 2100.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Lancaster Hotel Cebu', 'Modern hotel in Mango Square entertainment area.', 'Mango Square', 'Cebu City', 'Philippines', 3, 2300.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Hotel Elizabeth Cebu', 'Elegant hotel with refined service and dining.', 'Archbishop Reyes Avenue', 'Cebu City', 'Philippines', 4, 4100.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('Mayflower Inn', 'Budget-friendly inn with basic amenities.', 'Colon Street', 'Cebu City', 'Philippines', 2, 1200.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Air Conditioning']),
('Orchard Hotel Cebu', 'Comfortable hotel near shopping and dining.', 'AS Fortuna Street', 'Cebu City', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Cebu Grand Hotel', 'Grand hotel with spacious rooms and amenities.', 'N. Escario Street', 'Cebu City', 'Philippines', 4, 3100.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Gym', 'Free WiFi']),
('Eco Hotel Cebu', 'Environmentally conscious hotel with green practices.', 'Banilad', 'Cebu City', 'Philippines', 3, 1900.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Eco-Friendly', 'Garden']),
('Diplomat Hotel', 'Classic hotel with diplomatic service standards.', 'F. Ramos Street', 'Cebu City', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Mandarin Plaza Hotel', 'Asian-inspired hotel with excellent Chinese restaurant.', 'Fuente Osmeña', 'Cebu City', 'Philippines', 4, 3300.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Hotel Stella', 'Boutique hotel with personal touch and modern design.', 'Gorordo Avenue', 'Cebu City', 'Philippines', 3, 2700.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Sarrosa International Hotel', 'International standard hotel with comprehensive facilities.', 'Gorordo Avenue', 'Cebu City', 'Philippines', 4, 3500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Gym', 'Restaurant', 'Free WiFi', 'Spa']),
('Alpa City Suites', 'All-suite hotel perfect for extended stays.', 'Banilad', 'Cebu City', 'Philippines', 4, 3800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Kitchenette', 'Restaurant', 'Free WiFi']),
('Holiday Spa Hotel', 'Relaxation-focused hotel with spa services.', 'Mango Avenue', 'Cebu City', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('The Northwinds Hotel', 'Northern Cebu hotel with cool mountain breeze.', 'Banilad', 'Cebu City', 'Philippines', 3, 2100.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Park Inn by Radisson Cebu', 'International chain hotel with reliable service.', 'Archbishop Reyes Avenue', 'Cebu City', 'Philippines', 4, 4200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Gym', 'Free WiFi']),
('Go Hotels Cebu', 'Smart budget accommodation with clean rooms.', 'N. Escario Street', 'Cebu City', 'Philippines', 2, 1400.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Air Conditioning']),
('Pillows Hotel Cebu', 'Cozy hotel focused on sleep quality.', 'IT Park', 'Cebu City', 'Philippines', 3, 2300.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Restaurant']),
('TGU Tower Hotel', 'Tall hotel with city views from every room.', 'Lahug', 'Cebu City', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi', 'City View']),
('Azure Hotel Cebu', 'Modern hotel with blue-themed interiors.', 'Mabolo', 'Cebu City', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Wellcome Hotel', 'Welcoming hotel with warm Filipino hospitality.', 'Fuente Osmeña', 'Cebu City', 'Philippines', 3, 2000.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('AAA Suites', 'Affordable suites for business and leisure.', 'AS Fortuna Street', 'Cebu City', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Kitchenette', 'Free WiFi']),
('Cityscape Hotel', 'Urban hotel with contemporary design.', 'IT Park', 'Cebu City', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Cebu Rossini Hotel', 'Italian-named hotel with European touches.', 'Gorordo Avenue', 'Cebu City', 'Philippines', 3, 2300.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Verbena Hotel', 'Garden-inspired hotel with fresh atmosphere.', 'Banilad', 'Cebu City', 'Philippines', 3, 2100.00, '/placeholder.svg?height=400&width=600', ARRAY['Garden', 'Restaurant', 'Free WiFi']),
('Avenue Suites', 'Central suites on main avenue with easy access.', 'Fuente Osmeña', 'Cebu City', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('La Guardia Hotel', 'Spanish-inspired hotel with courtyard.', 'Lahug', 'Cebu City', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Courtyard', 'Restaurant', 'Free WiFi']),
('City Center Hotel', 'Prime location in the city center.', 'Colon Street', 'Cebu City', 'Philippines', 3, 1900.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Megaworld Hotel', 'Hotel in Megaworld township development.', 'Mandaue Reclamation', 'Cebu City', 'Philippines', 4, 4000.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Gym', 'Free WiFi']),
('Winzelle Suites', 'Comfortable suites for the discerning traveler.', 'Mabolo', 'Cebu City', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Kitchenette', 'Free WiFi']),
('The Maxwell Hotel', 'Sophisticated hotel with business amenities.', 'Archbishop Reyes Avenue', 'Cebu City', 'Philippines', 4, 4300.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Business Center', 'Restaurant', 'Gym', 'Free WiFi']);

-- =============================================
-- BOHOL HOTELS (50 hotels)
-- =============================================
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('Amorita Resort', 'Cliff-top boutique resort with stunning views over Alona Beach and Bohol Sea.', 'Alona Beach, Panglao', 'Bohol', 'Philippines', 5, 8500.00, '/placeholder.svg?height=400&width=600', ARRAY['Infinity Pool', 'Spa', 'Restaurant', 'Dive Center', 'Free WiFi']),
('Henann Resort Alona Beach', 'Large beachfront resort with multiple pools and direct beach access.', 'Alona Beach, Panglao', 'Bohol', 'Philippines', 5, 7200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Spa', 'Restaurant', 'Free WiFi']),
('The Bellevue Resort', 'Elegant resort with 1.5 km private beach and world-class facilities.', 'Panglao Island', 'Bohol', 'Philippines', 5, 9500.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Beach', 'Pool', 'Spa', 'Restaurant', 'Free WiFi', 'Kids Club']),
('South Palms Resort', 'Tropical paradise with powdery white sand beach and coconut groves.', 'Bolod Beach, Panglao', 'Bohol', 'Philippines', 5, 8000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('Bohol Beach Club', 'Classic beach resort with excellent diving and snorkeling.', 'Bolod Beach, Panglao', 'Bohol', 'Philippines', 4, 5500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Dive Center', 'Restaurant', 'Free WiFi']),
('Amarela Resort', 'Heritage resort with Filipino hacienda architecture and cultural charm.', 'Doljo Beach, Panglao', 'Bohol', 'Philippines', 4, 6200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('Eskaya Beach Resort', 'Ultra-luxury resort with indigenous-inspired villas and private beach.', 'Bolod Beach, Panglao', 'Bohol', 'Philippines', 5, 25000.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Beach', 'Pool', 'Spa', 'Restaurant', 'Butler Service', 'Free WiFi']),
('Modala Beach Resort', 'Mediterranean-inspired resort with azure pool and beach club.', 'Danao Beach, Panglao', 'Bohol', 'Philippines', 4, 5800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Bar', 'Free WiFi']),
('Bluewater Panglao', 'Expansive resort with longest beachfront in Panglao.', 'Sitio Daurong, Panglao', 'Bohol', 'Philippines', 5, 7800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Dive Center', 'Free WiFi']),
('Mithi Resort & Spa', 'Secluded luxury resort with stilted cottages over mangroves.', 'Dauis, Panglao', 'Bohol', 'Philippines', 5, 10500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Spa', 'Restaurant', 'Free WiFi', 'Kayaking']),
('Panglao Regents Park', 'Well-appointed resort with infinity pool and garden setting.', 'Panglao Island', 'Bohol', 'Philippines', 4, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Garden', 'Restaurant', 'Free WiFi']),
('Anda Beach Resort', 'Pristine beach resort in unspoiled Anda.', 'Anda', 'Bohol', 'Philippines', 4, 4200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Loboc River Resort', 'Unique riverside resort near famous Loboc River cruise.', 'Loboc', 'Bohol', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'River View', 'Restaurant', 'Free WiFi']),
('Chocolate Hills Complex', 'Resort with views of the famous Chocolate Hills.', 'Carmen', 'Bohol', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Scenic View', 'Restaurant', 'Free WiFi']),
('Ocean Suite Panglao', 'Modern suites with ocean views and beach proximity.', 'Alona Beach', 'Bohol', 'Philippines', 4, 4800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Beach Access', 'Restaurant', 'Free WiFi']),
('Flower Garden Resort', 'Charming garden resort a short walk from Alona Beach.', 'Alona Beach', 'Bohol', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Garden', 'Restaurant', 'Free WiFi']),
('Alona Tropical Beach Resort', 'Mid-range beachfront resort with tropical vibes.', 'Alona Beach', 'Bohol', 'Philippines', 3, 3500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Tierra Azul Beach Resort', 'Boutique resort with turquoise waters and white sand.', 'Danao', 'Bohol', 'Philippines', 4, 5200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Be Grand Resort', 'Contemporary resort with exceptional pool and beach combo.', 'Panglao Island', 'Bohol', 'Philippines', 4, 6500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Spa', 'Free WiFi']),
('Alona Kew White Beach', 'Budget-friendly resort right on Alona Beach.', 'Alona Beach', 'Bohol', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Lost Horizon Resort', 'Diving-focused resort with PADI center.', 'Alona Beach', 'Bohol', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Restaurant', 'Free WiFi']),
('Vida Homes Condo Resort', 'Condo-style accommodations near the beach.', 'Panglao Island', 'Bohol', 'Philippines', 3, 3000.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Kitchenette', 'Free WiFi']),
('Oasis Resort', 'Peaceful oasis away from crowded Alona.', 'Dauis', 'Bohol', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Garden', 'Restaurant', 'Free WiFi']),
('Linaw Beach Resort', 'Secluded resort with calm waters for swimming.', 'Linaw', 'Bohol', 'Philippines', 4, 4800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi', 'Kayaking']),
('Donatella Resort', 'Italian-inspired boutique resort with excellent cuisine.', 'Panglao Island', 'Bohol', 'Philippines', 4, 5500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Spa', 'Free WiFi']),
('Palm Island Hotel', 'Affordable hotel with palm-shaded grounds.', 'Tagbilaran', 'Bohol', 'Philippines', 3, 2100.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Tagbilaran City Hotel', 'City hotel convenient for Bohol exploration.', 'Tagbilaran', 'Bohol', 'Philippines', 3, 1800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Metrocentre Hotel', 'Business hotel in Tagbilaran city center.', 'Tagbilaran', 'Bohol', 'Philippines', 3, 2000.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Business Center', 'Free WiFi']),
('Virgin Island Excursion Resort', 'Access point for famous Virgin Island sandbar.', 'Panglao', 'Bohol', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi', 'Island Tours']),
('Sunset Cove Resort', 'Beautiful sunset views over Bohol Sea.', 'Panglao', 'Bohol', 'Philippines', 3, 3100.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Twin Tides Resort', 'Beachfront resort with tidal pool and snorkeling.', 'Anda', 'Bohol', 'Philippines', 4, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Snorkeling', 'Restaurant', 'Free WiFi']),
('Marquis Sunrise Sunset', 'Dual-view resort for both sunrise and sunset.', 'Bolod Beach', 'Bohol', 'Philippines', 4, 5000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Isola di Francesca Resort', 'Italian-Filipino fusion resort with charming villas.', 'Bolod Beach', 'Bohol', 'Philippines', 4, 5800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Garden', 'Restaurant', 'Free WiFi']),
('The Ananyana Beach Resort', 'Eco-luxury resort with organic architecture.', 'Doljo Beach', 'Bohol', 'Philippines', 5, 12000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Free WiFi', 'Eco-Friendly']),
('Pam''s Pension House', 'Budget accommodation in Tagbilaran.', 'Tagbilaran', 'Bohol', 'Philippines', 2, 1200.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Air Conditioning']),
('Dumaluan Beach Resort', 'Family-friendly resort on famous Dumaluan Beach.', 'Dumaluan', 'Bohol', 'Philippines', 4, 4200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Kids Club', 'Restaurant', 'Free WiFi']),
('Crystal Paradise Resort', 'Crystal-clear waters and white sand paradise.', 'Bolod', 'Bohol', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Tarsier Botanika', 'Nature resort near Tarsier Sanctuary.', 'Loboc', 'Bohol', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Garden', 'Restaurant', 'Free WiFi', 'Eco Tours']),
('Palm Beach Resort Bohol', 'Classic palm-lined beach resort.', 'Doljo Beach', 'Bohol', 'Philippines', 3, 2900.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Balicasag Island Dive Resort', 'Premier diving resort near famous Balicasag Island.', 'Panglao', 'Bohol', 'Philippines', 4, 5200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Restaurant', 'Free WiFi']),
('Bohol Sunside Resort', 'Sunny resort with excellent pool complex.', 'Panglao', 'Bohol', 'Philippines', 3, 2700.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('La Pernela Beachfront Resort', 'Affordable beachfront with native cottages.', 'Dumaluan', 'Bohol', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Bohol Tropics Resort', 'Tropical getaway with lush gardens.', 'Tagbilaran', 'Bohol', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Garden', 'Restaurant', 'Free WiFi']),
('Gie Gardens Hotel', 'Garden hotel in Tagbilaran city.', 'Tagbilaran', 'Bohol', 'Philippines', 3, 1900.00, '/placeholder.svg?height=400&width=600', ARRAY['Garden', 'Restaurant', 'Free WiFi']),
('Nisa Travellers Hotel', 'Convenient hotel for travelers exploring Bohol.', 'Tagbilaran', 'Bohol', 'Philippines', 3, 1700.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Tour Desk']),
('Comscentre Hotel', 'Modern hotel in commercial center.', 'Tagbilaran', 'Bohol', 'Philippines', 3, 2000.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Bizotel Premier', 'Premier business hotel in Tagbilaran.', 'Tagbilaran', 'Bohol', 'Philippines', 4, 3500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Business Center', 'Restaurant', 'Free WiFi']),
('Blue Water Lodge', 'Simple lodge with sea views.', 'Dauis', 'Bohol', 'Philippines', 2, 1400.00, '/placeholder.svg?height=400&width=600', ARRAY['Sea View', 'Restaurant', 'Free WiFi']),
('Bohol Sea Resort', 'Beachfront resort with excellent sea access.', 'Panglao', 'Bohol', 'Philippines', 4, 4600.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Cebu Country Club Bohol', 'Golf resort with championship course.', 'Panglao', 'Bohol', 'Philippines', 4, 6000.00, '/placeholder.svg?height=400&width=600', ARRAY['Golf Course', 'Pool', 'Restaurant', 'Free WiFi']);

-- =============================================
-- BORACAY HOTELS (50 hotels)
-- =============================================
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('Shangri-La Boracay', 'Ultra-luxury resort with private beach cove and world-class amenities.', 'Barangay Yapak', 'Boracay', 'Philippines', 5, 22000.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Beach', 'Pool', 'Spa', 'Restaurant', 'Kids Club', 'Free WiFi']),
('Discovery Shores Boracay', 'Award-winning resort on Station 1 with butler service.', 'Station 1', 'Boracay', 'Philippines', 5, 18500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Butler Service', 'Free WiFi']),
('The Lind Boracay', 'Sophisticated beachfront resort with stunning contemporary design.', 'Station 1', 'Boracay', 'Philippines', 5, 15000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('Henann Prime Beach Resort', 'Premium resort with the largest pool in Boracay.', 'Station 1', 'Boracay', 'Philippines', 5, 12000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Large Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('Henann Crystal Sands Resort', 'Contemporary resort with excellent beachfront location.', 'Station 1', 'Boracay', 'Philippines', 5, 11000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('Movenpick Resort Boracay', 'Swiss hospitality with signature chocolate hour and beach access.', 'Station 2', 'Boracay', 'Philippines', 5, 10500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('Crimson Resort Boracay', 'Luxury resort with spectacular crimson sunset views.', 'Boracay Newcoast', 'Boracay', 'Philippines', 5, 13500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Casino', 'Free WiFi']),
('Astoria Boracay', 'Modern resort with private beach and excellent service.', 'Station 1', 'Boracay', 'Philippines', 4, 8500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('Two Seasons Boracay', 'Cliff-side resort with infinity pool and panoramic views.', 'Bulabog Beach', 'Boracay', 'Philippines', 4, 9200.00, '/placeholder.svg?height=400&width=600', ARRAY['Infinity Pool', 'Spa', 'Restaurant', 'Free WiFi', 'Kite Surfing']),
('Ambassador in Paradise', 'Intimate boutique resort on the quiet end of White Beach.', 'Station 3', 'Boracay', 'Philippines', 4, 7500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Alta Vista de Boracay', 'Hilltop hotel with spectacular island views.', 'Balabag', 'Boracay', 'Philippines', 4, 6800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi', 'Island View']),
('Surfside Boracay Resort', 'Kiteboarding-focused resort on Bulabog Beach.', 'Bulabog Beach', 'Boracay', 'Philippines', 4, 5500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Kite Center', 'Restaurant', 'Free WiFi']),
('7Stones Boracay Suites', 'Stylish suites with rooftop pool and lounge.', 'Station 2', 'Boracay', 'Philippines', 4, 6200.00, '/placeholder.svg?height=400&width=600', ARRAY['Rooftop Pool', 'Restaurant', 'Bar', 'Free WiFi']),
('Coast Boracay', 'Beachfront property with excellent dining options.', 'Station 2', 'Boracay', 'Philippines', 4, 7000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Bar', 'Free WiFi']),
('Jony''s Beach Resort', 'Long-established resort with prime Station 1 location.', 'Station 1', 'Boracay', 'Philippines', 4, 5800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Paradise Garden Resort', 'Garden oasis with pool and easy beach access.', 'Station 2', 'Boracay', 'Philippines', 3, 4200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Garden', 'Restaurant', 'Free WiFi']),
('Boracay Mandarin Island Hotel', 'Asian-inspired hotel in the heart of Station 2.', 'Station 2', 'Boracay', 'Philippines', 4, 5500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('White House Beach Resort', 'Classic white-washed resort with beachfront charm.', 'Station 1', 'Boracay', 'Philippines', 3, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Pinjalo Resort', 'Hillside resort with stunning views and shuttle to beach.', 'Balabag', 'Boracay', 'Philippines', 4, 5000.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi', 'Beach Shuttle']),
('Boracay Ocean Club', 'Premium beach club resort with party atmosphere.', 'Station 2', 'Boracay', 'Philippines', 4, 6500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Bar', 'Restaurant', 'Free WiFi']),
('Grand Boracay Resort', 'Grand resort with comprehensive facilities.', 'Station 2', 'Boracay', 'Philippines', 4, 5200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Gym', 'Free WiFi']),
('Willy''s Beach Hotel', 'Iconic hotel at the famous Willy''s Rock.', 'Station 1', 'Boracay', 'Philippines', 4, 7200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Nami Boracay', 'Japanese-inspired resort with zen atmosphere.', 'Station 1', 'Boracay', 'Philippines', 4, 8000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('La Carmela de Boracay', 'Mediterranean-style resort with warm hospitality.', 'Station 2', 'Boracay', 'Philippines', 4, 4800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Fairways & Bluewater', 'Golf resort with beach club access.', 'Newcoast', 'Boracay', 'Philippines', 4, 6800.00, '/placeholder.svg?height=400&width=600', ARRAY['Golf Course', 'Pool', 'Beach Club', 'Restaurant', 'Free WiFi']),
('Hey Jude South Beach', 'Trendy resort on the quiet south end.', 'Station 3', 'Boracay', 'Philippines', 4, 5000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Bar', 'Free WiFi']),
('Boracay Peninsula Resort', 'Family-friendly resort with kids'' activities.', 'Station 2', 'Boracay', 'Philippines', 3, 3800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Kids Club', 'Restaurant', 'Free WiFi']),
('Red Coconut Beach Hotel', 'Vibrant beachfront hotel with excellent location.', 'Station 2', 'Boracay', 'Philippines', 3, 3500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Boracay Tropics Resort', 'Tropical resort with palm-shaded pool area.', 'Station 2', 'Boracay', 'Philippines', 4, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('True Home Hotel', 'Cozy hotel feel like home away from home.', 'Station 2', 'Boracay', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Sur Beach Resort', 'Beach resort on southern end with fewer crowds.', 'Station 3', 'Boracay', 'Philippines', 3, 3000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Azure Urban Resort', 'Modern urban-style resort near D''Mall.', 'Station 2', 'Boracay', 'Philippines', 3, 3400.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Boracay Haven Suites', 'Peaceful suites away from the bustle.', 'Balabag', 'Boracay', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Kitchenette', 'Free WiFi']),
('Hannah Hotel', 'Budget-friendly hotel with good amenities.', 'Station 2', 'Boracay', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Ferra Hotel Boracay', 'Contemporary hotel with rooftop jacuzzi.', 'Station 2', 'Boracay', 'Philippines', 3, 3600.00, '/placeholder.svg?height=400&width=600', ARRAY['Rooftop Jacuzzi', 'Restaurant', 'Free WiFi']),
('Lingganay Boracay', 'Boutique resort with charming interiors.', 'Station 3', 'Boracay', 'Philippines', 3, 3300.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Villa Caemilla Beach Hotel', 'Intimate beachfront boutique hotel.', 'Station 3', 'Boracay', 'Philippines', 4, 5500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Station X Resort', 'Hip resort popular with younger travelers.', 'Station 2', 'Boracay', 'Philippines', 3, 2900.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Bar', 'Restaurant', 'Free WiFi']),
('Moreno Hotel', 'Simple hotel with easy beach access.', 'Station 2', 'Boracay', 'Philippines', 2, 2000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Villa de Oro Beach Resort', 'Golden beachfront resort with sunset views.', 'Station 1', 'Boracay', 'Philippines', 4, 6000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Boracay Ecovillage Resort', 'Eco-friendly resort with sustainable practices.', 'Bulabog', 'Boracay', 'Philippines', 3, 3100.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Garden', 'Restaurant', 'Free WiFi', 'Eco-Friendly']),
('MNL Boutique Hostel', 'Trendy hostel for backpackers and solo travelers.', 'Station 2', 'Boracay', 'Philippines', 2, 1500.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Common Area', 'Bar']),
('Island Nook Hotel', 'Cozy nook hotel with personal service.', 'Station 2', 'Boracay', 'Philippines', 3, 2700.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Aqua Boracay', 'Water-themed resort with excellent pools.', 'Station 3', 'Boracay', 'Philippines', 4, 5200.00, '/placeholder.svg?height=400&width=600', ARRAY['Multiple Pools', 'Beach Access', 'Restaurant', 'Free WiFi']),
('Summer Place Hotel', 'Eternal summer vibes with colorful design.', 'Station 2', 'Boracay', 'Philippines', 3, 3000.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Palm Breeze Villa', 'Private villa experience with personalized service.', 'Balabag', 'Boracay', 'Philippines', 4, 8500.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Pool', 'Butler Service', 'Free WiFi']),
('Lazy Dog Bed & Breakfast', 'Charming B&B with kiteboarding lessons.', 'Bulabog Beach', 'Boracay', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Breakfast', 'Kite Center', 'Free WiFi']),
('Tides Boracay', 'Beachfront resort with tidal pool experiences.', 'Station 1', 'Boracay', 'Philippines', 4, 7500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Spa', 'Free WiFi']),
('Casa Pilar Beach Resort', 'Family-owned resort with authentic Filipino warmth.', 'Station 3', 'Boracay', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']);

-- =============================================
-- BAGUIO HOTELS (50 hotels)
-- =============================================
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('The Manor at Camp John Hay', 'Elegant mountain lodge in the pine-covered Camp John Hay estate.', 'Camp John Hay', 'Baguio', 'Philippines', 5, 8500.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Spa', 'Golf Course', 'Free WiFi', 'Mountain View']),
('Baguio Country Club', 'Historic club hotel with championship golf course.', 'Country Club Road', 'Baguio', 'Philippines', 4, 6500.00, '/placeholder.svg?height=400&width=600', ARRAY['Golf Course', 'Pool', 'Restaurant', 'Free WiFi']),
('Azalea Residences', 'Modern suites with kitchen facilities and city views.', 'Leonard Wood Road', 'Baguio', 'Philippines', 4, 5200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Gym', 'Restaurant', 'Free WiFi', 'Kitchenette']),
('Le Monet Hotel', 'French-inspired boutique hotel with artistic flair.', 'Ordonio Drive', 'Baguio', 'Philippines', 4, 4800.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Bar', 'Free WiFi', 'Art Gallery']),
('Forest Lodge at Camp John Hay', 'Cozy lodge nestled among pine trees.', 'Camp John Hay', 'Baguio', 'Philippines', 4, 5500.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Hiking', 'Free WiFi', 'Forest View']),
('Hotel & Restaurant & Conference Center', 'Premier conference venue with mountain views.', 'South Drive', 'Baguio', 'Philippines', 4, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Conference Center', 'Restaurant', 'Free WiFi']),
('Baguio Crown Legacy Hotel', 'Modern hotel near Session Road.', 'Legarda Road', 'Baguio', 'Philippines', 4, 3800.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Parking']),
('Hotel Elizabeth Baguio', 'Elegant hotel with excellent dining options.', 'Gibraltar Road', 'Baguio', 'Philippines', 4, 4200.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Spa', 'Free WiFi']),
('Grand Sierra Pines', 'Resort-style hotel with pine forest setting.', 'Camp 7', 'Baguio', 'Philippines', 4, 4000.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi', 'Garden']),
('Microtel by Wyndham Baguio', 'International chain hotel with reliable comfort.', 'Upper Session Road', 'Baguio', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Parking']),
('Chalet Baguio', 'Swiss-inspired chalet with mountain ambiance.', 'Camp John Hay', 'Baguio', 'Philippines', 4, 5000.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Fireplace', 'Free WiFi', 'Mountain View']),
('Baguio Burnham Suites', 'Suites overlooking Burnham Park.', 'Calderon Road', 'Baguio', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Park View']),
('Venus Parkview Hotel', 'City hotel with views of Burnham Park.', 'Session Road', 'Baguio', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Casa Vallejo', 'Heritage boutique hotel built in 1909.', 'Upper Session Road', 'Baguio', 'Philippines', 4, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Bar', 'Free WiFi', 'Historic']),
('Baguio Village Inn', 'Cozy inn near Session Road shopping.', 'Governor Pack Road', 'Baguio', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Newtown Plaza Hotel', 'Central hotel near Baguio Cathedral.', 'Abanao Street', 'Baguio', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Pine Breeze Cottages', 'Cottage-style accommodation among pine trees.', 'Outlook Drive', 'Baguio', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Garden', 'Free WiFi', 'Mountain View']),
('Baguio City Hotel', 'Affordable city center accommodation.', 'Session Road', 'Baguio', 'Philippines', 2, 1800.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi']),
('Hotel & Suites Baguio', 'Suite accommodations with mountain views.', 'Leonard Wood Road', 'Baguio', 'Philippines', 3, 3000.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Kitchenette']),
('Ridgewood Residences', 'Residential-style hotel with homey feel.', 'Camp 7', 'Baguio', 'Philippines', 3, 2700.00, '/placeholder.svg?height=400&width=600', ARRAY['Kitchenette', 'Free WiFi', 'Garden']),
('The Essentials Hotel', 'No-frills hotel with all essentials covered.', 'Magsaysay Avenue', 'Baguio', 'Philippines', 3, 2100.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Air Conditioning']),
('Safari Lodge Baguio', 'Unique safari-themed lodge experience.', 'Leonard Wood Road', 'Baguio', 'Philippines', 3, 3500.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Themed Rooms']),
('Baguio Holiday Villas', 'Villa-style accommodations for families.', 'Camp 7', 'Baguio', 'Philippines', 4, 5800.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Villa', 'Kitchen', 'Free WiFi', 'Garden']),
('Inn Rocio', 'Budget inn with mountain ambiance.', 'Outlook Drive', 'Baguio', 'Philippines', 2, 1500.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Mountain View']),
('Camp 7 Garden Resort', 'Garden resort with cool Baguio climate.', 'Camp 7', 'Baguio', 'Philippines', 3, 2900.00, '/placeholder.svg?height=400&width=600', ARRAY['Garden', 'Restaurant', 'Free WiFi']),
('Citylight Hotel', 'City hotel with bright modern rooms.', 'Session Road', 'Baguio', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Baguio Travellers Inn', 'Budget-friendly for travelers.', 'Abanao Extension', 'Baguio', 'Philippines', 2, 1600.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi']),
('Alto Pension House', 'Hillside pension with city views.', 'Alto', 'Baguio', 'Philippines', 2, 1400.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'City View']),
('Baguio Premiere Hotel', 'Premiere accommodations near Burnham Park.', 'Harrison Road', 'Baguio', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Golden Pine Hotel', 'Golden hospitality among the pines.', 'Camp John Hay', 'Baguio', 'Philippines', 4, 4200.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Pine Forest']),
('Mountain Haven', 'Haven in the mountains with serene atmosphere.', 'Outlook Drive', 'Baguio', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Garden', 'Restaurant', 'Free WiFi']),
('Baguio Eco Hotel', 'Environmentally conscious accommodation.', 'Leonard Wood Road', 'Baguio', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Eco-Friendly']),
('Pine City Hotel', 'City convenience with pine-scented air.', 'Session Road', 'Baguio', 'Philippines', 3, 2300.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Heritage Mansion', 'Heritage house converted to boutique hotel.', 'Leonard Wood Road', 'Baguio', 'Philippines', 4, 4800.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Historic']),
('Upland Hotel', 'Upland accommodations with cool climate.', 'Bokawkan Road', 'Baguio', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Baguio Transient House', 'Group-friendly transient house.', 'Camp 7', 'Baguio', 'Philippines', 2, 1200.00, '/placeholder.svg?height=400&width=600', ARRAY['Kitchen', 'Free WiFi']),
('Maryknoll Retreat House', 'Peaceful retreat for reflection.', 'Camp John Hay', 'Baguio', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Chapel', 'Garden', 'Free WiFi']),
('La Trinidad Hotel', 'Near La Trinidad strawberry farms.', 'La Trinidad', 'Baguio', 'Philippines', 3, 2100.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Cool Breeze Hotel', 'Cool breeze comfort in the highlands.', 'Bokawkan Road', 'Baguio', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Mountain View']),
('Baguio Terraces Hotel', 'Terraced hotel on the mountainside.', 'Outlook Drive', 'Baguio', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Terrace']),
('Highland Gardens', 'Garden hotel in the highlands.', 'Camp 7', 'Baguio', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Garden', 'Restaurant', 'Free WiFi']),
('Session Suites', 'Suites along famous Session Road.', 'Session Road', 'Baguio', 'Philippines', 3, 2900.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Kitchenette']),
('Baguio Pines Hotel', 'Classic pine setting accommodation.', 'South Drive', 'Baguio', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Pine Forest']),
('Cloud Nine Hotel', 'Feel on cloud nine in the mountains.', 'Upper Session Road', 'Baguio', 'Philippines', 3, 2700.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Mountain View']),
('Strawberry Farm Resort', 'Near strawberry farms with garden setting.', 'La Trinidad', 'Baguio', 'Philippines', 3, 3000.00, '/placeholder.svg?height=400&width=600', ARRAY['Garden', 'Restaurant', 'Free WiFi', 'Farm Tours']),
('Diplomat Hotel Baguio', 'Historic building with mysterious charm.', 'Dominican Hill', 'Baguio', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Historic']),
('Minesview Park Hotel', 'Near famous Mines View observation deck.', 'Mines View', 'Baguio', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Scenic View']),
('Wright Park Lodge', 'Near Wright Park and horse stables.', 'Wright Park', 'Baguio', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi', 'Horseback Riding']),
('Botanical Garden Inn', 'Near the Botanical Garden attraction.', 'Leonard Wood Road', 'Baguio', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Garden', 'Free WiFi']),
('The Peak Baguio', 'Peak accommodations with summit views.', 'Outlook Drive', 'Baguio', 'Philippines', 4, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Spa', 'Free WiFi', 'Summit View']);

-- =============================================
-- Additional locations: Palawan, Moalboal, Camotes, Ilo-ilo, Bantayan, Oslob, Badian
-- (Adding 20 hotels each to keep script manageable)
-- =============================================

-- PALAWAN HOTELS (20 hotels)
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('El Nido Resorts Pangulasian', 'Eco-luxury resort on private island with pristine beach.', 'Pangulasian Island', 'Palawan', 'Philippines', 5, 35000.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Beach', 'Pool', 'Spa', 'Restaurant', 'Diving', 'Free WiFi']),
('El Nido Resorts Lagen Island', 'Forest resort on lagoon-side island sanctuary.', 'Lagen Island', 'Palawan', 'Philippines', 5, 28000.00, '/placeholder.svg?height=400&width=600', ARRAY['Lagoon Access', 'Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('Two Seasons Coron Island', 'Secluded island resort with overwater bungalows.', 'Coron', 'Palawan', 'Philippines', 5, 22000.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Beach', 'Overwater Villas', 'Spa', 'Restaurant', 'Free WiFi']),
('Club Paradise Palawan', 'Diving paradise resort in Dimakya Island.', 'Dimakya Island', 'Palawan', 'Philippines', 4, 12000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Pool', 'Restaurant', 'Free WiFi']),
('Sheridan Beach Resort', 'Beachfront resort with Underground River access.', 'Sabang Beach', 'Palawan', 'Philippines', 4, 6500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Astoria Palawan', 'Modern resort near Puerto Princesa.', 'Puerto Princesa', 'Palawan', 'Philippines', 4, 5500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Spa', 'Free WiFi']),
('Cadlao Resort El Nido', 'Beachfront resort with Cadlao Island views.', 'El Nido', 'Palawan', 'Philippines', 4, 7500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Sunlight Guest Hotel', 'Budget-friendly hotel in Puerto Princesa.', 'Puerto Princesa', 'Palawan', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Corong Corong Beach Resort', 'Quiet beach resort south of El Nido.', 'Corong Corong', 'Palawan', 'Philippines', 3, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Princesa Garden Island Resort', 'Garden resort in the city with pool.', 'Puerto Princesa', 'Palawan', 'Philippines', 4, 4800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Garden', 'Restaurant', 'Free WiFi']),
('Busuanga Bay Lodge', 'Exclusive lodge in Busuanga with safari experience.', 'Busuanga', 'Palawan', 'Philippines', 4, 8500.00, '/placeholder.svg?height=400&width=600', ARRAY['Safari', 'Pool', 'Restaurant', 'Free WiFi']),
('Coron Westown Resort', 'Town resort with pool and dive center.', 'Coron Town', 'Palawan', 'Philippines', 3, 3500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Dive Center', 'Restaurant', 'Free WiFi']),
('El Nido Cove Resort', 'Cove resort with stunning limestone cliffs.', 'El Nido', 'Palawan', 'Philippines', 4, 8000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Port Barton Beach Resort', 'Laid-back resort in unspoiled Port Barton.', 'Port Barton', 'Palawan', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('San Vicente Beachfront', 'Long Beach resort on 14km beach.', 'San Vicente', 'Palawan', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Huma Island Resort', 'Private island luxury near Busuanga.', 'Busuanga', 'Palawan', 'Philippines', 5, 18000.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Beach', 'Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('Discovery Island Resort', 'Discovery resort with island-hopping.', 'Coron', 'Palawan', 'Philippines', 3, 3800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Island Tours', 'Restaurant', 'Free WiFi']),
('Microtel Puerto Princesa', 'Reliable chain hotel in city center.', 'Puerto Princesa', 'Palawan', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Go Hotels Puerto Princesa', 'Budget accommodation in the city.', 'Puerto Princesa', 'Palawan', 'Philippines', 2, 1500.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Air Conditioning']),
('Qi Palawan', 'Eco-friendly resort near Underground River.', 'Sabang', 'Palawan', 'Philippines', 4, 5500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Spa', 'Restaurant', 'Free WiFi', 'Eco-Friendly']);

-- MOALBOAL HOTELS (20 hotels)
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('Moalboal Tropics Resort', 'Diving resort with sardine run access.', 'Panagsama Beach', 'Moalboal', 'Philippines', 4, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Pool', 'Restaurant', 'Free WiFi']),
('Dolphin House Resort', 'Beachfront resort popular with divers.', 'Panagsama Beach', 'Moalboal', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Restaurant', 'Free WiFi']),
('Kasai Village Beach Resort', 'Luxury diving resort with spa.', 'Basdiot', 'Moalboal', 'Philippines', 4, 5800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Spa', 'Pool', 'Restaurant', 'Free WiFi']),
('Club Serena Resort', 'Serene resort with white sand beach.', 'Basdiot', 'Moalboal', 'Philippines', 4, 5200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Blue Abyss Dive Resort', 'Dive-focused resort with excellent house reef.', 'Panagsama Beach', 'Moalboal', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Restaurant', 'Free WiFi']),
('Savedra Beach Resort', 'PADI 5-star dive resort.', 'Panagsama Beach', 'Moalboal', 'Philippines', 4, 4200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Pool', 'Restaurant', 'Free WiFi']),
('Ocean Bay Beach Resort', 'Bay-side resort with calm waters.', 'Basdiot', 'Moalboal', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Cabana Beach Resort', 'Cabana-style accommodations on the beach.', 'Panagsama Beach', 'Moalboal', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Moalboal Backpacker Lodge', 'Budget accommodation for backpackers.', 'Panagsama Beach', 'Moalboal', 'Philippines', 2, 800.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Common Area']),
('Quo Vadis Dive Resort', 'Boutique dive resort with excellent service.', 'Basdiot', 'Moalboal', 'Philippines', 4, 4800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Pool', 'Restaurant', 'Free WiFi']),
('White Beach Resort Moalboal', 'White sand beach access in Moalboal.', 'White Beach', 'Moalboal', 'Philippines', 3, 3500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Dive Point Resort', 'Point resort with sardine and turtle viewing.', 'Panagsama Beach', 'Moalboal', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Restaurant', 'Free WiFi']),
('Moalboal Beach Resort', 'Classic beach resort with pool.', 'Panagsama Beach', 'Moalboal', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Ocean Safari Resort', 'Safari into the underwater world.', 'Panagsama Beach', 'Moalboal', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Restaurant', 'Free WiFi']),
('Turtle Bay Dive Resort', 'Sea turtle encounters guaranteed.', 'Panagsama Beach', 'Moalboal', 'Philippines', 4, 4000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Pool', 'Restaurant', 'Free WiFi']),
('Love''s Beach Resort', 'Romantic beachfront getaway.', 'Basdiot', 'Moalboal', 'Philippines', 3, 3000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Neptune Dive Center', 'Dive center with accommodations.', 'Panagsama Beach', 'Moalboal', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Dive Center', 'Restaurant', 'Free WiFi']),
('Pescador View Resort', 'Views of famous Pescador Island.', 'Panagsama Beach', 'Moalboal', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi', 'Island View']),
('Cebu Seaview Dive Resort', 'Seaview diving resort with house reef.', 'Panagsama Beach', 'Moalboal', 'Philippines', 3, 2700.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Dive Center', 'Restaurant', 'Free WiFi']),
('Eve''s Kiosk Resort', 'Simple kiosk-style beach accommodations.', 'Panagsama Beach', 'Moalboal', 'Philippines', 2, 1500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']);

-- CAMOTES HOTELS (15 hotels)
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('Santiago Bay Garden Resort', 'Garden resort with white sand beach.', 'Santiago Bay', 'Camotes', 'Philippines', 4, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Mangodlong Paradise Resort', 'Paradise beach with rock formations.', 'Mangodlong Beach', 'Camotes', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Ocean Shores Beach Resort', 'Shores of crystal-clear Camotes waters.', 'San Francisco', 'Camotes', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Camotes Highland Resort', 'Highland retreat with island views.', 'San Francisco', 'Camotes', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi', 'Mountain View']),
('Buho Rock Beach Resort', 'Famous cliff diving spot resort.', 'Buho Rock', 'Camotes', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Cliff Diving', 'Restaurant', 'Free WiFi']),
('Lake Danao Park Resort', 'Lake-side resort near Danao Lake.', 'Lake Danao', 'Camotes', 'Philippines', 3, 2000.00, '/placeholder.svg?height=400&width=600', ARRAY['Lake Access', 'Kayaking', 'Restaurant', 'Free WiFi']),
('Camotes Flying Fish Resort', 'Resort famous for flying fish viewing.', 'Tulang Diot', 'Camotes', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Island Paradise Beach Resort', 'Island paradise on Camotes shores.', 'Poro', 'Camotes', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Timubo Cave Resort', 'Near famous Timubo Underground Cave.', 'San Francisco', 'Camotes', 'Philippines', 2, 1800.00, '/placeholder.svg?height=400&width=600', ARRAY['Cave Tours', 'Restaurant', 'Free WiFi']),
('Camotes Sunrise Resort', 'Stunning sunrise views over the sea.', 'Poro', 'Camotes', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('White Sand Beach Resort', 'Pristine white sand on Camotes.', 'Santiago Bay', 'Camotes', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Camotes Cove Inn', 'Cozy inn near the cove.', 'San Francisco', 'Camotes', 'Philippines', 2, 1500.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Poro Beach Resort', 'Beach resort in Poro municipality.', 'Poro', 'Camotes', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Tulang Diot Resort', 'Resort on sandbar island Tulang Diot.', 'Tulang Diot Island', 'Camotes', 'Philippines', 3, 3500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Island Tours', 'Restaurant', 'Free WiFi']),
('Camotes Nature Park Lodge', 'Lodge near nature attractions.', 'San Francisco', 'Camotes', 'Philippines', 2, 1600.00, '/placeholder.svg?height=400&width=600', ARRAY['Nature Tours', 'Restaurant', 'Free WiFi']);

-- ILOILO HOTELS (15 hotels)
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('Richmonde Hotel Iloilo', 'Premium hotel in Megaworld Iloilo Business Park.', 'Iloilo Business Park', 'Iloilo', 'Philippines', 5, 6500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Spa', 'Restaurant', 'Gym', 'Free WiFi']),
('Courtyard by Marriott Iloilo', 'International brand hotel with city views.', 'Iloilo Business Park', 'Iloilo', 'Philippines', 4, 5200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Gym', 'Free WiFi']),
('Seda Atria Iloilo', 'Modern hotel in SM City Iloilo complex.', 'SM City Iloilo', 'Iloilo', 'Philippines', 4, 4800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Gym', 'Free WiFi']),
('Iloilo Grand Hotel', 'Grand hotel in the heart of Iloilo City.', 'General Luna Street', 'Iloilo', 'Philippines', 4, 3800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Go Hotels Iloilo', 'Budget-friendly accommodation downtown.', 'Iznart Street', 'Iloilo', 'Philippines', 2, 1400.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Air Conditioning']),
('Circle Inn Hotel', 'Comfortable hotel with circular design.', 'Mapa Street', 'Iloilo', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Injap Tower Hotel', 'Tallest hotel in Western Visayas.', 'Diversion Road', 'Iloilo', 'Philippines', 4, 4200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Gym', 'Free WiFi', 'City View']),
('GT Hotel Iloilo', 'Modern hotel with excellent amenities.', 'Quezon Street', 'Iloilo', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Urban Inn Iloilo', 'Urban convenience with modern comfort.', 'Iznart Street', 'Iloilo', 'Philippines', 3, 2000.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Days Hotel Iloilo', 'Reliable international brand hotel.', 'General Luna Street', 'Iloilo', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Castle Lite Hotel', 'Lite accommodation with essential amenities.', 'De Leon Street', 'Iloilo', 'Philippines', 2, 1600.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Iloilo Midtown Hotel', 'Central location in Iloilo midtown.', 'Yulo Street', 'Iloilo', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Free WiFi']),
('Westown Hotel', 'Western comfort in Iloilo City.', 'Luna Street', 'Iloilo', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Ong Bun Pension House', 'Heritage pension in old Iloilo.', 'JM Basa Street', 'Iloilo', 'Philippines', 2, 1200.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi']),
('Avenue Suites Iloilo', 'Suites on main avenue.', 'Diversion Road', 'Iloilo', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi', 'Kitchenette']);

-- BANTAYAN HOTELS (15 hotels)
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('Kota Beach Resort', 'Popular resort on pristine Sugar Beach.', 'Santa Fe', 'Bantayan', 'Philippines', 4, 5500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Anika Island Resort', 'Boutique resort with sunset views.', 'Santa Fe', 'Bantayan', 'Philippines', 4, 4800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Sugar Beach Resort', 'Named after the famous Sugar Beach.', 'Sugar Beach', 'Bantayan', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Bantayan Island Nature Park', 'Nature park with beach resort.', 'Santa Fe', 'Bantayan', 'Philippines', 4, 4200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Nature Park', 'Restaurant', 'Free WiFi']),
('Ogtong Cave Resort', 'Resort with famous Ogtong Cave pool.', 'Santa Fe', 'Bantayan', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Cave Pool', 'Beach Access', 'Restaurant', 'Free WiFi']),
('Amihan Beach Cabanas', 'Charming cabanas on the beach.', 'Santa Fe', 'Bantayan', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Marlin Beach Resort', 'Beachfront resort with fishing trips.', 'Santa Fe', 'Bantayan', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Fishing', 'Restaurant', 'Free WiFi']),
('Beach Placid Resort', 'Placid beach atmosphere for relaxation.', 'Santa Fe', 'Bantayan', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Santa Fe Beach Club', 'Beach club vibes on Bantayan.', 'Santa Fe', 'Bantayan', 'Philippines', 4, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Bar', 'Restaurant', 'Free WiFi']),
('Bantayan Cottages', 'Simple cottages on the beach.', 'Santa Fe', 'Bantayan', 'Philippines', 2, 1500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Virgin Beach Resort', 'Virgin beach with pristine waters.', 'Bantayan Town', 'Bantayan', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Yooneek Beach Resort', 'Unique resort experience on Bantayan.', 'Santa Fe', 'Bantayan', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Mayet Beach Resort', 'Family-run resort with warm hospitality.', 'Santa Fe', 'Bantayan', 'Philippines', 2, 1800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Islas Paradise Resort', 'Island paradise with white sand.', 'Santa Fe', 'Bantayan', 'Philippines', 3, 3000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Coucou Bar Hotel', 'Hotel with popular beach bar.', 'Santa Fe', 'Bantayan', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Bar', 'Restaurant', 'Free WiFi']);

-- OSLOB HOTELS (15 hotels)
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('Brumini Beach Resort', 'Beachfront resort near whale shark watching.', 'Tan-awan', 'Oslob', 'Philippines', 4, 4500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Whale Shark Tours', 'Restaurant', 'Free WiFi']),
('Oslob Whale Shark Resort', 'Premier whale shark encounter resort.', 'Tan-awan', 'Oslob', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Whale Shark Tours', 'Restaurant', 'Free WiFi']),
('Seafari Resort Oslob', 'Safari into the sea with whale sharks.', 'Tan-awan', 'Oslob', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Whale Shark Tours', 'Restaurant', 'Free WiFi']),
('Club Serena Oslob', 'Serene resort with Sumilon Island access.', 'Oslob Proper', 'Oslob', 'Philippines', 4, 5200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Island Tours', 'Restaurant', 'Free WiFi']),
('Sumilon Bluewater Island Resort', 'Exclusive resort on Sumilon Island.', 'Sumilon Island', 'Oslob', 'Philippines', 5, 12000.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Beach', 'Pool', 'Spa', 'Restaurant', 'Free WiFi']),
('Amor Farm Beach Resort', 'Farm-to-table resort with beach access.', 'Tan-awan', 'Oslob', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Farm Tours', 'Restaurant', 'Free WiFi']),
('Oslob Inn', 'Budget inn convenient for whale shark watching.', 'Tan-awan', 'Oslob', 'Philippines', 2, 1500.00, '/placeholder.svg?height=400&width=600', ARRAY['Whale Shark Tours', 'Restaurant', 'Free WiFi']),
('Tan-awan Beach Resort', 'Beach resort in famous Tan-awan area.', 'Tan-awan', 'Oslob', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Oslob Garden Stay', 'Garden accommodations near attractions.', 'Oslob Proper', 'Oslob', 'Philippines', 2, 1800.00, '/placeholder.svg?height=400&width=600', ARRAY['Garden', 'Restaurant', 'Free WiFi']),
('Tumalog Falls Resort', 'Near famous Tumalog Falls.', 'Oslob Proper', 'Oslob', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Falls Tours', 'Pool', 'Restaurant', 'Free WiFi']),
('Heritage Park Hotel', 'Near Oslob Church heritage site.', 'Oslob Proper', 'Oslob', 'Philippines', 3, 2000.00, '/placeholder.svg?height=400&width=600', ARRAY['Heritage Tours', 'Restaurant', 'Free WiFi']),
('Ocean View Pension', 'Pension with ocean views.', 'Tan-awan', 'Oslob', 'Philippines', 2, 1400.00, '/placeholder.svg?height=400&width=600', ARRAY['Ocean View', 'Restaurant', 'Free WiFi']),
('Cuartel Ruins Resort', 'Near historic Cuartel ruins.', 'Oslob Proper', 'Oslob', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['Historic Site', 'Pool', 'Restaurant', 'Free WiFi']),
('Blue Horizon Resort', 'Horizon views of Tañon Strait.', 'Tan-awan', 'Oslob', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Whale Shark Inn', 'Simple inn for whale shark enthusiasts.', 'Tan-awan', 'Oslob', 'Philippines', 2, 1200.00, '/placeholder.svg?height=400&width=600', ARRAY['Whale Shark Tours', 'Restaurant', 'Free WiFi']);

-- BADIAN HOTELS (15 hotels)
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('Badian Island Wellness Resort', 'Wellness resort on private island with canyoneering access.', 'Badian Island', 'Badian', 'Philippines', 5, 15000.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Beach', 'Pool', 'Spa', 'Restaurant', 'Canyoneering', 'Free WiFi']),
('Lambug Beach Resort', 'Resort on famous Lambug Beach.', 'Lambug Beach', 'Badian', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Kawasan Falls Resort', 'Resort near famous Kawasan Falls.', 'Matutinao', 'Badian', 'Philippines', 3, 2500.00, '/placeholder.svg?height=400&width=600', ARRAY['Falls Access', 'Canyoneering', 'Restaurant', 'Free WiFi']),
('Canyoneering Base Camp', 'Base camp for canyoneering adventures.', 'Matutinao', 'Badian', 'Philippines', 2, 1500.00, '/placeholder.svg?height=400&width=600', ARRAY['Canyoneering', 'Restaurant', 'Free WiFi']),
('Blue Lagoon Beach Resort', 'Blue lagoon beach with calm waters.', 'Lambug Beach', 'Badian', 'Philippines', 3, 3200.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Badian Haven Resort', 'Haven retreat in Badian.', 'Badian Proper', 'Badian', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Free WiFi']),
('Tropical Breeze Resort', 'Tropical breeze comfort near falls.', 'Matutinao', 'Badian', 'Philippines', 3, 2000.00, '/placeholder.svg?height=400&width=600', ARRAY['Falls Tours', 'Restaurant', 'Free WiFi']),
('Badian Seaside Inn', 'Seaside inn with fishing village charm.', 'Badian Proper', 'Badian', 'Philippines', 2, 1600.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Kawasan Adventure Resort', 'Adventure resort for thrill seekers.', 'Matutinao', 'Badian', 'Philippines', 3, 2800.00, '/placeholder.svg?height=400&width=600', ARRAY['Canyoneering', 'Pool', 'Restaurant', 'Free WiFi']),
('Palm Paradise Badian', 'Palm-lined paradise beach resort.', 'Lambug Beach', 'Badian', 'Philippines', 3, 3000.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Restaurant', 'Free WiFi']),
('Badian View Inn', 'Inn with views of Tañon Strait.', 'Badian Proper', 'Badian', 'Philippines', 2, 1400.00, '/placeholder.svg?height=400&width=600', ARRAY['Sea View', 'Restaurant', 'Free WiFi']),
('Matutinao River Resort', 'Resort along Matutinao River.', 'Matutinao', 'Badian', 'Philippines', 3, 2400.00, '/placeholder.svg?height=400&width=600', ARRAY['River Access', 'Restaurant', 'Free WiFi']),
('Badian Beach House', 'Beach house accommodations.', 'Lambug Beach', 'Badian', 'Philippines', 2, 1800.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Kitchen', 'Free WiFi']),
('Cebuana Beach Resort', 'Cebuana hospitality on the beach.', 'Lambug Beach', 'Badian', 'Philippines', 3, 2600.00, '/placeholder.svg?height=400&width=600', ARRAY['Beach Access', 'Pool', 'Restaurant', 'Free WiFi']),
('Adventure Zone Resort', 'Zone for adventure activities.', 'Matutinao', 'Badian', 'Philippines', 3, 2200.00, '/placeholder.svg?height=400&width=600', ARRAY['Canyoneering', 'Zip Line', 'Restaurant', 'Free WiFi']);

-- Create room types for all new hotels
INSERT INTO room_types (hotel_id, name, description, max_guests, price_per_night, amenities, image_url, available_rooms)
SELECT 
  h.id,
  'Standard Room',
  'Comfortable room with all essential amenities for a pleasant stay.',
  2,
  h.price_per_night,
  ARRAY['Queen Bed', 'TV', 'Air Conditioning', 'Private Bathroom', 'Free WiFi'],
  '/placeholder.svg?height=300&width=400',
  10
FROM hotels h;

INSERT INTO room_types (hotel_id, name, description, max_guests, price_per_night, amenities, image_url, available_rooms)
SELECT 
  h.id,
  'Deluxe Room',
  'Spacious room with premium amenities and enhanced comfort.',
  3,
  h.price_per_night * 1.4,
  ARRAY['King Bed', 'Sofa', 'TV', 'Mini Bar', 'Air Conditioning', 'Balcony'],
  '/placeholder.svg?height=300&width=400',
  6
FROM hotels h;

INSERT INTO room_types (hotel_id, name, description, max_guests, price_per_night, amenities, image_url, available_rooms)
SELECT 
  h.id,
  'Suite',
  'Luxurious suite with separate living area and premium services.',
  4,
  h.price_per_night * 2,
  ARRAY['King Bed', 'Living Room', 'TV', 'Mini Bar', 'Bathtub', 'Premium View', 'Room Service'],
  '/placeholder.svg?height=300&width=400',
  3
FROM hotels h;

-- Create hotel images for all new hotels
INSERT INTO hotel_images (hotel_id, image_url, alt_text, display_order)
SELECT 
  h.id,
  '/placeholder.svg?height=400&width=600&query=' || REPLACE(h.name, ' ', '-') || '-lobby',
  h.name || ' Lobby',
  1
FROM hotels h;

INSERT INTO hotel_images (hotel_id, image_url, alt_text, display_order)
SELECT 
  h.id,
  '/placeholder.svg?height=400&width=600&query=' || REPLACE(h.name, ' ', '-') || '-pool',
  h.name || ' Pool',
  2
FROM hotels h;

INSERT INTO hotel_images (hotel_id, image_url, alt_text, display_order)
SELECT 
  h.id,
  '/placeholder.svg?height=400&width=600&query=' || REPLACE(h.name, ' ', '-') || '-restaurant',
  h.name || ' Restaurant',
  3
FROM hotels h;

INSERT INTO hotel_images (hotel_id, image_url, alt_text, display_order)
SELECT 
  h.id,
  '/placeholder.svg?height=400&width=600&query=' || REPLACE(h.name, ' ', '-') || '-room',
  h.name || ' Room',
  4
FROM hotels h;
