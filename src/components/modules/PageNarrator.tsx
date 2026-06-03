'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Lang = 'en' | 'zu';

export default function PageNarrator() {
  const [playing, setPlaying] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const getPageText = useCallback(() => {
    const main = document.querySelector('main') || document.body;
    const sections = main.querySelectorAll('section');
    if (sections.length === 0) return main.innerText;
    return Array.from(sections)
      .map((s) => s.innerText)
      .join('\n\n');
  }, []);

  const play = useCallback(() => {
    window.speechSynthesis.cancel();
    const text = getPageText();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'zu' ? 'zu-ZA' : 'en-ZA';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  }, [lang, getPageText]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  }, []);

  const toggleLang = useCallback(
    (newLang: Lang) => {
      setLang(newLang);
      if (playing) {
        window.speechSynthesis.cancel();
        setPlaying(false);
      }
    },
    [playing]
  );

  if (!supported) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-xl mb-12 flex-wrap">
      <button
        type="button"
        onClick={playing ? stop : play}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
      >
        {playing ? (
          <>
            <PauseIcon /> Stop Narration
          </>
        ) : (
          <>
            <PlayIcon /> Listen to Briefing
          </>
        )}
      </button>

      <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
        <LangButton
          active={lang === 'en'}
          onClick={() => toggleLang('en')}
          label="EN"
        />
        <LangButton
          active={lang === 'zu'}
          onClick={() => toggleLang('zu')}
          label="ZU"
        />
      </div>

      <span className="text-xs text-gray-400">
        {playing
          ? 'Reading aloud...'
          : lang === 'zu'
            ? 'isiZulu • Lalela'
            : 'English • Listen'}
      </span>
    </div>
  );
}

function LangButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
        active ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg
      className="w-4 h-4"
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
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
