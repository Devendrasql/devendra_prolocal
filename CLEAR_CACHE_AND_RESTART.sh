#!/bin/bash

echo "🧹 Clearing all caches..."

cd "$(dirname "$0")/portfolio-backend"

# Kill any running dev servers
echo "Stopping any running dev servers..."
pkill -f "next dev" 2>/dev/null || true

# Clear Next.js cache
echo "Clearing Next.js cache..."
rm -rf .next

# Clear node cache
echo "Clearing node cache..."
rm -rf node_modules/.cache

echo ""
echo "✅ All caches cleared!"
echo ""
echo "Now run these commands:"
echo "  cd portfolio-backend"
echo "  npm run dev"
echo ""
echo "Then in your browser:"
echo "  1. Press Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)"
echo "  2. Or open DevTools (F12) -> Right-click refresh -> 'Empty Cache and Hard Reload'"
