---
phase: 01-foundation-environment
plan: 02
subsystem: infra
tags: [agora, resend, uploadthing, stripe, sentry, google-oauth, service-accounts]

# Dependency graph
requires:
  - phase: 01-foundation-environment
    plan: 01
    provides: database infrastructure
provides:
  - Agora.io credentials (App ID + Certificate)
  - Resend API key
  - Uploadthing credentials (Secret + App ID)
  - Stripe placeholder keys (Turkey restriction)
  - Sentry DSN
  - Google OAuth credentials (Client ID + Secret)
affects: [02-authentication, 04-file-uploads, 05-email-notifications, 06-video-consultations, 08-payment-processing, 10-security-hardening]

# Tech tracking
tech-stack:
  added: []
  patterns: [external service integration, API key management]

key-files:
  created: []
  modified: []

key-decisions:
  - "Stripe placeholders used due to Turkey restriction (university project workaround)"
  - "All services use free tiers (zero budget constraint)"
  - "Sentry DSN obtained after initial auth token confusion"

patterns-established:
  - "Service credentials stored securely outside git (for Plan 01-03)"
  - "Free tier services selected for all third-party integrations"

issues-created:
  - "Stripe unavailable in Turkey - using placeholders for demo"

# Metrics
duration: 22min
completed: 2026-02-02
---

# Phase 1 Plan 2: Service Account Creation Summary

**All 10 service credentials collected from 6 providers (Agora, Resend, Uploadthing, Stripe placeholders, Sentry, Google OAuth)**

## Performance

- **Duration:** 22 min
- **Started:** 2026-02-02
- **Completed:** 2026-02-02
- **Credentials collected:** 10 total
- **Services configured:** 6 (Agora, Resend, Uploadthing, Stripe, Sentry, Google OAuth)
- **Files modified:** 0 (external service setup only)

## Accomplishments

- Created Agora.io account and obtained App ID + Certificate
- Created Resend account and generated API key
- Created Uploadthing account and obtained Secret + App ID
- Used Stripe placeholder keys (Turkey restriction workaround)
- Created Sentry project and obtained DSN
- Created Google OAuth application and obtained Client ID + Secret
- Verified all credentials collected and documented

## Service Credentials

| Service | Credentials | Purpose | Free Tier |
|---------|-------------|---------|-----------|
| Agora.io | App ID, Certificate | Video calls | 10,000 min/month |
| Resend | API Key | Email notifications | 3,000 emails/month |
| Uploadthing | Secret, App ID | File uploads | 2GB storage |
| Stripe | Placeholders only | Payments (demo) | N/A |
| Sentry | DSN | Error tracking | 5,000 events/month |
| Google OAuth | Client ID, Secret | Authentication | Unlimited |

**Total:** 10 credentials collected

## Decisions Made

**1. Stripe Placeholder Workaround**
- **Issue:** User in Turkey cannot create Stripe account (requires personal info, service unavailable)
- **Decision:** Use placeholder keys for university project demo
  - `STRIPE_PUBLIC_KEY="pk_test_placeholder_university_project"`
  - `STRIPE_SECRET_KEY="sk_test_placeholder_university_project"`
- **Rationale:** Allows development to continue, user can integrate real payment gateway (Iyzico) post-graduation if needed
- **Trade-off:** Payment functionality will be non-functional but project demonstrates understanding of payment integration patterns

**2. Free Tier Services Only**
- **Constraint:** Zero budget - user has no money for paid services
- **Decision:** Selected all services with adequate free tiers
- **Verification:** All services provide sufficient limits for university project demo and MVP launch

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Sentry credential format correction**
- **Found during:** Task 2 (Sentry setup)
- **Issue:** User initially provided auth token (`c7aacee4ffab11f085f0f238c8f45bf8`) instead of DSN
- **Fix:** Asked user to navigate to Settings > Client Keys (DSN) and get proper DSN format
- **Resolution:** User provided correct DSN: `https://032e4c0d1953c73095c46a7ada1f8e0e@o4510812552822784.ingest.us.sentry.io/4510812555509760`
- **Verification:** DSN format validated (matches `https://[key]@[region].sentry.io/[project-id]`)
- **Impact:** No code changes needed, blocking issue resolved

**2. [Workaround] Stripe unavailable in Turkey**
- **Found during:** Task 2 (Stripe setup)
- **Issue:** User cannot create Stripe account (geographic restriction + personal info requirements)
- **User request:** "i cant create stripe beacuse im in turkey and it needs personal information so give me another option please"
- **Decision:** Offered two options via AskUserQuestion tool:
  1. Use placeholder keys for university demo (selected)
  2. Skip Stripe and add later
- **Resolution:** User approved placeholder approach
- **Impact:** Payment Phase 8 will use mock implementation for demonstration purposes

---

**Total deviations:** 2 (1 credential correction, 1 geographic workaround)
**Impact on plan:** Necessary adaptations for user's constraints. No scope creep.

## Issues Encountered

**Issue 1: Sentry DSN vs Auth Token**
- **Problem:** User initially provided Sentry auth token instead of DSN
- **Resolution:** Clarified that DSN is needed (from Settings > Client Keys), user provided correct value
- **Status:** Resolved

**Issue 2: Stripe Geographic Restriction**
- **Problem:** Stripe unavailable in Turkey, requires personal information user cannot provide
- **Resolution:** Used placeholder keys for university project demo
- **Status:** Resolved (workaround implemented)
- **Future consideration:** User can integrate Iyzico (Turkish payment gateway) after graduation if taking project to production

## Collected Credentials

**Agora.io (Video Consultations)**
- App ID: `20286c56c51546858732422d42a41d28`
- Certificate: `9edbc5d359aa4afa8c9105c629385f0d`

**Resend (Email Notifications)**
- API Key: `re_DNnB5SgF_5NuqiqecLasnx9oRKqpqBQWV`

**Uploadthing (File Uploads)**
- Secret: `sk_live_3528102ce3f668e605af387bebc5517040fdfc6fc7e7bb04a6d63daf7b1fcf87`
- App ID: `yd9agmp7ui`

**Stripe (Payments - Placeholder)**
- Public Key: `pk_test_placeholder_university_project`
- Secret Key: `sk_test_placeholder_university_project`
- Webhook Secret: (deferred to Phase 8)

**Sentry (Error Tracking)**
- DSN: `https://032e4c0d1953c73095c46a7ada1f8e0e@o4510812552822784.ingest.us.sentry.io/4510812555509760`

**Google OAuth (Authentication)**
- Client ID: `35703240034-99th6103dpnqenkurh394spo4kdgn601.apps.googleusercontent.com`
- Client Secret: `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`

## Next Phase Readiness

✓ **Service accounts complete** - ready for environment configuration (Plan 01-03)

**Prerequisites for future plans:**
- Plan 01-03 will add these credentials to .env file
- All credentials secured (not committed to git)
- Ready to configure Next.js environment

**No blockers or concerns** (Stripe placeholder acceptable for university project)

---

## Next Step

Ready for **01-03-PLAN.md** - Environment Configuration (add all credentials to .env file and update .env.example)

**Note:** Google OAuth will become functional after Plan 01-03 completes (when credentials are added to .env file).

---
*Phase: 01-foundation-environment*
*Completed: 2026-02-02*
