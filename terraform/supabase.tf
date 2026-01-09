# Supabase Project
resource "supabase_project" "h8club" {
  organization_id   = var.supabase_organization_id
  name              = var.supabase_project_name
  database_password = var.supabase_database_password
  region            = var.supabase_region

  # Prevent Terraform from overwriting the database password
  lifecycle {
    ignore_changes = [database_password]
  }
}

# Supabase Project Settings
resource "supabase_settings" "h8club" {
  project_ref = supabase_project.h8club.id

  # Configure API settings
  api = jsonencode({
    db_schema            = "public,storage,graphql_public"
    db_extra_search_path = "public,extensions"
    max_rows             = 1000
  })
}

# Get API keys for the project
data "supabase_apikeys" "h8club" {
  project_ref = supabase_project.h8club.id
}

# Note: Database schema and RLS policies should be applied via SQL migrations
# Run the migrations from ../migrations/ in the Supabase SQL Editor after project creation
