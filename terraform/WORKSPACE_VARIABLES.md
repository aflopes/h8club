# Terraform Cloud Workspace Variables

This document lists all required variables for the H8CLUB Terraform workspace.

## Required Environment Variables

Set these in Terraform Cloud: **Settings > Variables > Add Variable** (select "Environment variable")

| Variable Name | Sensitive | Description | Where to Get It |
|--------------|-----------|-------------|-----------------|
| `VERCEL_API_TOKEN` | ✅ Yes | Vercel API token | https://vercel.com/account/tokens |
| `TF_VAR_supabase_access_token` | ✅ Yes | Supabase personal access token | https://supabase.com/dashboard/account/tokens |
| `TF_VAR_supabase_database_password` | ✅ Yes | Database password (min 8 chars) | Choose a secure password |

## Required Terraform Variables

Set these in Terraform Cloud: **Settings > Variables > Add Variable** (select "Terraform variable")

| Variable Name | Sensitive | Description | Example |
|--------------|-----------|-------------|---------|
| `github_repo` | No | GitHub repository | `aflopes/h8club` |
| `supabase_organization_id` | No | Supabase organization ID | `zkorqssbizxfpjqqzdii` |
| `supabase_project_name` | No | Supabase project name | `H8CLUB` |
| `supabase_region` | No | AWS region | `eu-west-1` |

## Quick Setup

1. Go to your workspace: https://app.terraform.io/app/h8club/h8club
2. Navigate to **Settings > Variables**
3. Click **+ Add variable** for each variable above
4. For sensitive variables, check the **Sensitive** checkbox
5. Save each variable

## Variable Naming

- **Environment variables** are passed directly to Terraform (e.g., `VERCEL_API_TOKEN`)
- **Terraform variables** are prefixed with `TF_VAR_` when set as environment variables (e.g., `TF_VAR_github_repo`)
- Alternatively, you can set Terraform variables directly without the `TF_VAR_` prefix in the Terraform Cloud UI
