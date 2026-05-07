#!/bin/bash

# T077: Lighthouse Performance & Accessibility Audit
# Thresholds from specification:
# - Performance >= 85
# - Accessibility >= 90
# - LCP < 2.5s
# - CLS < 0.1
# - INP < 200ms

echo "=== Phase 6: Lighthouse Audit ==="
echo ""
echo "Running Lighthouse on http://localhost:5173 with 4G throttling..."
echo ""

npx lighthouse http://localhost:5173 \
  --chrome-flags="--headless=old --disable-gpu" \
  --throttling-method=devtools \
  --throttling='{"rttMs":150,"throughputKbps":1600,"cpuSlowdownMultiplier":4}' \
  --emulated-form-factor=mobile \
  --output=json \
  --output=html \
  --output-path=./lighthouse-report

# Parse the JSON report to show scores
if [ -f ./lighthouse-report.json ]; then
  echo ""
  echo "=== Lighthouse Scores ==="
  node -e "
    const data = require('./lighthouse-report.json');
    const categories = data.categories;
    console.log('Performance:    ', categories.performance.score * 100);
    console.log('Accessibility: ', categories.accessibility.score * 100);
    console.log('Best Practices:', categories['best-practices'].score * 100);
    console.log('SEO:           ', categories.seo.score * 100);
    console.log('');
    const metrics = data.audits.metrics.details.items[0];
    console.log('=== Core Web Vitals ===');
    console.log('LCP:', metrics.largestContentfulPaint / 1000, 's');
    console.log('CLS:', metrics.cumulativeLayoutShift);
    console.log('INP:', metrics.inputDelay || 'N/A');
  "
fi

echo ""
echo "Full report saved to: ./lighthouse-report.html"
echo ""
