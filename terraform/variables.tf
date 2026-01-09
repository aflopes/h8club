variable "github_repo" {
  description = "GitHub repository in format 'owner/repo'"
  type        = string
}

# Supabase Provider Variables
variable "supabase_access_token" {
  description = "Supabase personal access token (from Account Settings > Access Tokens)"
  type        = string
  sensitive   = true
}

variable "supabase_organization_id" {
  description = "Supabase organization ID (found in organization settings)"
  type        = string
}

variable "supabase_project_name" {
  description = "Name for the Supabase project"
  type        = string
  default     = "h8club"
}

variable "supabase_region" {
  description = "AWS region for Supabase project"
  type        = string
  default     = "us-east-1"
}

variable "supabase_database_password" {
  description = "Database password for Supabase project (must be at least 8 characters)"
  type        = string
  sensitive   = true
}

# Legacy variables (for importing existing projects or manual setup)
variable "supabase_url" {
  description = "Supabase project URL (optional, will be output from project resource if not provided)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "supabase_anon_key" {
  description = "Supabase anonymous key (optional, will be output from project resource if not provided)"
  type        = string
  sensitive   = true
  default     = ""
}
