import { useEffect, useState } from 'react';

interface UseTranslationsReturn {
  t: (key: string, defaultValue?: string) => string;
  isLoading: boolean;
}

export function useTranslations(language: string = 'en'): UseTranslationsReturn {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/translations?language=${language}`);
        if (!response.ok) throw new Error('Failed to fetch translations');
        
        const data = await response.json();
        // Convert array to key-value object
        const translationsMap: Record<string, string> = {};
        data.forEach((item: any) => {
          translationsMap[item.key] = item.value;
        });
        
        setTranslations(translationsMap);
      } catch (error) {
        console.error('Error fetching translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [language]);

  const t = (key: string, defaultValue?: string): string => {
    return translations[key] || defaultValue || key;
  };

  return { t, isLoading };
}
