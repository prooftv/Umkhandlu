# Umkhandlu — Content Roles & Ownership

## Overview

This document defines who is responsible for creating, editing, and approving content on the Umkhandlu platform. These roles are operational — they define human responsibilities, not software permissions.

When Sanity Teams (paid tier) is available, these roles can be enforced with custom access control in the CMS.

---

## Roles

### Council Admin

**Who:** Designated council secretary or administrator
**Access:** Full CMS access

| Content Type | Can Create | Can Edit | Can Delete |
|---|---|---|---|
| Notices | ✅ | ✅ | ✅ |
| Records (minutes, resolutions, policies) | ✅ | ✅ | ✅ |
| Campaigns (sponsorship, activation, initiative) | ✅ | ✅ | ✅ |
| Leadership profiles | ✅ | ✅ | ❌ (Inkosi approval) |
| Pages | ✅ | ✅ | ❌ |
| Site Settings | ✅ | ✅ | — |

**Responsibilities:**
- Publish meeting notices at least 7 days before meetings
- Upload meeting minutes within 48 hours of meetings
- Keep leadership profiles current
- Manage campaigns (create, update status, track deliverables)
- Upload campaign media (photos, video, audio, documents)
- Approve content from other roles before publishing

---

### Induna (Area Representative)

**Who:** Headman responsible for a specific isigodi/area
**Access:** Limited CMS access (or submits via Council Admin)

| Content Type | Can Create | Can Edit | Can Delete |
|---|---|---|---|
| Notices (for their area) | ✅ | ✅ own | ❌ |
| Listings (in their area) | ✅ | ✅ own | ❌ |
| Programs (in their area) | ✅ | ✅ own | ❌ |

**Responsibilities:**
- Keep area directory listings accurate (schools, clinics, businesses)
- Submit area-specific notices for meetings and announcements
- Report new businesses or facilities to be listed

---

### Youth Representative

**Who:** Designated youth coordinator or volunteer
**Access:** Limited CMS access

| Content Type | Can Create | Can Edit | Can Delete |
|---|---|---|---|
| Posts (stories, blog) | ✅ | ✅ own | ❌ |
| Programs (youth events) | ✅ | ✅ own | ❌ |
| Opportunities | ✅ | ✅ own | ❌ |
| Gallery images | ✅ | ❌ | ❌ |

**Responsibilities:**
- Publish at least 1 community story per week
- Add new opportunities as they become available
- Cover community events with photos and stories
- Keep program listings current (upcoming/active/completed)

---

### Unami (Technical Support)

**Who:** Unami Digital team
**Access:** Full CMS + code access

| Content Type | Can Create | Can Edit | Can Delete |
|---|---|---|---|
| All content types | ✅ | ✅ | ✅ |
| Site Settings | ✅ | ✅ | — |
| Schema changes | ✅ | — | — |

**Responsibilities:**
- Technical maintenance and updates
- Schema changes and new section types
- Training council staff on CMS usage
- Backup and recovery
- Analytics and reporting

**Important:** Unami does NOT create governance content (notices, resolutions, records). That authority belongs to the council.

---

## Content Approval Flow

```
Creator (any role)
    │
    ▼
Draft in Sanity Studio
    │
    ▼
Council Admin reviews
    │
    ▼
Published (visible on site)
```

For sensitive content (resolutions, land notices, leadership changes):

```
Creator
    │
    ▼
Council Admin reviews
    │
    ▼
Inkosi approval (verbal or in-person)
    │
    ▼
Council Admin publishes
```

---

## Weekly Content Cadence

| Day | Content | Responsible |
|---|---|---|
| Monday | Week's notices published | Council Admin |
| Wednesday | 1 community story / blog post | Youth Rep |
| Friday | Opportunity updates (new + expired removed) | Youth Rep |
| As needed | Meeting minutes (within 48h of meeting) | Council Admin |
| As needed | Campaign updates (status, impact, deliverables) | Council Admin |
| As needed | Area updates (new listings, changes) | Induna |
| Monthly | Leadership profile review | Council Admin |

---

## Implementation Notes

### Current State (Sanity Free Tier)

All users share the same CMS login. Content ownership is enforced by **process**, not software. The Council Admin is the gatekeeper.

### Future State (Sanity Teams)

When upgraded to Sanity Teams:
- Create custom roles matching this document
- Assign document-level permissions
- Enable approval workflows
- Add audit logging

### Training Required

| Role | Training Time | Topics |
|---|---|---|
| Council Admin | 2 hours | Full CMS, all content types, publishing |
| Induna | 30 minutes | Listings, notices (their area only) |
| Youth Rep | 1 hour | Posts, programs, opportunities, gallery |
