# Terraform Infrastructure

This directory contains Terraform configuration for managing H8CLUB infrastructure.

## Prerequisites

1. Install Terraform: https://www.terraform.io/downloads
2. Set up Terraform Cloud:
   - Create account at https://app.terraform.io
   - Create or join an organization
   - See `TERRAFORM_CLOUD.md` for detailed setup instructions
3. Set up Vercel API token:
   - Go to https://vercel.com/account/tokens
   - Create a new token
   - **For Terraform Cloud**: Add as workspace variable `VERCEL_API_TOKEN` (mark as sensitive)
   - **For local execution**: Set as environment variable: `export VERCEL_API_TOKEN=your_token`
4. Set up Supabase Access Token:
   - Go to https://supabase.com/dashboard/account/tokens
   - Create a new personal access token
   - Add it to `terraform.tfvars` as `supabase_access_token`
5. Get your Supabase Organization ID:
   - Go to https://supabase.com/dashboard/organizations
   - Copy your organization ID
   - Add it to `terraform.tfvars` as `supabase_organization_id`

## Setup

1. **Configure Terraform Cloud** (see `TERRAFORM_CLOUD.md`):
   - Update `main.tf` with your Terraform Cloud organization name
   - Authenticate: `terraform login`
   
2. **Configure Terraform Cloud Workspace Variables** (if using remote execution):
   - Go to your workspace in Terraform Cloud
   - Add these as **Environment Variables** (mark sensitive ones):
     - `VERCEL_API_TOKEN` (sensitive)
     - `TF_VAR_supabase_access_token` (sensitive)
     - `TF_VAR_supabase_database_password` (sensitive)
     - `TF_VAR_github_repo`
     - `TF_VAR_supabase_organization_id`
     - `TF_VAR_supabase_project_name`
     - `TF_VAR_supabase_region`

3. Copy `terraform.tfvars.example` to `terraform.tfvars` (for local execution)
4. Fill in your values in `terraform.tfvars`:
   - GitHub repository
   - Supabase access token and organization ID
   - Database password (minimum 8 characters)
   - Vercel API token (optional if using environment variable)
4. Initialize Terraform: `terraform init`
   - This will connect to Terraform Cloud and create the workspace if needed
5. Review the plan: `terraform plan`
6. Apply the configuration: `terraform apply`

**Note**: State is now stored remotely in Terraform Cloud, providing state locking and collaboration features.

## Supabase Resources

Terraform will create:
- **Supabase Project**: A new project with the specified name and region
- **Project Settings**: API configuration for the project

**Important**: After the project is created, you must:
1. Run the SQL migrations from `../migrations/` in the Supabase SQL Editor:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_seed_topics.sql`
2. The project URL and anon key will be automatically used by Vercel

**Note**: The database password is set during project creation and will not be changed by Terraform (protected by `ignore_changes` lifecycle rule).

## Vercel Setup

Terraform will:
- Create a Vercel project
- Connect it to your GitHub repository
- Set environment variables
- Enable automatic deployments from `main` branch

## Commands

- `terraform init` - Initialize Terraform
- `terraform plan` - Preview changes
- `terraform apply` - Apply changes
- `terraform destroy` - Destroy all resources
