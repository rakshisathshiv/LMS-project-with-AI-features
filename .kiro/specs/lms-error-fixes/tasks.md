# Implementation Plan: LMS Error Fixes

## Overview

Incremental implementation of all identified fixes. Each task builds on the previous. All fixes target stability, correctness, and crash-free operation. Tasks are ordered from foundational (database/config) through backend, then frontend.

## Tasks

- [x] 1. Fix Prisma CLI version conflict
  - In `backend/package.json`, add a `"prisma"` script that uses `npx prisma` for all operations, and add an `engines` field to pin the local prisma CLI version to `^5.22.0`
  - Add a `.npmrc` file to `backend/` with `node-linker=hoisted` so the local `node_modules/.bin/prisma` is always resolved first
  - Update `package.json` scripts: `"build": "npx prisma generate"`, `"postinstall": "npx prisma generate"`, `"vercel-build": "npx prisma generate && npx prisma migrate deploy"`, `"db:migrate": "npx prisma migrate dev"`, `"db:seed": "npx ts-node prisma/seed.ts"`
  - Verify `backend/prisma/schema.prisma` is valid for Prisma v5 (datasource with `url = env("DATABASE_URL")` is correct for v5 — no changes needed)
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Fix seed data integrity
  - [x] 2.1 Fix broken YouTube URL in `backend/prisma/seed.ts`
    - Change `'https://www.youtube.com/embed/6ThIvnfpXI'` (truncated) to `'https://www.youtube.com/embed/6ThXivfpXI4'` or replace with a known valid embed URL for the "Custom Hooks" video
    - Verify all other YouTube embed URLs in the seed file are complete (start with `https://www.youtube.com/embed/` and have a non-empty ID after the slash)
    - _Requirements: 10.1, 10.2_
  - [ ]* 2.2 Write property test for seed URL validity
    - **Property 10: Seed video URLs are valid embed URLs**
    - For any video created by seed, `youtubeUrl` starts with `https://www.youtube.com/embed/` and has a non-empty ID
    - **Validates: Requirements 10.1**
  - [ ]* 2.3 Write property test for seed idempotence
    - **Property 9: Seed script idempotence**
    - Run seed twice, assert User count for `demo@lms.com` is exactly 1 and Subject count equals 2
    - **Validates: Requirements 10.3**

- [x] 3. Fix backend progress controller watchedSeconds coercion
  - In `backend/src/controllers/progress.controller.ts`, update `updateProgress` to coerce `watchedSeconds` to a safe integer: `const safeWatchedSeconds = Number.isFinite(Number(watchedSeconds)) ? Math.max(0, Math.floor(Number(watchedSeconds))) : 0`
  - Apply this coercion before the `prisma.videoProgress.upsert` call
  - _Requirements: 6.1_

- [x] 4. Fix frontend watchedSeconds undefined bug in learn page
  - In `frontend/src/app/learn/[courseId]/page.tsx`, update the `markComplete` function:
    - Replace `watchedSeconds: activeVideo.durationSeconds` with `watchedSeconds: activeVideo.durationSeconds ?? 0`
    - This ensures `undefined` or `null` durationSeconds is coerced to `0`
  - _Requirements: 6.1, 6.2_
  - [ ]* 4.1 Write property test for watchedSeconds coercion
    - **Property 6: Progress update always sends valid watchedSeconds**
    - For any video object where durationSeconds is undefined, null, or a number, the sent watchedSeconds must be a finite integer >= 0
    - **Validates: Requirements 6.1, 6.2**

- [x] 5. Fix AuthProvider isLoading race condition
  - In `frontend/src/components/AuthProvider.tsx`, verify the `finally` block always calls `setLoading(false)` — it already does, but confirm nothing throws before `finally` that would skip it
  - Wrap the inner body in a try/catch/finally if not already done, ensuring `setLoading(false)` is called even on unexpected errors
  - _Requirements: 3.3_
  - [ ]* 5.1 Write property test for auth loading resolution
    - **Property 1: AuthProvider always resolves loading state**
    - For any mock API response (success or failure), after the effect runs, isLoading must be false
    - **Validates: Requirements 3.3**

- [x] 6. Fix redirect guard on authenticated pages
  - In `frontend/src/app/dashboard/page.tsx`, `frontend/src/app/learn/[courseId]/page.tsx`, and `frontend/src/app/profile/page.tsx`:
    - Ensure the redirect useEffect condition is `!isLoading && !isAuthenticated` (already correct in dashboard and learn — verify profile also has this guard)
    - For `profile/page.tsx`: add `useRouter`, `useEffect`, and the redirect guard — currently it only returns `null` without redirecting
  - _Requirements: 3.4, 8.4_
  - [ ]* 6.1 Write property test for redirect guard
    - **Property 2: No redirect before auth is resolved**
    - For any isLoading=true state, redirect must not be triggered; only trigger when isLoading=false and isAuthenticated=false
    - **Validates: Requirements 3.4**

- [x] 7. Fix courses page error state
  - In `frontend/src/app/courses/page.tsx`:
    - Add an `error` state: `const [error, setError] = useState<string | null>(null)`
    - In the `.catch()` block, call `setError('Failed to load courses. Please try again later.')`
    - Add error rendering: `if (error) return <div className="p-12 text-center text-rose-500">{error}</div>`
    - Place the error render before the loading check
  - _Requirements: 4.2_

- [x] 8. Fix axios 401 interceptor retry logic
  - In `frontend/src/lib/axios.ts`, review the current interceptor — it already has `_retry` flag logic
  - Verify the `AUTH_NO_RETRY_PATHS` list includes `/auth/refresh` to prevent infinite loops
  - Ensure the interceptor handles `status === 401` only (not 403 for invalid tokens) to avoid retrying on truly unauthorized requests
  - Add `status === 403` as a non-retryable case: if status is 403, skip retry and reject immediately
  - _Requirements: 3.6_
  - [ ]* 8.1 Write property test for interceptor retry
    - **Property 3: Axios 401 interceptor retries at most once**
    - For any non-auth 401 response, the _retry flag is set to true after first retry; subsequent calls do not retry
    - **Validates: Requirements 3.6**

- [x] 9. Checkpoint — backend and auth fixes complete
  - Ensure backend starts with `npm run dev` (with `.env` populated)
  - Ensure `npx prisma db push` completes without P1012 errors
  - Ensure seed runs without errors: `npx ts-node prisma/seed.ts`
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Fix profile page hardcoded stats
  - In `frontend/src/app/profile/page.tsx`:
    - Add state for enrolled subjects and progress: `const [subjects, setSubjects] = useState<any[]>([])` and `const [progressData, setProgressData] = useState<any[]>([])`
    - Add a `useEffect` to fetch from `/courses/enrolled` and `/progress` when `user` is available
    - Replace the hardcoded `2` enrolled count with `subjects.length`
    - Replace the hardcoded `4` completed videos count with `progressData.filter(p => p.completed).length`
    - Update `downloadReport` to use `subjects.map(s => s.title)` for the PDF course list instead of hardcoded strings
    - Add `useRouter` and redirect to `/login` if user is null and not loading
  - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [ ]* 10.1 Write property test for profile count accuracy
    - **Property 8: Profile page displayed counts match API data**
    - For any list of subjects, displayed count equals list length; for any progress list, completed count equals filter(p.completed).length
    - **Validates: Requirements 8.1, 8.2**

- [x] 11. Fix CSS font variable references
  - In `frontend/src/app/globals.css`:
    - Remove the `--font-geist-sans` and `--font-geist-mono` references from the `@theme inline` block since Geist fonts are not imported
    - Replace with `--font-sans: var(--font-sans)` referencing the Inter font variable that IS imported
  - In `frontend/src/app/layout.tsx`, verify the `inter.variable` is applied to the `<body>` class — it already is (`${inter.variable}`) — no change needed
  - _Requirements: 9.1, 9.2_

- [x] 12. Fix course detail page duration formatting
  - In `frontend/src/app/courses/[id]/page.tsx` and `frontend/src/app/learn/[courseId]/page.tsx`:
    - Extract a shared duration formatting function: `function formatDuration(seconds: number | null | undefined): string { if (!seconds) return ''; const mins = Math.floor(seconds / 60); return mins > 0 ? \`${mins} min\` : '< 1 min'; }`
    - Apply this function to all duration display sites to handle `0` and `null` gracefully
  - _Requirements: 4.5_
  - [ ]* 12.1 Write property test for duration formatting
    - **Property 5: Duration formatting produces human-readable output**
    - For any non-negative integer durationSeconds, formatDuration returns a non-empty string; for 0/null/undefined, returns empty string or '< 1 min'
    - **Validates: Requirements 4.5**

- [x] 13. Fix resume logic correctness
  - In `frontend/src/app/learn/[courseId]/page.tsx`, verify the resume logic:
    - The sort comparator `new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()` is correct for descending order (most recent first)
    - If `lastProgress` exists but the matching video is not found in the course (e.g., video deleted), fall back to `courseVideos[0]`
    - If `courseVideos` is empty (no videos in course), handle gracefully by redirecting to dashboard
  - _Requirements: 6.3_
  - [ ]* 13.1 Write property test for resume logic
    - **Property 7: Resume logic selects the most recently updated video**
    - For any array of progress records with distinct updatedAt timestamps, the selected video corresponds to the record with the maximum updatedAt
    - **Validates: Requirements 6.3**

- [x] 14. Verify AI Widget hooks ordering
  - In `frontend/src/components/AIWidget.tsx`, confirm the `if (!isAuthenticated) return null` line appears AFTER all `useState`, `useAuth` hook calls — current code already does this correctly
  - Add a comment above the early return: `// All hooks declared above — safe to return null conditionally here`
  - Verify the component does not crash when `isAuthenticated` changes from true to false (e.g., on logout)
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 15. Final checkpoint — full system verification
  - Run frontend lint: `cd frontend && npx eslint src`
  - Verify all pages load without console errors in development
  - Verify login → dashboard → learn flow works end to end
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property/unit tests — can be skipped for a faster fix pass
- Each task references specific requirements for traceability
- Checkpoints (tasks 9 and 15) validate incremental progress
- The Prisma fix (task 1) is the most critical — nothing else works until Prisma generates correctly
- Property tests use `fast-check` — install with `npm install --save-dev fast-check` in both `frontend/` and `backend/`
