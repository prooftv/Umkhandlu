// ─── Environmental Context ────────────────────────────────────────────────────
// Direct shape of the environmentalContext Sanity object (was: weatherContext)

export type EnvironmentalContext = {
  type?: string | null
  condition?: string | null
  temperatureCelsius?: number | null
  tempMinCelsius?: number | null
  tempMaxCelsius?: number | null
  rainfallMm?: number | null
  windKmh?: number | null
  humidityPercent?: number | null
  uvIndex?: number | null
  fetchedAt?: string | null
}

// ─── Evidence Item ────────────────────────────────────────────────────────────
// Normalised from record.evidence[] and developmentNotice.documents[]

export type EvidenceItem = {
  _key: string
  title: string
  url?: string | null
}

// ─── Canonical GEM Record ─────────────────────────────────────────────────────
// Assembled at query/component boundary from existing Sanity query results.
// No Sanity documents are modified. Fields map directly from existing queries.

export type GemRecord = {
  // Identity
  _id: string
  _type: 'record' | 'notice' | 'developmentNotice'
  title: string
  slug: string
  recordType?: string | null       // record: 'minutes' | 'resolution' | ...
  noticeType?: string | null       // notice: 'meeting' | 'announcement' | ...
                                   // developmentNotice: 'eia' | 'rezoning' | ...
  status?: string | null
  date?: string | null             // ISO date or datetime
  referenceNumber?: string | null  // developmentNotice only

  // Context
  location?: string | null
  attendance?: number | null
  relatedArea?: { name: string; slug: string } | null
  relatedCampaign?: { title: string; slug: string; status?: string | null } | null
  originNotice?: { title: string; slug: string; noticeType?: string | null } | null
  parentRecord?: { title: string; slug: string; recordType: string } | null
  environmentalContext?: EnvironmentalContext | null
  evidence?: EvidenceItem[]        // record.evidence[]
  documents?: EvidenceItem[]       // developmentNotice.documents[]

  // developmentNotice participation context
  commentDeadline?: string | null
  commentContact?: string | null

  // Lineage count — determines journey action availability
  lineageCount?: number
  externalUrl?: string | null      // external-resource only
}

// ─── Action IDs ───────────────────────────────────────────────────────────────

export type ActionId =
  | 'share'           // Distribution — all types
  | 'attendance'      // Response/Informal — meeting notices, local state only
  | 'participation'   // Response/Formal — devNotice open + deadline not passed
  | 'calendar'        // Utility — dated notices + devNotice deadline
  | 'reminder'        // Utility — deferred
  | 'documents'       // Evidence — evidence[] or documents[] present
  | 'journey'         // Inst.Nav — lineageCount > 0
  | 'lineage-cert'    // Inst.Nav — notice only
  | 'proof-of-pub'    // Inst.Nav — developmentNotice only
  | 'view-source'     // Inst.Nav — external-resource only

// ─── Action Context ───────────────────────────────────────────────────────────
// Pre-resolved payload each action component receives. No eligibility logic inside components.

export type RecordAction =
  | { id: 'share';        context: { title: string } }
  | { id: 'attendance';   context: { title: string; date: string; location?: string | null } }
  | { id: 'calendar';     context: { title: string; date: string; location?: string | null; isDeadline?: boolean } }
  | { id: 'participation';context: { _id: string; title: string; deadline: string; contact: string } }
  | { id: 'documents';    context: { items: EvidenceItem[] } }
  | { id: 'journey';      context: { slug: string; _type: GemRecord['_type'] } }
  | { id: 'lineage-cert'; context: { slug: string } }
  | { id: 'proof-of-pub'; context: { _id: string } }
  | { id: 'view-source';  context: { url: string } }

export type ActionSet = RecordAction[]
