
- The frontend communicates **directly** with Supabase using the official JavaScript SDK
- No proprietary backend or API layer exists in the MVP
- Access control is enforced via PostgreSQL Row Level Security (RLS)

---

## Technology Stack

### Frontend
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **PWA**:
  - Web App Manifest
  - Service Worker
  - Add-to-Home-Screen support
- **Hosting & Deployment**: Vercel

---

### Backend (BaaS)
- **Provider**: Supabase
- **Components**:
  - Anonymous authentication
  - PostgreSQL database
  - Realtime subscriptions (chat)
- No custom backend services

---

## Infrastructure as Code (IaC)

### Tooling
- **Terraform** (plain Terraform, no Terragrunt for MVP)

### Managed Resources

#### Supabase
Managed via Terraform where supported:
- Supabase project
- Environment configuration
- Secrets
- Database access orchestration

> Note: Database schema and RLS policies are versioned via SQL migrations in the repository.

#### Vercel
Managed via Terraform:
- Vercel project
- Git repository integration
- Environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Automatic deployments from `main`

---

## Core MVP Features

### Authentication
- Fully anonymous authentication
- Unique `user_id` per user
- Auto-generated display name (e.g. `hater_4829`)

---

### Hate Topics
- Predefined list of “hate topics”
- Simple categorisation (school, people, situations, etc.)
- Users must select 3–5 topics during onboarding

---

### Matching
- Matching criteria:
  - Minimum of 2 shared hate topics
- Simple SQL-based matching
- No rejection history
- No advanced ranking algorithm

---

### Chat
- One-to-one chat between matched users
- Text-only messages
- Realtime updates via Supabase Realtime
- No media uploads
- No moderation in MVP

---

### Public Feed
- Public posts associated with a hate topic
- Chronological ordering
- No likes or comments in MVP

---

## Progressive Web App (PWA) Requirements

- Valid `manifest.json`
- Service Worker with:
  - Static asset caching
  - Minimal offline fallback
- HTTPS enforced (provided by Vercel)
- Installable on iOS, Android, and desktop browsers

---

## Deliberate MVP Limitations

The following features are intentionally excluded:

- Content moderation
- Reporting or blocking
- User profiles
- Admin interfaces
- Advanced analytics
- Native mobile applications
- App Store / Play Store distribution

---

## Cost Expectations

| Service   | Cost        |
|----------|-------------|
| Vercel   | Free tier   |
| Supabase| Free tier   |
| Terraform| Local only |
| Total    | ~0 €        |

---

## Development Conventions

- All code, logs, and internal messages are written in **English**
- Simplicity and delivery speed take precedence over correctness
- Any ambiguous decision should favour **faster shipping**

---

## Repository Expectations

- Infrastructure declared via Terraform
- Database schema and RLS managed via SQL migrations
- Frontend contains most business logic
- No long-running servers or containers

---

## Non-Goals (MVP)

- Scalability beyond free tiers
- Abuse prevention
- Legal or ethical optimisation
- Long-term maintainability

---

## Summary

H8CLUB is intentionally simple, provocative, and disposable.  
If it survives initial viral traction, architectural hardening can happen later.

Until then:
> **Ship fast. Break things. Screenshot everything.**
