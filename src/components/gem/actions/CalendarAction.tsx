'use client'

import { useCallback } from 'react'

type Props = {
  title: string
  date: string
  location?: string | null
  isDeadline?: boolean
}

function buildIcal(title: string, date: string, location?: string | null, isDeadline?: boolean): string {
  // For deadline events use a 1-hour block at 09:00 on the deadline date
  const d = new Date(date)
  const pad = (n: number) => String(n).padStart(2, '0')
  const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const start = isDeadline ? `${ymd}T090000` : `${ymd}T090000`
  const end   = isDeadline ? `${ymd}T100000` : `${ymd}T110000`

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Umkhandlu//GEM//EN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title.replace(/,/g, '\\,')}`,
    location ? `LOCATION:${location.replace(/,/g, '\\,')}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  return lines
}

export default function CalendarAction({ title, date, location, isDeadline }: Props) {
  const download = useCallback(() => {
    const ical = buildIcal(title, date, location, isDeadline)
    const blob = new Blob([ical], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.slice(0, 40).replace(/\s+/g, '-').toLowerCase()}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }, [title, date, location, isDeadline])

  return (
    <button
      type="button"
      onClick={download}
      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors cursor-pointer"
    >
      <span>📅</span>
      {isDeadline ? 'Add Deadline' : 'Add to Calendar'}
    </button>
  )
}
