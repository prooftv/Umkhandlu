'use client';

import { useEffect, useRef } from 'react';
import { useNarrator } from '@/hooks/useNarrator';

export interface NarratorCue {
  inView: boolean;
  script: string;
}

interface Props {
  cues: NarratorCue[];
  enabled: boolean;
}

/**
 * Watches inView flags from parent and speaks the corresponding script
 * when a cue becomes visible — but only while narration is enabled.
 */
export function ScrollNarratorEngine({ cues, enabled }: Props) {
  const { speak, stop } = useNarrator('en');
  const spokenRef = useRef<Set<number>>(new Set());

  // Reset spoken set when narration is toggled off
  useEffect(() => {
    if (!enabled) {
      stop();
      spokenRef.current.clear();
    }
  }, [enabled, stop]);

  useEffect(() => {
    if (!enabled) return;
    for (let i = 0; i < cues.length; i++) {
      if (cues[i].inView && !spokenRef.current.has(i)) {
        spokenRef.current.add(i);
        speak(cues[i].script);
        break; // speak one at a time — next fires when previous ends via onend
      }
    }
  }, [cues, enabled, speak]);

  return null;
}

/**
 * Floating narrator toggle button — place once in the page.
 */
export function NarratorToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={enabled ? 'Stop narration' : 'Start narration'}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-sm font-medium transition-colors print:hidden ${
        enabled
          ? 'bg-primary text-white hover:bg-primary/90'
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
      }`}
    >
      {enabled ? <StopIcon /> : <SpeakerIcon />}
      {enabled ? 'Stop' : 'Narrate'}
    </button>
  );
}

function SpeakerIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 6h12v12H6z" />
    </svg>
  );
}
