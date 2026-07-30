'use client';

import { useState } from 'react';
import { type NarratorLang, useNarrator } from '@/hooks/useNarrator';

export default function SectionNarrator({ sectionId }: { sectionId: string }) {
  const [lang, setLang] = useState<NarratorLang>('en');
  const { speak, stop, playing, supported } = useNarrator(lang);

  if (!supported) return null;

  const handlePlay = () => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    speak(section.innerText);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        type="button"
        onClick={playing ? stop : handlePlay}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
      >
        {playing ? (
          <>
            <PauseIcon /> Stop
          </>
        ) : (
          <>
            <PlayIcon /> Listen
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => {
          setLang(lang === 'en' ? 'zu' : 'en');
          if (playing) stop();
        }}
        className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-500 transition-colors"
      >
        {lang === 'en' ? 'EN' : 'ZU'}
      </button>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      className="w-3 h-3"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      className="w-3 h-3"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
