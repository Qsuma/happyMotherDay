# Deployment Guide

## Overview

The Mother's Day website is a static React application built with Vite. It can be deployed to any static hosting platform with zero server-side requirements.

## Pre-Deployment Checklist

Before deploying to production, verify:

- [ ] All tests passing: `npm run test` ✅
- [ ] No TypeScript errors: `npm run type-check` ✅
- [ ] ESLint passes: `npm run lint` ✅
- [ ] Build succeeds: `npm run build` ✅
- [ ] Bundle size < 100KB gzipped: Check dist/ folder
- [ ] Lighthouse score ≥ 85 (Performance)
- [ ] Lighthouse score ≥ 90 (Accessibility)
- [ ] No axe-core violations
- [ ] Manual testing on target browsers complete
- [ ] Performance audit completed
- [ ] Environment variables configured

## Build Process

### Production Build

```bash
# Create optimized production build
npm run build

# Output location: dist/
# Preview build locally before deploying
npm run preview
```

### Build Optimizations

The Vite build automatically:
- ✅ Minifies JavaScript and CSS
- ✅ Tree-shakes unused code
- ✅ Generates source maps for debugging
- ✅ Creates production-optimized bundles
- ✅ Handles CSS module scoping
- ✅ Optimizes images (if applicable)

### Build Output

```
dist/
├── index.html              (0.46 KB)
├── assets/
│   ├── index-[hash].js     (63 KB gzipped)
│   └── index-[hash].css    (3.28 KB gzipped)
└── vite.svg               (if included)

Total: ~67 KB gzipped
```

## Deployment Platforms

### 1. Vercel (Recommended)

**Best for**: Optimal performance, auto-scaling, built-in analytics

#### Setup Steps

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect Git repository at https://vercel.com
# - Import GitHub repo
# - Auto-detect build settings (Vite)
# - Deploy on every push to main
```

#### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  },
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Production URL**: `https://mothers-day-website.vercel.app`

---

### 2. Netlify

**Best for**: Simple deployment, automatic SSL, form handling

#### Setup Steps

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Or connect Git at https://app.netlify.com
```

#### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_URL = "production-api-url"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Cache headers for assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Production URL**: `https://mothers-day-website.netlify.app`

---

### 3. GitHub Pages

**Best for**: Free hosting directly from GitHub, simple setup

#### Setup Steps

1. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/mothers-day-website/', // Set if repo is not username.github.io
  plugins: [react()],
});
```

2. Create GitHub Actions workflow (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npm run build
      
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Set source to "GitHub Actions"

**Production URL**: `https://username.github.io/mothers-day-website`

---

### 4. AWS S3 + CloudFront

**Best for**: Enterprise deployments, custom domain, advanced caching

#### Setup Steps

```bash
# Create S3 bucket
aws s3 mb s3://mothers-day-website

# Build and deploy
npm run build
aws s3 sync dist/ s3://mothers-day-website/ --delete

# Create CloudFront distribution
# - Set S3 bucket as origin
# - Set default root object to index.html
# - Set error page (404) to index.html for SPA routing
```

#### AWS Configuration

```bash
# Install AWS CLI
brew install awscli

# Configure credentials
aws configure

# Deploy script (save as deploy.sh)
#!/bin/bash
npm run build
aws s3 sync dist/ s3://mothers-day-website/ \
  --delete \
  --cache-control "max-age=31536000" \
  --exclude "index.html"

aws s3 cp dist/index.html s3://mothers-day-website/index.html \
  --cache-control "max-age=0, no-cache, no-store, must-revalidate"

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

**Production URL**: Custom domain (via Route 53)

---

### 5. Docker + Container Registry

**Best for**: Container-based deployments, Kubernetes, complex infrastructure

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### Build and Deploy

```bash
# Build image
docker build -t mothers-day-website .

# Test locally
docker run -p 3000:3000 mothers-day-website

# Push to registry
docker tag mothers-day-website:latest your-registry/mothers-day-website:latest
docker push your-registry/mothers-day-website:latest
```

---

## Environment Variables

### Setup

Create `.env.production`:

```env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Mother's Day Website
VITE_ENABLE_ANALYTICS=true
```

### Usage in Code

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

### Platform-Specific

**Vercel**: Set in project settings → Environment Variables

**Netlify**: Set in Site settings → Build & deploy → Environment

**GitHub Pages**: Set in Secrets → Actions secrets

---

## Performance Optimization

### Caching Strategy

```
Static Assets (images, fonts): 1 year
  Cache-Control: public, max-age=31536000, immutable

CSS/JavaScript bundles: 1 year (versioned by Vite)
  Cache-Control: public, max-age=31536000, immutable

HTML index: No cache
  Cache-Control: max-age=0, no-cache, must-revalidate
```

### CDN Configuration

**Recommended CDN**: Cloudflare (free tier available)

```
1. Add site to Cloudflare
2. Update nameservers
3. Enable:
   - Page Rules: Cache everything for static paths
   - Minify: CSS/JavaScript/HTML
   - Brotli compression
   - HTTP/3 and HTTP/2
```

---

## Monitoring & Analytics

### Performance Monitoring

Set up after deployment:

1. **Google Analytics**:
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

2. **Sentry Error Tracking** (optional):
```bash
npm install @sentry/react @sentry/tracing
```

3. **Vercel Analytics**:
   - Built-in (if using Vercel)
   - Enable in project settings

### Monitoring Checklist

- [ ] Lighthouse score tracked
- [ ] Core Web Vitals monitored
- [ ] Error rate < 1%
- [ ] Page load time < 3s
- [ ] User interactions responsive

---

## Rollback Procedures

### Vercel Rollback

```bash
vercel rollback
# Choose previous deployment
```

### Netlify Rollback

1. Go to Netlify dashboard
2. Deployments → Previous version → Set as production

### Manual Rollback (S3/CloudFront)

```bash
# Get previous build from backup
aws s3 sync s3://mothers-day-backup/ s3://mothers-day-website/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## Security Checklist

- [ ] HTTPS enforced (all platforms provide automatic SSL)
- [ ] Content Security Policy headers set
- [ ] No sensitive data in environment variables visible to client
- [ ] Dependencies up to date (`npm audit fix`)
- [ ] No console errors or warnings in production
- [ ] Build process doesn't expose source maps to public

### Security Headers

Add to platform configuration:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Troubleshooting

### Issue: 404 errors on page refresh

**Cause**: SPA routing not configured

**Solution**: Configure 404 redirect to index.html
- Vercel: Automatic ✅
- Netlify: Add redirect in `netlify.toml`
- GitHub Pages: Use [single-spa-router](https://github.com/single-spa/single-spa)
- S3: Set error page to index.html in bucket properties

### Issue: Assets not loading (404 on CSS/JS)

**Cause**: Base path not configured correctly

**Solution**: Verify `vite.config.ts` base path matches deployment URL

```typescript
export default defineConfig({
  base: '/', // Production root
  // OR
  base: '/mothers-day-website/', // Subdirectory
});
```

### Issue: High build time or memory issues

**Solution**: 
1. Use `npm ci` instead of `npm install` in CI/CD
2. Increase Node.js memory if needed:
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Issue: Images not displaying

**Solution**: 
1. Verify image paths are relative: `/images/...`
2. Check `public/` folder in Vite config
3. Ensure lazy-loading attributes don't break images

---

## Deployment Checklist Template

Before each production deployment:

```markdown
## Production Deployment Checklist - v1.0

### Code Quality
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] ESLint clean
- [ ] No console errors/warnings

### Performance
- [ ] Bundle size < 100KB
- [ ] Lighthouse: Performance ≥ 85
- [ ] Lighthouse: Accessibility ≥ 90
- [ ] Core Web Vitals passing

### Accessibility & Security
- [ ] No axe violations
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] No exposed secrets

### Testing
- [ ] E2E tests pass on target browsers
- [ ] Manual testing on mobile/tablet/desktop
- [ ] Manual testing on target devices

### Deployment
- [ ] Environment variables set
- [ ] Build command successful
- [ ] Deployment successful
- [ ] Site accessible at production URL
- [ ] Analytics tracking working

### Post-Deployment
- [ ] Monitor error rate < 1%
- [ ] Monitor page load time
- [ ] Monitor Core Web Vitals
- [ ] Rollback plan documented
```

---

## Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Vite Docs**: https://vitejs.dev
- **GitHub Pages**: https://pages.github.com
