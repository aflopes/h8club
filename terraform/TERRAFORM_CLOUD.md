# Terraform Cloud Setup

This project uses Terraform Cloud for remote state management and collaboration.

## Prerequisites

1. Create a Terraform Cloud account at https://app.terraform.io
2. Create an organization (or use an existing one)
3. Create a workspace (or it will be created automatically on first `terraform init`)

## Configuration

### Option 1: Update main.tf directly (Recommended)

Edit `terraform/main.tf` and update the `cloud` block:

```hcl
cloud {
  organization = "your-organization-name"
  workspaces {
    name = "h8club"  # or your preferred workspace name
  }
}
```

### Option 2: Use Environment Variables

Set these environment variables before running Terraform:

```bash
export TF_CLOUD_ORGANIZATION="your-organization-name"
export TF_WORKSPACE_NAME="h8club"
```

Then update `main.tf` to use them:

```hcl
cloud {
  organization = getenv("TF_CLOUD_ORGANIZATION")
  workspaces {
    name = getenv("TF_WORKSPACE_NAME")
  }
}
```

**Note**: The `getenv()` function is not available in the `cloud` block. You'll need to hardcode or use a different approach.

### Option 3: Use terraform.auto.tfvars (Not supported for cloud block)

The `cloud` block doesn't support variables from tfvars files. You must either:
- Hardcode the values in `main.tf`
- Use environment variables with a wrapper script
- Use Terraform Cloud's CLI configuration

## Authentication

Terraform Cloud uses API tokens for authentication. You can authenticate in two ways:

### Method 1: Terraform Login (Recommended)

```bash
terraform login
```

This will open your browser and create a credentials file at `~/.terraform.d/credentials.tfrc.json`

### Method 2: API Token

1. Go to https://app.terraform.io/app/settings/tokens
2. Create a new user token
3. Set it as an environment variable:

```bash
export TF_TOKEN_app_terraform_io="your-token-here"
```

## Initial Setup

1. Update the `cloud` block in `terraform/main.tf` with your organization name
2. Run `terraform init`
3. Terraform will prompt you to create the workspace if it doesn't exist
4. Confirm workspace creation

## Workspace Configuration

After the workspace is created, configure it in Terraform Cloud:

1. Go to your workspace in Terraform Cloud
2. Set up **Variables** (Settings > Variables):
   - **Environment Variables** (mark sensitive ones):
     - `VERCEL_API_TOKEN` (sensitive) - **REQUIRED**
     - `TF_VAR_supabase_access_token` (sensitive)
     - `TF_VAR_supabase_database_password` (sensitive)
   - **Terraform Variables**:
     - `github_repo`
     - `supabase_organization_id`
     - `supabase_project_name`
     - `supabase_region`
3. Configure **General Settings**:
   - Set execution mode (Remote or Local)
   - Configure version control integration if desired

**Important**: The `VERCEL_API_TOKEN` environment variable is **required** for the Vercel provider to work.

## Remote Execution vs Local Execution

### Remote Execution (Recommended for teams)
- Runs `terraform plan` and `terraform apply` in Terraform Cloud
- Requires workspace to be connected to version control
- Provides better collaboration and audit trails

### Local Execution
- Runs commands on your local machine
- State is stored in Terraform Cloud
- Good for development and testing

To use local execution, set the workspace execution mode to "Local" in Terraform Cloud UI.

## Benefits of Terraform Cloud

- **Remote State**: State is stored securely in Terraform Cloud
- **State Locking**: Prevents concurrent modifications
- **Collaboration**: Team members can work together safely
- **History**: Full history of state changes
- **Notifications**: Get notified of plan/apply results
- **Cost**: Free for up to 5 users

## Troubleshooting

### "No Terraform Cloud token found"

Run `terraform login` to authenticate.

### "Workspace not found"

The workspace will be created automatically on first `terraform init` if it doesn't exist.

### "Organization not found"

Verify your organization name in Terraform Cloud. Organization names are case-sensitive.
