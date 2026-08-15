import type { ActionSet, GemRecord, RecordAction } from './RecordGem.types'

// Pure function — no side effects, no async, no UI.
// All condition logic for action availability lives here and nowhere else.

export function resolveActions(record: GemRecord): ActionSet {
  const actions: RecordAction[] = []

  if (record._type === 'notice') {
    // Attendance + Calendar: meeting notices with a date
    if (record.noticeType === 'meeting' && record.date) {
      actions.push({
        id: 'attendance',
        context: { title: record.title, date: record.date, location: record.location },
      })
      actions.push({
        id: 'calendar',
        context: { title: record.title, date: record.date, location: record.location },
      })
    } else if (record.date) {
      // Non-meeting dated notices can still be added to calendar
      actions.push({
        id: 'calendar',
        context: { title: record.title, date: record.date, location: record.location },
      })
    }

    // Share — always
    actions.push({ id: 'share', context: { title: record.title } })

    // Lineage certificate — always for notices
    actions.push({ id: 'lineage-cert', context: { slug: record.slug } })

    // Journey — only when lineage exists
    if ((record.lineageCount ?? 0) > 0) {
      actions.push({ id: 'journey', context: { slug: record.slug, _type: record._type } })
    }

    // Documents
    if (record.evidence?.length) {
      actions.push({ id: 'documents', context: { items: record.evidence } })
    }
  }

  if (record._type === 'developmentNotice') {
    const isOpen = record.status === 'open'
    const deadlinePassed = record.commentDeadline
      ? new Date(record.commentDeadline) < new Date()
      : false
    const acceptingComments = isOpen && !deadlinePassed

    // Participation — statutory, only when open + deadline not passed
    if (acceptingComments && record.commentDeadline && record.commentContact) {
      actions.push({
        id: 'participation',
        context: {
          _id: record._id,
          title: record.title,
          deadline: record.commentDeadline,
          contact: record.commentContact,
        },
      })
      // Calendar using deadline as the event
      actions.push({
        id: 'calendar',
        context: { title: `Comment deadline: ${record.title}`, date: record.commentDeadline, isDeadline: true },
      })
    }

    // Share — always
    actions.push({ id: 'share', context: { title: record.title } })

    // Proof of publication — always for devNotices
    actions.push({ id: 'proof-of-pub', context: { _id: record._id } })

    // Documents
    if (record.documents?.length) {
      actions.push({ id: 'documents', context: { items: record.documents } })
    }
  }

  if (record._type === 'record') {
    // Share — always
    actions.push({ id: 'share', context: { title: record.title } })

    // Journey — only when lineage exists
    if ((record.lineageCount ?? 0) > 0) {
      actions.push({ id: 'journey', context: { slug: record.slug, _type: record._type } })
    }

    // Documents
    if (record.evidence?.length) {
      actions.push({ id: 'documents', context: { items: record.evidence } })
    }
  }

  return actions
}
