-- Seed hotels data
INSERT INTO hotels (name, description, address, city, country, star_rating, price_per_night, main_image, amenities) VALUES
('The Grand Marina Hotel', 'Experience luxury at its finest with stunning ocean views and world-class amenities. Our beachfront property offers an unforgettable stay with private beach access and gourmet dining.', '123 Oceanfront Drive', 'Miami', 'United States', 5, 450.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Spa', 'Beach Access', 'Restaurant', 'Gym', 'Free WiFi', 'Room Service', 'Concierge']),

('Urban Boutique Inn', 'A stylish boutique hotel in the heart of downtown. Perfect for business travelers and urban explorers seeking modern comfort with local charm.', '456 Main Street', 'New York', 'United States', 4, 280.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Restaurant', 'Bar', 'Business Center', 'Gym']),

('Mountain View Resort', 'Escape to nature without sacrificing comfort. Our mountain retreat offers breathtaking views, outdoor adventures, and cozy accommodations.', '789 Alpine Road', 'Denver', 'United States', 4, 220.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Spa', 'Restaurant', 'Hiking Trails', 'Free Parking', 'Free WiFi']),

('Sakura Garden Hotel', 'Traditional Japanese hospitality meets modern luxury. Enjoy authentic experiences, tranquil gardens, and exceptional service in the heart of Tokyo.', '1-2-3 Shibuya', 'Tokyo', 'Japan', 5, 520.00, '/placeholder.svg?height=400&width=600', ARRAY['Onsen', 'Restaurant', 'Spa', 'Garden', 'Free WiFi', 'Room Service', 'Tea Ceremony']),

('Mediterranean Escape', 'Sun-drenched terraces, crystal-clear waters, and Greek hospitality await you at our clifftop sanctuary overlooking the Aegean Sea.', '15 Cliff Road', 'Santorini', 'Greece', 5, 380.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Bar', 'Sea View', 'Free WiFi', 'Spa', 'Airport Transfer']),

('City Central Budget Hotel', 'Clean, comfortable, and affordable accommodations in a prime location. Perfect for budget-conscious travelers who want to explore the city.', '321 Central Ave', 'Los Angeles', 'United States', 3, 95.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Air Conditioning', '24h Reception', 'Parking']),

('Riverside Luxury Suites', 'Elegant suites with panoramic river views in the heart of historic London. Experience British charm with modern sophistication.', '10 Thames Embankment', 'London', 'United Kingdom', 5, 490.00, '/placeholder.svg?height=400&width=600', ARRAY['Restaurant', 'Bar', 'Gym', 'Spa', 'Room Service', 'Concierge', 'Free WiFi']),

('Tropical Paradise Resort', 'Your dream tropical getaway awaits. Private villas, pristine beaches, and world-class diving in the Maldives.', 'North Male Atoll', 'Maldives', 'Maldives', 5, 890.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Beach', 'Pool', 'Spa', 'Diving Center', 'Restaurant', 'Bar', 'Water Sports', 'Free WiFi']),

('Historic Quarter Hotel', 'Stay in a beautifully restored 18th-century building in Barcelona''s Gothic Quarter. History and comfort blend seamlessly.', 'Carrer dels Banys', 'Barcelona', 'Spain', 4, 195.00, '/placeholder.svg?height=400&width=600', ARRAY['Free WiFi', 'Restaurant', 'Bar', 'Rooftop Terrace', 'Air Conditioning']),

('Sydney Harbour View', 'Wake up to stunning views of the Sydney Opera House and Harbour Bridge. Premium location with premium service.', '88 Circular Quay', 'Sydney', 'Australia', 5, 420.00, '/placeholder.svg?height=400&width=600', ARRAY['Pool', 'Restaurant', 'Bar', 'Gym', 'Spa', 'Harbour View', 'Free WiFi', 'Concierge']),

('Alpine Ski Lodge', 'Ski-in, ski-out luxury in the Swiss Alps. Cozy fireplaces, gourmet fondue, and direct access to world-class slopes.', '45 Bergstrasse', 'Zermatt', 'Switzerland', 4, 350.00, '/placeholder.svg?height=400&width=600', ARRAY['Ski Storage', 'Restaurant', 'Bar', 'Spa', 'Free WiFi', 'Fireplace', 'Mountain View']),

('Desert Oasis Resort', 'Experience Arabian luxury in the golden dunes. Private pools, desert safaris, and starlit dining await.', 'Dubai Desert Road', 'Dubai', 'United Arab Emirates', 5, 650.00, '/placeholder.svg?height=400&width=600', ARRAY['Private Pool', 'Spa', 'Restaurant', 'Desert Safari', 'Free WiFi', 'Butler Service']);

-- Seed room types for each hotel
INSERT INTO room_types (hotel_id, name, description, max_guests, price_per_night, amenities, image_url, available_rooms)
SELECT 
  h.id,
  'Standard Room',
  'Comfortable room with all essential amenities for a pleasant stay.',
  2,
  h.price_per_night,
  ARRAY['King Bed', 'TV', 'Air Conditioning', 'Private Bathroom'],
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
  ARRAY['King Bed', 'Sofa', 'TV', 'Mini Bar', 'Air Conditioning', 'City View'],
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
  ARRAY['King Bed', 'Living Room', 'TV', 'Mini Bar', 'Jacuzzi', 'Premium View', 'Room Service'],
  '/placeholder.svg?height=300&width=400',
  3
FROM hotels h;

-- Seed hotel images
INSERT INTO hotel_images (hotel_id, image_url, alt_text, display_order)
SELECT 
  h.id,
  '/placeholder.svg?height=400&width=600',
  'Hotel Lobby',
  1
FROM hotels h;

INSERT INTO hotel_images (hotel_id, image_url, alt_text, display_order)
SELECT 
  h.id,
  '/placeholder.svg?height=400&width=600',
  'Swimming Pool',
  2
FROM hotels h;

INSERT INTO hotel_images (hotel_id, image_url, alt_text, display_order)
SELECT 
  h.id,
  '/placeholder.svg?height=400&width=600',
  'Restaurant',
  3
FROM hotels h;
