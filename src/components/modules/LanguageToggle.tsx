'use client';

import { useLocale } from '@/lib/i18n/LocaleContext';
import type { Locale } from '@/lib/i18n/translations';

const languages: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'zu', label: 'ZU' },
];

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="flex items-center gap-1 text-sm"
      role="radiogroup"
      aria-label="Language"
    >
      {languages.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          role="radio"
          aria-checked={locale === code}
          onClick={() => setLocale(code)}
          className={`px-2 py-1 rounded transition-colors ${
            locale === code
              ? 'bg-primary text-white font-medium'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
