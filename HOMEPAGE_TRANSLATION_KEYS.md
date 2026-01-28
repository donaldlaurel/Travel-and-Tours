# Homepage Translation Keys Reference

## Overview
All text on the homepage has been converted to translation keys for multi-language support (English and Korean). This document serves as a reference for all available keys.

## Hero Section (HeroSlider Component)
- `home.title` - Main headline ("SEE THE WORLD FOR LESS")
- `home.subtitle` - Subtitle ("Discover affordable hotels, flights and activities")
- `hero.previous_slide` - Previous navigation button text
- `hero.next_slide` - Next navigation button text
- `hero.go_to_slide` - Go to slide button text

## Search Form (Sticky Search)
- `home.hotels` - Hotels tab
- `home.flights` - Flights tab
- `home.homes` - Homes & Apartments tab
- `home.flight_hotel` - Flight + Hotel tab
- `home.activities` - Activities tab
- `home.airport_transfer` - Airport transfer option
- `home.overnight` - Overnight stays option
- `home.day_use` - Day use stays option
- `home.search_location` - Search location placeholder
- `home.check_in` - Check-in label
- `home.check_out` - Check-out label
- `home.guests` - Guests label
- `home.rooms` - Room label
- `home.search_button` - Search button text

## Popular Destinations Section
- `home.top_destinations` - Section heading
- `home.popular_destinations_subtitle` - Section subtitle
- `home.hotels_count` - Hotels count label (e.g., "hotels" in English, "개의 호텔" in Korean)

## Featured Hotels Section
- `home.featured_hotels` - Section heading
- `home.featured_hotels_subtitle` - Section subtitle
- `home.featured_hotels_error` - Error message when hotels fail to load
- `home.featured_hotels_no_data` - Message when no hotels are available

## Why Book With Us Section
- `home.why_book` - Section heading
- `home.why_book_subtitle` - Section subtitle
- `home.best_price` - Feature title
- `home.best_price_desc` - Feature description
- `home.secure_booking` - Feature title
- `home.secure_booking_desc` - Feature description
- `home.free_cancellation` - Feature title
- `home.free_cancellation_desc` - Feature description
- `home.support_24_7` - Feature title
- `home.support_24_7_desc` - Feature description
- `home.exclusive_deals` - Feature title
- `home.exclusive_deals_desc` - Feature description

## Adding/Editing Translations

### Via Admin Dashboard
1. Navigate to `/admin/translations`
2. Click "Add Translation" button
3. Enter the translation key (e.g., `home.title`)
4. Enter the English and Korean translations
5. Click "Create" button

### Directly in Database
To add translations via SQL:
\`\`\`sql
INSERT INTO translations (key, language, value, category) VALUES
('home.my_key', 'en', 'English text', 'home'),
('home.my_key', 'ko', 'Korean text', 'home')
ON CONFLICT (key, language) DO NOTHING;
\`\`\`

## How It Works

1. **Hardcoded Fallback**: Translation keys are defined in `/lib/language-context.tsx`
2. **Database Override**: Keys are fetched from the database via `/api/translations`
3. **Usage in Components**: Use the `useLanguage()` hook to access the `t()` function:
   \`\`\`tsx
   const { t, language } = useLanguage()
   return <h1>{t('home.title')}</h1>
   \`\`\`

## Troubleshooting

### Issue: Can't add translations in admin panel
**Solution**: Make sure the POST endpoint in `/app/api/translations/route.ts` includes the `category` field. The API now automatically extracts the category from the key prefix (e.g., "home" from "home.title").

### Issue: New translations not showing up
**Solution**: 
1. Verify the translation key matches exactly (case-sensitive)
2. Check that you have admin role in the database
3. Clear browser cache and localStorage
4. Refresh the page

### Issue: Hardcoded text still showing
**Solution**: Make sure the component is using the translation hook:
\`\`\`tsx
import { useLanguage } from "@/lib/language-context"

export function MyComponent() {
  const { t } = useLanguage()
  return <div>{t('home.my_key')}</div>
}
\`\`\`

## Database Schema

The `translations` table has the following structure:
\`\`\`sql
- id (UUID, PRIMARY KEY)
- key (TEXT) - Translation key
- language (TEXT) - Language code ('en' or 'ko')
- value (TEXT) - Translated text
- category (TEXT) - Category for organization
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE(key, language)
\`\`\`

## Migration Script

To add all homepage translation keys to the database, run:
\`\`\`bash
/scripts/015-add-homepage-translations.sql
\`\`\`

This script adds all new translation keys for:
- Featured Hotels section
- Hotel count labels
- Hero slider navigation
- Error messages
