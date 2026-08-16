import type { GemRecord, RecordAction } from './RecordGem.types'
import { resolveActions } from './resolveActions'
import AttendanceAction from './actions/AttendanceAction'
import CalendarAction from './actions/CalendarAction'
import ShareAction from './actions/ShareAction'

type Variant = 'card' | 'detail' | 'calendar'

type Props = {
  record: GemRecord
  variant?: Variant
}

function renderAction(action: RecordAction) {
  switch (action.id) {
    case 'attendance':
      return (
        <AttendanceAction
          key="attendance"
          title={action.context.title}
          date={action.context.date}
          location={action.context.location}
        />
      )
    case 'calendar':
      return (
        <CalendarAction
          key="calendar"
          title={action.context.title}
          date={action.context.date}
          location={action.context.location}
          isDeadline={action.context.isDeadline}
        />
      )
    case 'share':
      return <ShareAction key="share" title={action.context.title} />
    // Remaining actions (participation, documents, journey, lineage-cert, proof-of-pub)
    // are composed in Phase D when extracted from existing pages.
    default:
      return null
  }
}

// card — identity strip + primary action + share
function GemCard({ record, actions }: { record: GemRecord; actions: RecordAction[] }) {
  const primary = actions.find((a) => a.id === 'attendance' || a.id === 'participation')
  const calendar = actions.find((a) => a.id === 'calendar')
  const share = actions.find((a) => a.id === 'share')

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-3">
      {primary && renderAction(primary)}
      <div className="flex items-center gap-4 pt-1">
        {calendar && renderAction(calendar)}
        {share && renderAction(share)}
      </div>
    </div>
  )
}

// detail — full action set grouped
function GemDetail({ actions }: { actions: RecordAction[] }) {
  if (!actions.length) return null
  return (
    <div className="space-y-3">
      {actions.map((action) => renderAction(action))}
    </div>
  )
}

// calendar — date + attendance prominent
function GemCalendar({ actions }: { actions: RecordAction[] }) {
  const attendance = actions.find((a) => a.id === 'attendance')
  const calendar = actions.find((a) => a.id === 'calendar')
  const share = actions.find((a) => a.id === 'share')

  return (
    <div className="space-y-3">
      {attendance && renderAction(attendance)}
      <div className="flex items-center gap-4">
        {calendar && renderAction(calendar)}
        {share && renderAction(share)}
      </div>
    </div>
  )
}

export default function RecordGem({ record, variant = 'card' }: Props) {
  const actions = resolveActions(record, new Date())
  if (!actions.length) return null

  if (variant === 'detail')   return <GemDetail actions={actions} />
  if (variant === 'calendar') return <GemCalendar actions={actions} />
  return <GemCard record={record} actions={actions} />
}
