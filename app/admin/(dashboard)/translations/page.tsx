import TranslationsManager from '@/components/admin/translations-manager';

export const metadata = {
  title: 'Translations | Admin',
  description: 'Manage translations for the frontend',
};

export default function TranslationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Translations</h1>
        <p className="text-gray-600">
          Manage all frontend translations and convert text across different languages
        </p>
      </div>

      <TranslationsManager />
    </div>
  );
}
