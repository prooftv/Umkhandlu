'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type NarratorLang = 'en' | 'zu';

function pickVoice(lang: NarratorLang): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const prefix = lang === 'zu' ? 'zu' : 'en';
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith(prefix) &&
      (v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('woman') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('fiona') ||
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('tessa'))
  );
  return preferred ?? voices.find((v) => v.lang.startsWith(prefix)) ?? null;
}

export function useNarrator(lang: NarratorLang = 'en') {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
    return () => window.speechSynthesis?.cancel();
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'zu' ? 'zu-ZA' : 'en-ZA';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      const voice = pickVoice(lang);
      if (voice) utterance.voice = voice;
      utterance.onend = () => setPlaying(false);
      utterance.onerror = () => setPlaying(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setPlaying(true);
    },
    [lang, supported]
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setPlaying(false);
  }, []);

  return { speak, stop, playing, supported };
}
