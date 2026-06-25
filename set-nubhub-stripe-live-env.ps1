<#
  set-nubhub-stripe-live-env.ps1   —   NubHub go-live (all-in-one)
  ---------------------------------------------------------------------------
  Run this yourself from the repo root. From three values you enter (hidden),
  it does the entire Stripe + Vercel wiring for the LIVE NubHub account:

    [1] creates the live Stripe Product + £9.97 GBP Price
    [2] creates the live webhook endpoint -> https://www.nubhub.baby/api/webhooks/stripe
    [3] writes 4 vars into the Vercel PRODUCTION env (project "app"):
        STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID

  Every secret is entered with HIDDEN input, used only in memory to call the
  Stripe and Vercel HTTPS APIs, and is NEVER printed or written to disk. The
  webhook signing secret is created and pushed straight to Vercel without ever
  being displayed. Claude never sees any of these values.

  You provide (hidden):
    - a Vercel API token            -> https://vercel.com/account/tokens
    - NubHub LIVE secret key        (sk_live_... ; Developers -> API keys)
    - NubHub LIVE publishable key   (pk_live_... ; same page; not secret)

  Safe to re-run: Stripe calls use idempotency keys, Vercel uses upsert.
  ---------------------------------------------------------------------------
#>

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# --- fixed config (verified) ---
$ProjectId  = 'prj_7xrykFM77uGpfSqUECCMyGirWTVN'   # Vercel project "app"
$TeamId     = 'team_8jaAKtuE9yhbFitt0ylNcZ9F'
$AppUrl     = 'https://www.nubhub.baby'
$WebhookUrl = "$AppUrl/api/webhooks/stripe"
$ApiVersion = '2025-02-24.acacia'                  # matches app/lib/stripe.ts
$Events     = @('checkout.session.completed','payment_intent.succeeded','payment_intent.payment_failed','charge.refunded')
$StripeApi  = 'https://api.stripe.com/v1'

function Read-Secret([string]$Prompt) {
  $s = Read-Host -Prompt $Prompt -AsSecureString
  return [System.Net.NetworkCredential]::new('', $s).Password
}

function Stripe-Post([string]$Sk, [string]$Path, [string]$Body, [string]$IdemKey) {
  $headers = @{ Authorization = "Bearer $Sk" }
  if ($IdemKey) { $headers['Idempotency-Key'] = $IdemKey }
  return Invoke-RestMethod -Method Post -Uri "$StripeApi$Path" -Headers $headers `
    -ContentType 'application/x-www-form-urlencoded' -Body $Body
}

function Set-VercelEnv([string]$Token, [string]$Key, [string]$Value) {
  if ([string]::IsNullOrWhiteSpace($Value)) { Write-Host "  - $Key skipped"; return }
  $uri  = "https://api.vercel.com/v10/projects/$ProjectId/env?upsert=true&teamId=$TeamId"
  $val  = ($Value | ConvertTo-Json)   # quoted + escaped
  $body = "{""key"":""$Key"",""value"":$val,""type"":""encrypted"",""target"":[""production""]}"
  Invoke-RestMethod -Method Post -Uri $uri -Headers @{ Authorization = "Bearer $Token" } `
    -ContentType 'application/json' -Body $body | Out-Null
  Write-Host "  + $Key set (production)" -ForegroundColor Green
}

try {
  Write-Host "NubHub go-live: Stripe live objects + Vercel production env`n" -ForegroundColor Cyan

  $vercelToken = Read-Secret "Vercel API token"
  $sk = Read-Secret "NubHub LIVE secret key (sk_live_...)"
  if (-not ($sk -match '^sk_live_')) { Write-Warning "Expected sk_live_ ; continuing anyway." }
  $pk = Read-Secret "NubHub LIVE publishable key (pk_live_...)"
  if (-not ($pk -match '^pk_live_')) { Write-Warning "Expected pk_live_ ; continuing anyway." }

  Write-Host "`n[1/3] Stripe Product + £9.97 Price (live)..." -ForegroundColor Cyan
  $prodBody = "name=$([uri]::EscapeDataString('Nub Theory Gender Prediction'))" +
              "&description=$([uri]::EscapeDataString('AI + expert-reviewed baby gender prediction from your 12-week ultrasound scan'))"
  $product = Stripe-Post $sk '/products' $prodBody 'nubhub-golive-product-v1'
  $price   = Stripe-Post $sk '/prices' "unit_amount=997&currency=gbp&product=$($product.id)" 'nubhub-golive-price-v1'
  $priceId = $price.id
  Write-Host "  product $($product.id) / price $priceId" -ForegroundColor Green

  Write-Host "[2/3] Live webhook endpoint..." -ForegroundColor Cyan
  $whBody = "url=$([uri]::EscapeDataString($WebhookUrl))&api_version=$ApiVersion&description=$([uri]::EscapeDataString('NubHub production'))"
  foreach ($e in $Events) { $whBody += "&enabled_events[]=$e" }
  $webhook = Stripe-Post $sk '/webhook_endpoints' $whBody 'nubhub-golive-webhook-v1'
  $whsec = $webhook.secret
  Write-Host "  webhook $($webhook.id) (signing secret captured, not shown)" -ForegroundColor Green

  Write-Host "[3/3] Vercel production env..." -ForegroundColor Cyan
  Set-VercelEnv $vercelToken 'STRIPE_SECRET_KEY'                  $sk
  Set-VercelEnv $vercelToken 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY' $pk
  Set-VercelEnv $vercelToken 'STRIPE_WEBHOOK_SECRET'             $whsec
  Set-VercelEnv $vercelToken 'STRIPE_PRICE_ID'                   $priceId

  Write-Host "`nDONE. price=$priceId webhook=$($webhook.id); 4 production env vars set." -ForegroundColor Green
  Write-Host "Tell Claude 'env is set' and it will deploy master + run the live smoke test." -ForegroundColor Green
}
catch {
  Write-Host "`nERROR: $($_.Exception.Message)" -ForegroundColor Red
  if ($_.ErrorDetails -and $_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor Red }
  Write-Host "Fix the issue and re-run (idempotency keys + upsert make re-runs safe)." -ForegroundColor Yellow
  exit 1
}
