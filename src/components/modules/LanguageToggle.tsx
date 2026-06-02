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
        <label key={code} className="inline-flex items-center">
          <input
            type="radio"
            name="language"
            checked={locale === code}
            onChange={() => setLocale(code)}
            className="sr-only"
          />
          <span
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              locale === code
                ? 'bg-primary text-white font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </span>
        </label>
      ))}
    </div>
  );
}
