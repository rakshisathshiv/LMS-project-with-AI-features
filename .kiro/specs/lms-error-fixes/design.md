# Design Document: LMS Error Fixes

## Overview

This document describes the technical design for fixing all identified bugs, errors, and stability issues in the LMS project. The system is a full-stack application:

- **Frontend**: Next.js 16 (App Router) with Zustand state, Tailwind CSS, Axios
- **Backend**: Node.js/Express with Prisma ORM, JWT authentication, PostgreSQL
- **AI**: Optional OpenAI integration with mock fallback

The fixes span six areas: Prisma v7 compatibility, backend bootstrapping, authentication flow, progress tracking, React component correctness, and data accuracy. The goal is a zero-crash, production-stable system.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Browser                                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Next.js Frontend (port 3000)                       │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │    │
│  │  │AuthStore │  │ Axios    │  │ Pages / Components│  │    │
│  │  │(Zustand) │←─│Interceptor│─→│ (App Router)     │  │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │    │
│  └────────────────────────┬────────────────────────────┘    │
│                            │ HTTP / Cookies                  │
└────────────────────────────┼────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  Node.js Backend (port 5000)                                │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │ Auth Routes│  │Course/     │  │ Progress / AI      │    │
│  │ /api/auth  │  │Subject Rts │  │ Routes             │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │  PrismaClient (v7) → PostgreSQL                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### Backend Components

| Component | File | Responsibility |
|---|---|---|
| `prisma.config.ts` | `backend/prisma.config.ts` | Prisma v7 datasource configuration |
| `schema.prisma` | `backend/prisma/schema.prisma` | Data models (url field removed) |
| `app.ts` | `backend/src/app.ts` | Express app, CORS, routes |
| `auth.controller.ts` | `backend/src/controllers/auth.controller.ts` | Register, login, refresh, logout, me |
| `subject.controller.ts` | `backend/src/controllers/subject.controller.ts` | Course CRUD and enrollment |
| `progress.controller.ts` | `backend/src/controllers/progress.controller.ts` | Video progress tracking |
| `ai.controller.ts` | `backend/src/controllers/ai.controller.ts` | AI chat with OpenAI fallback |

### Frontend Components

| Component | File | Responsibility |
|---|---|---|
| `AuthProvider` | `src/components/AuthProvider.tsx` | Session init on mount |
| `useAuth` | `src/store/useAuth.ts` | Zustand auth state |
| `api` (axios) | `src/lib/axios.ts` | API client with token refresh interceptor |
| `AIWidget` | `src/components/AIWidget.tsx` | Floating AI chat (hooks-safe) |
| `Profile` | `src/app/profile/page.tsx` | Real stats from API |
| `Dashboard` | `src/app/dashboard/page.tsx` | Enrolled courses |
| `LearningInterface` | `src/app/learn/[courseId]/page.tsx` | Video player + progress |

---

## Data Models

All models are defined in `prisma/schema.prisma` and remain unchanged. The fix only affects how Prisma v7 reads the datasource configuration.

```prisma
// prisma/schema.prisma (after fix)
datasource db {
  provider = "postgresql"
  // url field removed — connection string now lives in prisma.config.ts
}
```

```typescript
// backend/prisma.config.ts (new file)
import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  migrate: {
    adapter: () => {
      const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
      return new PrismaPg(pool)
    }
  }
})
```

**Note on Prisma v7**: Prisma 7 made the `url` field in `datasource` blocks obsolete. The connection URL must now be passed via an adapter in `prisma.config.ts`. The `@prisma/adapter-pg` package is required. However, since the team may prefer to stay on Prisma 5 (stable, simpler), the primary fix option is **downgrading to Prisma 5** (`^5.22.0` is in `package.json`) and ensuring no conflicting global Prisma v7 CLI is used. The simpler path is to pin and use Prisma v5 which fully supports the current schema — this avoids a breaking migration.

### Prisma Version Strategy Decision

The `package.json` specifies `"prisma": "^5.22.0"` and `"@prisma/client": "^5.22.0"`. The error logs show `Prisma CLI Version: 7.5.0` which means a **globally installed Prisma v7** is conflicting with the locally installed Prisma v5. The fix is:

1. Always use `npx prisma` (project-local) instead of global `prisma` CLI
2. Add an `.npmrc` or `package.json` script to enforce local CLI usage
3. The `schema.prisma` as written is valid for Prisma v5 — no changes needed

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property-Based Testing Overview

Property-based testing (PBT) validates software correctness by testing universal properties across many generated inputs. Each property is a formal specification that should hold for all valid inputs.

Core principles:
1. **Universal Quantification**: Every property contains an explicit "for all" statement
2. **Requirements Traceability**: Each property references the requirements it validates
3. **Executable Specifications**: Properties are implementable as automated tests

---

### Property 1: AuthProvider always resolves loading state

*For any* initial auth state (whether the refresh API succeeds or fails), after AuthProvider finishes its initialization effect, `isLoading` in the AuthStore MUST be `false` and the `user` field MUST be either a valid user object or `null` — never `undefined`.

**Validates: Requirements 3.3**

---

### Property 2: No redirect before auth is resolved

*For any* page that requires authentication, the redirect to `/login` MUST NOT be triggered while `isLoading` is `true`. The redirect logic MUST only execute after `isLoading` is `false` and `isAuthenticated` is `false`.

**Validates: Requirements 3.4**

---

### Property 3: Axios 401 interceptor retries at most once

*For any* non-auth API request that receives a 401 response, the axios interceptor SHALL attempt a token refresh and retry the original request exactly once. The `_retry` flag MUST prevent infinite retry loops — for any request, `_retry` transitions from `false` to `true` at most once per request lifecycle.

**Validates: Requirements 3.6**

---

### Property 4: Course detail renders all required fields

*For any* course object returned by the API with valid `title`, `description`, `price`, `sections`, and `sections[].videos`, the course detail page renderer MUST include all five top-level fields in its output. No required field should be silently omitted.

**Validates: Requirements 4.3**

---

### Property 5: Duration formatting produces human-readable output

*For any* non-negative integer `durationSeconds`, the duration formatting function MUST return a non-empty string. For `durationSeconds = 0`, it MUST return `"0 min"` or an equivalent zero-duration representation, not an empty string or `undefined`.

**Validates: Requirements 4.5, 6.2 (edge case)**

---

### Property 6: Progress update always sends valid watchedSeconds

*For any* video object (including those where `durationSeconds` is `undefined`, `null`, or `0`), the `markComplete` handler MUST send a `watchedSeconds` value that is a finite integer ≥ 0. It MUST never send `undefined`, `null`, or `NaN`.

**Validates: Requirements 6.1, 6.2**

---

### Property 7: Resume logic selects the most recently updated video

*For any* array of VideoProgress records filtered to videos in the current course, the resume logic MUST select the record with the maximum `updatedAt` timestamp as the active video. If no progress records exist for the course, it MUST fall back to the first video in the first section.

**Validates: Requirements 6.3**

---

### Property 8: Profile page displayed counts match API data

*For any* list of enrolled subjects returned by `/api/courses/enrolled`, the enrolled count shown MUST equal the length of that list. *For any* list of VideoProgress records returned by `/api/progress`, the completed videos count MUST equal the count of records where `completed === true`.

**Validates: Requirements 8.1, 8.2**

---

### Property 9: Seed script idempotence

*For any* number of consecutive seed script executions (≥ 1), the total count of `User` records with email `demo@lms.com` MUST be exactly 1, and the total count of `Subject` records MUST equal the number of subjects the seed script is designed to create (2). Re-running MUST NOT increase these counts.

**Validates: Requirements 10.3**

---

### Property 10: Seed video URLs are valid embed URLs

*For any* video record created by the seed script, the `youtubeUrl` field MUST be a non-empty string that starts with `https://www.youtube.com/embed/` and contains a non-empty video ID segment after the prefix.

**Validates: Requirements 10.1**

---

## Error Handling

### Backend Error Handling

| Scenario | Current Behavior | Fixed Behavior |
|---|---|---|
| Prisma P1012 on startup | Process crash | Fixed by correct CLI/version usage |
| Missing JWT secrets | Exits with error log | Already correct in `app.ts` |
| Duplicate enrollment | Returns 400 with message | Already correct |
| User not found on `/me` | Returns 404 | Already correct |
| DB connection failure | Unhandled crash | Express error handler catches and returns 500 |

### Frontend Error Handling

| Scenario | Current Behavior | Fixed Behavior |
|---|---|---|
| `/courses` fetch fails | Blank page (loading state stuck) | Error state with user message |
| 401 on authenticated request | No retry | Axios interceptor retries once then redirects |
| `durationSeconds` undefined | `undefined` sent to API → DB error | Coerce to `0` |
| Profile page unauthenticated | Renders `null` (no redirect) | Redirect to `/login` |
| AI chat API failure | Error logged, user sees generic message | Inline chat error message (already implemented) |

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are used:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

These are complementary — unit tests catch concrete bugs, property tests verify general correctness.

### Property-Based Testing Library

Use **fast-check** (TypeScript-native, supports Next.js and Node.js):

```
npm install --save-dev fast-check
```

Each property test runs a minimum of **100 iterations**.

Tag format: `// Feature: lms-error-fixes, Property N: <property_text>`

### Test Files Structure

```
backend/
  src/__tests__/
    auth.test.ts          # Unit: login, register, refresh, logout
    progress.test.ts      # Unit + Property: progress update, getProgress shape
    subject.test.ts       # Unit: enroll, getSubjects, getSubjectDetails
    seed.test.ts          # Property: idempotence (Properties 9, 10)

frontend/
  src/__tests__/
    useAuth.test.ts       # Property: loading resolution (Properties 1, 2)
    axios.test.ts         # Property: interceptor retry (Property 3)
    courseDetail.test.ts  # Property: field rendering (Properties 4, 5)
    progress.test.ts      # Property: watchedSeconds, resume (Properties 6, 7)
    profile.test.ts       # Property: count accuracy (Property 8)
```

### Unit Test Focus Areas

- Auth controller: valid credentials → correct token shape
- Auth controller: invalid credentials → 401
- Auth controller: missing fields → 400
- Enrollment: duplicate → 400 P2002 handling
- Progress: upsert creates new and updates existing
- AI controller: with/without API key paths

### Property Test Configuration

```typescript
import * as fc from 'fast-check'

// Feature: lms-error-fixes, Property 6: Progress update always sends valid watchedSeconds
test('markComplete always sends a finite integer >= 0 for watchedSeconds', () => {
  fc.assert(
    fc.property(
      fc.record({ durationSeconds: fc.oneof(fc.integer(), fc.constant(null), fc.constant(undefined)) }),
      (video) => {
        const watchedSeconds = video.durationSeconds ?? 0
        return Number.isFinite(watchedSeconds) && watchedSeconds >= 0
      }
    ),
    { numRuns: 100 }
  )
})
```
