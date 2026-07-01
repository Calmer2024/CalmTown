# Cloudflare R2 asset hosting

CalmTown keeps `index.html` on GitHub Pages and moves static assets to Cloudflare R2 when `R2_PUBLIC_URL` is configured.

## Cloudflare setup

1. Create an R2 bucket, for example `calmtown-assets`.
2. Add a production custom domain to the bucket, for example `assets.example.com`.
3. Add a CORS policy for the site origin:

```json
[
  {
    "AllowedOrigins": ["https://calmer2024.github.io"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 86400
  }
]
```

4. Create an R2 API token with Object Read & Write permission for this bucket.
5. Copy the R2 Account ID, Access Key ID, and Secret Access Key.

## GitHub Actions configuration

In GitHub repository Settings > Secrets and variables > Actions, add:

Secrets:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`

Variables:

- `R2_PUBLIC_URL`, for example `https://assets.example.com/`
- `R2_ASSET_PREFIX`, optional. Use this only when the public URL contains a path prefix, for example:
  - `R2_PUBLIC_URL=https://assets.example.com/CalmTown/`
  - `R2_ASSET_PREFIX=CalmTown`

When `R2_PUBLIC_URL` is empty, the site keeps using `/CalmTown/` assets from GitHub Pages.

## Local upload

PowerShell example:

```powershell
$env:R2_ACCOUNT_ID="your-account-id"
$env:R2_ACCESS_KEY_ID="your-access-key-id"
$env:R2_SECRET_ACCESS_KEY="your-secret-access-key"
$env:R2_BUCKET="calmtown-assets"
$env:R2_ASSET_PREFIX=""

npm run build
npm run upload:r2:dry-run
npm run upload:r2
```

Do not commit real `.env` files or secrets.

## Cache policy

The upload script sets:

- `assets/**`: `public, max-age=31536000, immutable`
- public root files such as `ct-logo.png` and `friends/**`: `public, max-age=86400`

`index.html` is not uploaded to R2. GitHub Pages continues to serve the entry document.
