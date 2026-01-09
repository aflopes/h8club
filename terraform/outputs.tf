# Vercel Outputs
output "vercel_project_id" {
  description = "Vercel project ID"
  value       = vercel_project.h8club.id
}

# Note: Vercel project URL is not available as an attribute
# The project will be accessible at https://{project-name}.vercel.app after first deployment
output "vercel_project_url" {
  description = "Vercel project URL (constructed from project name)"
  value       = "https://${vercel_project.h8club.name}.vercel.app"
}

# Supabase Outputs
output "supabase_project_id" {
  description = "Supabase project ID"
  value       = supabase_project.h8club.id
}

output "supabase_project_ref" {
  description = "Supabase project reference ID"
  value       = supabase_project.h8club.id
}

output "supabase_project_url" {
  description = "Supabase project URL"
  value       = "https://${supabase_project.h8club.id}.supabase.co"
}

output "supabase_anon_key" {
  description = "Supabase anonymous key"
  value       = data.supabase_apikeys.h8club.anon_key
  sensitive   = true
}

output "supabase_service_role_key" {
  description = "Supabase service role key (keep secret!)"
  value       = data.supabase_apikeys.h8club.service_role_key
  sensitive   = true
}
