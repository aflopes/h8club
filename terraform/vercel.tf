# Vercel Project
resource "vercel_project" "h8club" {
  name      = "h8club"
  framework = "nextjs"

  # Git repository integration
  git_repository = {
    type = "github"
    repo = var.github_repo # Set via terraform.tfvars or environment variable
  }

  # Environment variables
  # Use Supabase project outputs if available, otherwise fall back to variables
  environment = [
    {
      key    = "NEXT_PUBLIC_SUPABASE_URL"
      value  = var.supabase_url != "" ? var.supabase_url : "https://${supabase_project.h8club.id}.supabase.co"
      target = ["production", "preview", "development"]
    },
    {
      key    = "NEXT_PUBLIC_SUPABASE_ANON_KEY"
      value  = var.supabase_anon_key != "" ? var.supabase_anon_key : data.supabase_apikeys.h8club.anon_key
      target = ["production", "preview", "development"]
    },
  ]

  # Automatic deployments are enabled by default when git_repository is set
}

# Vercel Project Domain (optional - if you have a custom domain)
# resource "vercel_project_domain" "h8club" {
#   project_id = vercel_project.h8club.id
#   domain     = "h8club.example.com"
# }
