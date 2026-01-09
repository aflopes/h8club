terraform {
  required_version = ">= 1.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.15"
    }
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }

  # Terraform Cloud backend for remote state
  # Organization and workspace can be set via environment variables:
  # - TF_CLOUD_ORGANIZATION (or set directly below)
  # - TF_WORKSPACE_NAME (or set directly below)
  cloud { 
    organization = "h8club" 
    workspaces { 
      name = "h8club" 
    } 
  } 
}

# Configure Vercel Provider
# API token must be provided via VERCEL_API_TOKEN environment variable
# For Terraform Cloud: Set as workspace variable VERCEL_API_TOKEN (sensitive)
# For local execution: export VERCEL_API_TOKEN=your_token
provider "vercel" {
  # Provider will automatically use VERCEL_API_TOKEN environment variable
}

# Configure Supabase Provider
provider "supabase" {
  access_token = var.supabase_access_token
}
