# H8CLUB Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migrations in order:
   - `migrations/001_initial_schema.sql`
   - `migrations/002_rls_policies.sql`
   - `migrations/003_seed_topics.sql`
3. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Replace PWA Icons

Replace the placeholder icon files with actual PNG images:
- `public/icon-192.png` (192x192 pixels)
- `public/icon-512.png` (512x512 pixels)

### 5. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Install Terraform (if using IaC):
   ```bash
   cd terraform
   terraform init
   ```
3. Or deploy directly via Vercel dashboard:
   - Connect your GitHub repository
   - Add environment variables
   - Deploy

### Terraform Setup

1. Get Vercel API token from [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Set environment variable: `export VERCEL_API_TOKEN=your_token`
3. Copy `terraform/terraform.tfvars.example` to `terraform/terraform.tfvars`
4. Fill in your values
5. Run `terraform apply`

## Project Structure

```
h8club/
├── app/              # Next.js app directory
├── lib/              # Utilities and Supabase clients
├── migrations/       # SQL migration files
├── public/           # Static assets
├── terraform/        # Infrastructure as Code
└── package.json
```

## Features

- ✅ Anonymous authentication
- ✅ Hate topics selection (3-5 topics)
- ✅ User matching (≥2 shared topics)
- ✅ Real-time chat
- ✅ Public feed
- ✅ PWA support

## Notes

- All database schema changes should be done via SQL migrations
- RLS policies are enforced on all tables
- The app is optimized for mobile-first responsive design
