# Translation Management System

## Overview

The Translation Management System allows admins to manage all frontend text content across multiple languages without modifying code. This system stores translations in a database and provides an admin interface to create, edit, and export translations.

## Features

- **Multi-language Support**: Manage translations for English, Korean, and add more languages as needed
- **CRUD Operations**: Create, read, update, and delete translations via the admin panel
- **Search & Filter**: Search translations by key or value
- **Import/Export**: Download translations as JSON or import translations from JSON files
- **Dynamic Loading**: Translations are dynamically loaded at runtime
- **Translation Statistics**: View translation statistics for each language

## Database Schema

The `translations` table stores all translations with the following structure:

```sql
CREATE TABLE translations (
  id UUID PRIMARY KEY,
  key VARCHAR(255) NOT NULL,           -- Translation key (e.g., "header.title")
  language VARCHAR(10) NOT NULL,       -- Language code (e.g., "en", "ko")
  value TEXT NOT NULL,                 -- Translated text
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(key, language)
);
```

## Admin Panel Usage

### Accessing the Translation Manager

1. Navigate to the Admin Panel
2. Click on "Translations" in the sidebar menu
3. You'll see the Translation Management interface

### Adding a Translation

1. Click the "Add Translation" button
2. Enter the translation key (e.g., `header.welcome`)
3. Enter the translated text
4. Select the language
5. Click "Create"

**Key Naming Convention**: Use dot notation for hierarchical organization
- `header.title` - Page header title
- `navigation.home` - Home navigation link
- `buttons.submit` - Submit button text
- `errors.invalid_email` - Invalid email error message

### Editing a Translation

1. Find the translation using the search box
2. Click the edit icon (pencil) next to the translation
3. Modify the translation value
4. Click "Update"

### Deleting a Translation

1. Find the translation using the search box
2. Click the delete icon (trash) next to the translation
3. Confirm the deletion

### Exporting Translations

1. Select a language from the dropdown
2. Click the "Download" button
3. A JSON file will be downloaded with all translations for that language

### Importing Translations

1. Click the "Upload" button
2. Select a JSON file with translations
3. The translations will be imported or updated

**JSON Format**:
```json
[
  {
    "id": "uuid",
    "key": "header.title",
    "language": "en",
    "value": "Welcome to Our Hotel",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "uuid",
    "key": "header.subtitle",
    "language": "en",
    "value": "Find your perfect stay",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

## Frontend Usage

### Using the useTranslations Hook

```tsx
'use client';

import { useTranslations } from '@/hooks/use-translations';
import { useLanguage } from '@/lib/language-context';

export function MyComponent() {
  const { language } = useLanguage();
  const { t, isLoading } = useTranslations(language);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{t('header.title')}</h1>
      <p>{t('header.subtitle')}</p>
    </div>
  );
}
```

### Direct API Access

For server-side components or API routes:

```tsx
import { createServerClient } from '@/lib/supabase/server';

async function getTranslations(language: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('translations')
    .select('*')
    .eq('language', language);

  if (error) throw error;
  return data;
}
```

## API Routes

### GET /api/translations

Fetch translations for a specific language or a specific key.

**Query Parameters**:
- `language` (required): Language code (e.g., "en", "ko")
- `key` (optional): Specific translation key to fetch

**Example**:
```
GET /api/translations?language=en
GET /api/translations?language=ko&key=header.title
```

**Response**:
```json
[
  {
    "id": "uuid",
    "key": "header.title",
    "language": "en",
    "value": "Welcome",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### POST /api/translations

Create or update a translation.

**Request Body**:
```json
{
  "key": "header.title",
  "language": "en",
  "value": "Welcome to Our Hotel"
}
```

**Response**: Returns the created or updated translation object.

### DELETE /api/translations

Delete a translation by ID.

**Query Parameters**:
- `id` (required): Translation ID

**Example**:
```
DELETE /api/translations?id=uuid
```

## Migration Process

To migrate from hardcoded strings to the translation system:

1. **Identify all strings**: List all text that needs translation
2. **Create translation keys**: Use consistent naming convention
3. **Add to admin panel**: Use the Translation Manager to add all strings
4. **Update components**: Replace hardcoded strings with `t()` function calls
5. **Test**: Verify translations work across all languages

## Best Practices

1. **Use consistent key naming**: Use dot notation and lowercase
2. **Keep translations organized**: Group related translations with common prefixes
3. **Provide defaults**: Always provide a default value in `t()` function
4. **Test all languages**: Verify all translations display correctly
5. **Regular backups**: Export translations regularly for backup
6. **Document context**: Use descriptive keys that indicate where text appears

## Adding New Languages

To add a new language:

1. **Update the constants**: Add language code to `LANGUAGES` in `components/admin/translations-manager.tsx`
2. **Add language context**: Update language provider if needed
3. **Create translations**: Add translations for all keys in the new language
4. **Test**: Verify the language works throughout the app

## Troubleshooting

### Translations not loading
- Check browser console for errors
- Verify language code is correct
- Ensure translations exist in the database for the selected language

### Import failing
- Verify JSON format matches the expected schema
- Ensure file is valid JSON
- Check browser console for specific error messages

### Performance issues
- Consider caching translations on the client
- Use translation key prefixes to load only needed translations
- Monitor database query performance

## Examples

### Example 1: Simple Text Translation

**Admin Panel Setup**:
- Key: `home.welcome`
- Language: English
- Value: "Welcome to our hotel booking platform"

**Frontend Usage**:
```tsx
const { t } = useTranslations('en');
<h1>{t('home.welcome')}</h1>
```

### Example 2: Dynamic Error Messages

**Admin Panel Setup**:
- Key: `errors.email_exists`
- Value: "This email is already registered"

**Frontend Usage**:
```tsx
const { t } = useTranslations(language);
if (userExists) {
  showError(t('errors.email_exists'));
}
```

### Example 3: Bulk Import

1. Export existing translations as JSON
2. Modify the JSON file with new translations
3. Use the Import button to bulk upload changes
4. Verify all translations in the admin panel
