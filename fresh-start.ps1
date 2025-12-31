# Fresh Start Script - Clean Git & Prepare for Fresh Deployment
# Run this script to remove Git history and prepare for a fresh start

Write-Host "Fresh Start Script" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found. Please run this script from Portfolio/web directory." -ForegroundColor Red
    exit 1
}

Write-Host "WARNING: This will delete your Git history!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Proceeding with fresh start..." -ForegroundColor Yellow

Write-Host ""
Write-Host "Step 1: Removing Git repository..." -ForegroundColor Yellow

# Remove .git directory
if (Test-Path ".git") {
    Remove-Item -Recurse -Force .git
    Write-Host "SUCCESS: Git repository removed" -ForegroundColor Green
} else {
    Write-Host "INFO: No .git directory found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 2: Cleaning build artifacts..." -ForegroundColor Yellow

# Remove build folders
$folders = @(".next", "node_modules", ".vercel")
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Remove-Item -Recurse -Force $folder -ErrorAction SilentlyContinue
        Write-Host "SUCCESS: Removed $folder" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Step 3: Initializing fresh Git repository..." -ForegroundColor Yellow

# Initialize new Git repo
git init
Write-Host "SUCCESS: New Git repository initialized" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Creating initial commit..." -ForegroundColor Yellow

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Fresh start"
Write-Host "SUCCESS: Initial commit created" -ForegroundColor Green

Write-Host ""
Write-Host "Fresh start complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a new repository on GitHub/GitLab/Bitbucket" -ForegroundColor White
Write-Host "2. Add remote: git remote add origin [your-repo-url]" -ForegroundColor White
Write-Host "3. Push: git push -u origin main" -ForegroundColor White
Write-Host "4. Deploy to Vercel (see FRESH_START_GUIDE.md)" -ForegroundColor White
Write-Host ""
Write-Host "Full guide: See FRESH_START_GUIDE.md" -ForegroundColor Cyan
