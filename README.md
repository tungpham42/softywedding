# Everafter — Wedding planning platform

A Next.js App Router application for wedding planners, couples, and invited guests. Application records are read from and written to Firebase/Firestore; there are no seeded sample weddings, fake dashboard metrics, or demo RSVP codes.

## Features

- Firebase Google sign-in for the private couple and planner workspaces.
- Firestore-backed wedding creation, details editing, publishing status, and planning checklist.
- Dashboard metrics calculated from each wedding's invitation and RSVP records.
- Create individual or household invitation codes, copy their URLs, and view current response status.
- Public wedding websites loaded from Firestore only when `published === true`.
- Private invitation-code lookup and persistent RSVP submissions.
- Signed Cloudinary image uploads; the uploaded cover image URL is saved to the selected wedding record.
- SVG icon components and responsive Tailwind styling.

## Requirements

- Node.js 20.9 or newer (required by the Next.js version in `package.json`).
- A Firebase project with Authentication and Cloud Firestore enabled.
- A Firebase service-account credential for server-side Firebase Admin access.
- A Cloudinary account for wedding cover image uploads (optional until uploads are needed).

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

Set the following in `.env.local`:

### Firebase client

Copy these values from Firebase Console → Project settings → Your apps. Enable Google as a sign-in provider in Firebase Authentication and add your local/deployed domains to the authorized domains list.

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Firebase Admin

Create a service account credential in Firebase/Google Cloud and set the server-only values:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Keep `FIREBASE_PRIVATE_KEY` private. In `.env.local`, represent newline characters as `\n` if your environment does not support multiline values. Never add Firebase Admin credentials to `NEXT_PUBLIC_*` variables or commit `.env.local`.

### Cloudinary (optional)

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

The API secret is server-only. Uploading requires a valid Firebase ID token and signed-upload configuration.

## How real data is stored

The application does not create sample records. A user signs in, creates their first wedding in `/couple`, and the wedding document is stored in Firestore. Private dashboard reads are authenticated by a Firebase ID token verified by Firebase Admin.

### `weddings/{slug}`

Fields used by the application:

- `slug`: lowercase URL slug.
- `partnerOne`, `partnerTwo`: names.
- `date`: ISO calendar date (`YYYY-MM-DD`).
- `venue`, `location`, `headline`, `story`, `ceremonyTime`, `receptionTime`, `heroImage`.
- `schedule`: array of `{ time, title, description }` objects.
- `tasks`: array of `{ id, category, title, detail, due, done }` objects.
- `published`: boolean. The public `/w/{slug}` route appears only when true.
- `ownerUid`: Firebase Authentication UID of the account that owns the wedding.
- `plannerUid`: optional Firebase Authentication UID of an assigned planner.
- `createdAt`, `updatedAt`: server timestamps.

### `inviteCodes/{CODE}`

Invitation documents are created through the couple workspace. Each record includes:

- `code`: unique URL-safe invitation code.
- `weddingSlug`: matching `weddings/{slug}` document ID.
- `guestId`: ID used for the RSVP record (the generated code by default).
- `guestName`: guest or household name.
- `maxGuests`: allowed party size, from 1 to 8.
- `active`: boolean; set false to deactivate an invitation.
- `createdAt`: server timestamp.

### `weddings/{slug}/guests/{guestId}`

RSVP submissions write `name`, `email`, `attending`, `guestCount`, `mealPreference`, `invitationCode`, and `respondedAt`. Response metrics are calculated from these documents and the wedding's active invitation records.

Firestore Admin bypasses Firestore Security Rules, so private route handlers check the verified user's UID against `ownerUid` or `plannerUid`. Browser-side Firestore reads/writes are not used. `firestore.rules` denies direct client data access as a safe starting point.

## Main routes

- `/` — marketing home.
- `/login` — Google sign-in.
- `/couple` — create/manage your own wedding, update planning checklist and website details, manage invitation codes, and upload a cover image.
- `/planner` — weddings connected to the signed-in account, with real guest-response metrics and planning progress.
- `/guest` — invitation-code lookup.
- `/invite/{CODE}` — actual invitation record and RSVP form.
- `/w/{slug}` — published wedding website backed by Firestore.

## API routes

- `GET /api/weddings` — list weddings owned by or assigned to the signed-in UID.
- `POST /api/weddings` — create a private wedding workspace.
- `GET /api/weddings/{slug}` — read an authorized wedding's details and metrics.
- `PATCH /api/weddings/{slug}` — update allowed wedding fields, publication status, schedule, and task list.
- `GET /api/weddings/{slug}/invitations` — list invitation and RSVP status for an authorized wedding.
- `POST /api/weddings/{slug}/invitations` — create a unique guest invitation code.
- `POST /api/rsvp` — validate and persist RSVP submissions.
- `POST /api/cloudinary/signature` — return a signed upload signature for an authenticated user.

## Validation

Run the checks locally:

```bash
npm run typecheck
npm run lint
npm run build
```

A fresh Firebase project will show empty-state messages until you sign in and create wedding records. Public wedding pages are intentionally not available until the owner publishes the real record. If a planner needs access to an existing wedding, assign their Firebase UID to that document's `plannerUid` field using a trusted administrative workflow.
