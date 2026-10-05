# Requirements Document

## Introduction

This spec covers all identified bugs, errors, and stability issues in the LMS project — a full-stack learning management system (Next.js frontend + Node.js/Express backend + Prisma ORM). The goal is to bring the application to a stable, crash-free state comparable to production platforms like Udemy. Issues span Prisma ORM version compatibility, authentication flow reliability, frontend state management, UI data accuracy, and API integration correctness.

## Glossary

- **System**: The full LMS application (frontend + backend combined)
- **Backend**: The Node.js/Express API server
- **Frontend**: The Next.js application
- **Auth_Flow**: The authentication subsystem (register, login, refresh, logout, /me)
- **PrismaClient**: The database ORM client used by the Backend
- **AccessToken**: The short-lived JWT used to authorize API requests
- **RefreshToken**: The long-lived token stored in an httpOnly cookie used to renew AccessTokens
- **AuthProvider**: The React component that initialises authentication state on page load
- **AuthStore**: The Zustand store (useAuth) that holds the current user session in the Frontend
- **Progress_Tracker**: The subsystem that records and retrieves per-video watch progress
- **AI_Widget**: The floating AI chat component available to authenticated users
- **Profile_Page**: The user profile page displaying statistics and download functionality
- **Dashboard**: The enrolled-courses overview page for authenticated users

---

## Requirements

### Requirement 1: Prisma v7 Compatibility

**User Story:** As a developer, I want the database layer to work with the installed Prisma version, so that the backend starts without schema validation errors.

#### Acceptance Criteria

1. WHEN the Backend starts, THE PrismaClient SHALL connect to the database without throwing P1012 schema validation errors.
2. THE Backend SHALL include a `prisma.config.ts` file at the backend root that exports database connection configuration compatible with Prisma v7.
3. THE Backend SHALL remove the `url` field from the `datasource db` block in `prisma/schema.prisma` so that the schema validates cleanly under Prisma v7.
4. WHEN `prisma migrate deploy` or `prisma generate` is executed, THE PrismaClient SHALL complete successfully without configuration errors.

---

### Requirement 2: Backend Environment Bootstrap

**User Story:** As a developer, I want the backend to start reliably in a local development environment, so that I can run the application without manual environment setup steps.

#### Acceptance Criteria

1. WHEN the `backend/.env` file does not exist, THE Backend SHALL provide a clear setup mechanism (e.g., a `.env.example` with all required keys documented) so a developer can bootstrap the environment.
2. THE Backend `.env.example` SHALL include all required environment variables: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `PORT`, `FRONTEND_URL`, and `NODE_ENV`.
3. WHEN the Backend starts in development mode and `JWT_ACCESS_SECRET` or `JWT_REFRESH_SECRET` is missing, THE Backend SHALL log an actionable error message naming the missing variable and exit with a non-zero code.

---

### Requirement 3: Authentication Flow Correctness

**User Story:** As a user, I want login, logout, and session refresh to work correctly, so that I stay authenticated across page reloads without unexpected logouts.

#### Acceptance Criteria

1. WHEN a user submits valid credentials to `/api/auth/login`, THE Auth_Flow SHALL return a JSON response containing `accessToken` and a `user` object with `id`, `email`, and `name`.
2. WHEN a valid `refreshToken` cookie is present, THE Auth_Flow SHALL issue a new `accessToken` via `/api/auth/refresh`.
3. WHEN the AuthProvider mounts, THE System SHALL attempt to refresh the session and set the AuthStore user, or set it to null if the refresh fails — ensuring `isLoading` is set to `false` in both cases.
4. WHEN `isLoading` is `true` in the AuthStore, THE Frontend SHALL NOT redirect unauthenticated users to `/login` until loading is complete.
5. WHEN a user logs out, THE Auth_Flow SHALL delete the RefreshToken from the database and clear the `refreshToken` cookie.
6. WHEN the AccessToken expires and a request fails with 401, THE Frontend axios interceptor SHALL automatically attempt a refresh and retry the original request once before redirecting to `/login`.

---

### Requirement 4: Course Browsing and Detail Pages

**User Story:** As a user, I want to browse courses and view their full details, so that I can make an informed enrollment decision.

#### Acceptance Criteria

1. WHEN a user visits `/courses`, THE Frontend SHALL fetch and display all published courses from `/api/courses`.
2. IF the `/api/courses` request fails, THEN THE Frontend SHALL display a user-friendly error message instead of a blank page.
3. WHEN a user visits `/courses/[id]`, THE Frontend SHALL fetch and display the course title, description, price, sections, and videos.
4. IF the course is not found (404 from API), THEN THE Frontend SHALL display a "Course not found" message.
5. WHEN course sections and videos are rendered, THE Frontend SHALL display video duration in a human-readable format (e.g., "10 min").

---

### Requirement 5: Enrollment Flow

**User Story:** As an authenticated user, I want to enroll in a course, so that I can access its content in my dashboard.

#### Acceptance Criteria

1. WHEN an authenticated user clicks "Enroll Now" on a course detail page, THE System SHALL POST to `/api/courses/:id/enroll` and redirect to `/dashboard` on success.
2. IF the user is not authenticated and clicks enroll, THEN THE Frontend SHALL redirect to `/login`.
3. IF the user is already enrolled, THEN THE Backend SHALL return a 400 error with message "Already enrolled in this subject", and THE Frontend SHALL redirect to `/dashboard` rather than showing an error.
4. WHEN enrollment succeeds, THE Backend SHALL return a 201 response with the created Enrollment record.

---

### Requirement 6: Progress Tracking

**User Story:** As a student, I want my video watch progress to be recorded and resumed, so that I can pick up where I left off.

#### Acceptance Criteria

1. WHEN a student marks a video as complete, THE Progress_Tracker SHALL POST to `/api/progress` with `videoId`, `completed: true`, and a valid integer for `watchedSeconds`.
2. WHEN `durationSeconds` is `undefined` or `null` on a video, THE Frontend SHALL pass `0` as `watchedSeconds` rather than `undefined` to avoid database validation errors.
3. WHEN the learning page loads, THE Progress_Tracker SHALL fetch progress from `/api/progress` and resume at the most recently watched video.
4. WHEN a video is marked as complete, THE Frontend SHALL re-fetch progress and update the sidebar completion indicators without a full page reload.
5. WHEN fetching progress, THE Backend SHALL return an array of VideoProgress records including the associated video's `id`, `title`, `sectionId`, and `durationSeconds`.

---

### Requirement 7: AI Widget Stability

**User Story:** As an authenticated student, I want the AI assistant to be available without causing React errors, so that I can ask questions without the app crashing.

#### Acceptance Criteria

1. THE AI_Widget SHALL NOT violate React's Rules of Hooks by placing a conditional return before any hook call.
2. WHEN the AI_Widget is rendered and `isAuthenticated` is false, THE AI_Widget SHALL return null after all hooks have been declared.
3. WHEN the AI API call fails, THE AI_Widget SHALL display an inline error message in the chat window rather than crashing the application.
4. WHEN `OPENAI_API_KEY` is not set in the backend environment, THE AI_Widget SHALL receive and display a mock fallback response.

---

### Requirement 8: Profile Page Data Accuracy

**User Story:** As a student, I want my profile page to show accurate statistics, so that I can track my real progress.

#### Acceptance Criteria

1. THE Profile_Page SHALL fetch the user's enrolled course count from `/api/courses/enrolled` and display the real count.
2. THE Profile_Page SHALL fetch the user's completed video count from `/api/progress` and display the count of records where `completed === true`.
3. WHEN the user clicks "Download Progress Report", THE Profile_Page SHALL include the real enrolled course titles in the generated PDF, not hardcoded example values.
4. IF the user is not authenticated, THEN THE Profile_Page SHALL redirect to `/login`.

---

### Requirement 9: Frontend CSS and Font Configuration

**User Story:** As a user, I want the application to render with consistent styling, so that there are no broken font or CSS variable references.

#### Acceptance Criteria

1. THE Frontend `globals.css` SHALL NOT reference undefined CSS custom properties such as `--font-geist-sans` or `--font-geist-mono` unless those fonts are actually imported in the layout.
2. THE Frontend layout SHALL use only fonts that are imported via `next/font` and correctly apply the associated CSS variable to the `<body>` element.
3. WHEN the application loads, THE Frontend SHALL render without CSS console errors related to undefined font variables.

---

### Requirement 10: Seed Data Integrity

**User Story:** As a developer, I want the database seed script to produce valid, working data, so that the demo environment works out of the box.

#### Acceptance Criteria

1. THE seed script SHALL contain only valid, complete YouTube embed URLs for all seeded videos.
2. WHEN the seed script is run, THE System SHALL create a demo user (`demo@lms.com` / `password123`), two published subjects, and associated sections and videos without errors.
3. THE seed script SHALL be idempotent — running it multiple times SHALL NOT create duplicate subjects or users.
