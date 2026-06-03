'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Lang = 'en' | 'zu';

export default function SectionNarrator({ sectionId }: { sectionId: string }) {
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

  const play = useCallback(() => {
    window.speechSynthesis.cancel();
    const section = document.getElementById(sectionId);
    if (!section) return;
    const text = section.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'zu' ? 'zu-ZA' : 'en-ZA';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Prefer female voice
    const voices = window.speechSynthesis.getVoices();
    const targetLang = lang === 'zu' ? 'zu' : 'en';
    const femaleVoice = voices.find(
      (v) =>
        v.lang.startsWith(targetLang) &&
        (v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('woman') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('fiona') ||
          v.name.toLowerCase().includes('google') ||
          v.name.toLowerCase().includes('tessa'))
    );
    const langVoice = voices.find((v) => v.lang.startsWith(targetLang));
    if (femaleVoice) utterance.voice = femaleVoice;
    else if (langVoice) utterance.voice = langVoice;

    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  }, [lang, sectionId]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  }, []);

  if (!supported) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        type="button"
        onClick={playing ? stop : play}
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
