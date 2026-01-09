# Importing Existing Supabase Project

If you already have a Supabase project and want to manage it with Terraform:

## Method 1: Import Existing Project

1. Add the project resource to your configuration (already in `supabase.tf`)
2. Import the existing project:

```bash
terraform import supabase_project.h8club <project-ref-id>
```

The project reference ID can be found in your Supabase project URL:
- URL format: `https://<project-ref>.supabase.co`
- The `<project-ref>` is your project reference ID

## Method 2: Use Variables (Manual Setup)

If you prefer to keep Supabase managed outside Terraform:

1. Set `supabase_url` and `supabase_anon_key` in `terraform.tfvars`
2. Leave `supabase_access_token` and `supabase_organization_id` empty or remove them
3. Comment out or remove the Supabase resources in `supabase.tf`

The Vercel configuration will automatically use the variables if the Supabase project resource is not available.
