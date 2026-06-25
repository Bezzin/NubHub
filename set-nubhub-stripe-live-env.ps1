<#
  set-nubhub-stripe-live-env.ps1
  ---------------------------------------------------------------------------
  Sets NubHub's LIVE Stripe keys into the Vercel PRODUCTION environment for the
  Vercel project "app" (which serves nubhub.baby from the master branch).

  You run this yourself. Every secret is entered with HIDDEN input, held only
  in memory to call the Vercel API over HTTPS, and is NEVER printed, logged, or
  written to disk. Claude never sees the values.

  Prerequisite: a Vercel API token -> https://vercel.com/account/tokens
  ---------------------------------------------------------------------------
#>

$ErrorActionPreference = 'Stop'

# NubHub production Vercel project (verified)
$ProjectId = 'prj_7xrykFM77uGpfSqUECCMyGirWTVN'
$TeamId    = 'team_8jaAKtuE9yhbFitt0ylNcZ9F'

function Read-Secret([string]$Prompt) {
  $secure = Read-Host -Prompt $Prompt -AsSecureString
  return [System.Net.NetworkCredential]::new('', $secure).Password
}

function Set-VercelEnv {
  param([string]$Token, [string]$Key, [string]$Value)
  if ([string]::IsNullOrWhiteSpace($Value)) {
    Write-Host "  - $Key skipped (nothing entered)" -ForegroundColor DarkYellow
    return
  }
  $uri  = "https://api.vercel.com/v10/projects/$ProjectId/env?upsert=true&teamId=$TeamId"
  $body = @{ key = $Key; value = $Value; type = 'encrypted'; target = @('production') } | ConvertTo-Json
  $headers = @{ Authorization = "Bearer $Token"; 'Content-Type' = 'application/json' }
  Invoke-RestMethod -Method Post -Uri $uri -Headers $headers -Body $body | Out-Null
  Write-Host "  + $Key set (production)" -ForegroundColor Green
}

Write-Host "NubHub -> Vercel production env (Stripe LIVE)" -ForegroundColor Cyan
Write-Host "Get a token from https://vercel.com/account/tokens if you don't have one.`n"

$token = Read-Secret "Vercel API token"

# --- Values from your NEW NubHub Stripe account dashboard ---
$secretKey = Read-Secret "STRIPE_SECRET_KEY  (sk_live_... or a restricted rk_live_...)"
if ($secretKey -and -not ($secretKey -match '^(sk|rk)_live_')) {
  Write-Warning "Doesn't look like a LIVE secret key (expected sk_live_ / rk_live_)."
}

$whsec = Read-Secret "STRIPE_WEBHOOK_SECRET  (whsec_...)"
if ($whsec -and -not ($whsec -match '^whsec_')) {
  Write-Warning "Doesn't look like a webhook signing secret (expected whsec_)."
}

$pubKey = Read-Secret "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  (pk_live_...)"
if ($pubKey -and -not ($pubKey -match '^pk_live_')) {
  Write-Warning "Doesn't look like a LIVE publishable key (expected pk_live_)."
}

$priceId = Read-Host "STRIPE_PRICE_ID  (price_... ; optional, Enter to skip)"

Write-Host "`nWriting to Vercel project 'app' (production target)..." -ForegroundColor Cyan
Set-VercelEnv -Token $token -Key 'STRIPE_SECRET_KEY'                  -Value $secretKey
Set-VercelEnv -Token $token -Key 'STRIPE_WEBHOOK_SECRET'             -Value $whsec
Set-VercelEnv -Token $token -Key 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY' -Value $pubKey
Set-VercelEnv -Token $token -Key 'STRIPE_PRICE_ID'                   -Value $priceId

Write-Host "`nDone. Production env updated. A fresh deploy is needed for these to take effect." -ForegroundColor Green
Write-Host "Tell Claude 'env is set' and it will push master + run the live smoke test."
