<#
  set-nubhub-stripe-webhook-secret.ps1

  Fixes the live Stripe webhook signature failures on nubhub.baby by syncing
  STRIPE_WEBHOOK_SECRET in Vercel (production) to the signing secret of the live
  webhook endpoint in Stripe.

  WHY THIS IS NEEDED
  ------------------
  /api/webhooks/stripe has been returning 400 "No signatures found matching the
  expected signature" because the STRIPE_WEBHOOK_SECRET stored in Vercel does not
  match the secret Stripe uses to sign events for the live endpoint.

  WHERE TO GET THE VALUE
  ----------------------
  Stripe Dashboard (LIVE mode, top-left toggle must NOT say "Test mode"):
    Developers -> Webhooks -> click the endpoint pointing to
    https://nubhub.baby/api/webhooks/stripe -> "Signing secret" -> Reveal.
  It looks like:  whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  This script NEVER prints the value, never sends it anywhere except Vercel, and
  never writes it to disk. You paste it into a hidden prompt; it goes straight to
  Vercel via the CLI.

  PREREQS
  -------
  - Vercel CLI: install with  npm i -g vercel   (or this script will use npx).
  - You must be logged in:  vercel login
  - This repo's app must be linked to the Vercel "app" project. If not linked,
    the script will run `vercel link` first (pick the team + the "app" project).

  USAGE
  -----
  Run from the repo root in PowerShell:
    ./set-nubhub-stripe-webhook-secret.ps1
  After it finishes, REDEPLOY (env changes only take effect on a new deployment) —
  either push to master, or run:  vercel --prod
#>

$ErrorActionPreference = 'Stop'
$VarName = 'STRIPE_WEBHOOK_SECRET'

function Invoke-Vercel {
    param([Parameter(ValueFromRemainingArguments = $true)] [string[]] $Args)
    # Prefer a globally-installed `vercel`; fall back to npx.
    if (Get-Command vercel -ErrorAction SilentlyContinue) {
        & vercel @Args
    } else {
        & npx --yes vercel @Args
    }
}

Write-Host "== NubHub: set $VarName for Vercel production ==" -ForegroundColor Cyan

# Ensure the project is linked (creates .vercel/project.json). Safe to re-run.
if (-not (Test-Path ".vercel/project.json")) {
    Write-Host "Project not linked yet - launching 'vercel link' (choose the 'app' project)..." -ForegroundColor Yellow
    Invoke-Vercel link
}

# Prompt for the secret with HIDDEN input. Value stays in a SecureString and is
# only converted to plain text in-memory at the moment it is piped to Vercel.
$secure = Read-Host -AsSecureString "Paste the Stripe LIVE webhook signing secret (whsec_...)"
$bstr   = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
    $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
}

if ([string]::IsNullOrWhiteSpace($plain)) {
    Write-Host "No value entered - aborting, nothing changed." -ForegroundColor Red
    exit 1
}
if (-not $plain.StartsWith('whsec_')) {
    Write-Host "That doesn't look like a Stripe signing secret (should start 'whsec_'). Aborting." -ForegroundColor Red
    exit 1
}

# Remove any existing production value first (ignore error if it doesn't exist),
# then add the new one. `vercel env add` reads the value from stdin.
Write-Host "Updating $VarName in Vercel (production)..." -ForegroundColor Cyan
try { Invoke-Vercel env rm $VarName production --yes } catch { }
$plain | Invoke-Vercel env add $VarName production

# Scrub the plaintext from memory.
$plain = $null
[GC]::Collect()

Write-Host ""
Write-Host "Done. $VarName updated in Vercel production (value not shown)." -ForegroundColor Green
Write-Host "NEXT: redeploy so it takes effect ->  push to master, or run: vercel --prod" -ForegroundColor Yellow
Write-Host "Then re-trigger a test event from Stripe (Developers -> Webhooks -> Send test event) and confirm a 200." -ForegroundColor Yellow
