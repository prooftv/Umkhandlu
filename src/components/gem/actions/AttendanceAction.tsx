'use client'

import { useState } from 'react'

type AttendanceValue = 'attending' | 'maybe' | 'not-attending'

type Props = {
  title: string
  date: string
  location?: string | null
  onResponse?: (value: AttendanceValue) => void
}

const options: { value: AttendanceValue; label: string; icon: string }[] = [
  { value: 'attending',     label: 'Attending',     icon: '✓' },
  { value: 'maybe',         label: 'Maybe',         icon: '?' },
  { value: 'not-attending', label: "Can't attend",  icon: '✗' },
]

export default function AttendanceAction({ title, date, location, onResponse }: Props) {
  const [selected, setSelected] = useState<AttendanceValue | null>(null)

  function handleSelect(value: AttendanceValue) {
    setSelected(value)
    onResponse?.(value)
  }

  const dateStr = new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
        Your Response
      </p>
      <p className="text-sm font-semibold text-gray-800 mb-0.5">{title}</p>
      <p className="text-xs text-gray-500 mb-3">
        {dateStr}{location ? ` · ${location}` : ''}
      </p>
      <div className="flex gap-2">
        {options.map(({ value, label, icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleSelect(value)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
              selected === value
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            <span className="block text-base leading-none mb-0.5">{icon}</span>
            {label}
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Response recorded locally
        </p>
      )}
    </div>
  )
}
