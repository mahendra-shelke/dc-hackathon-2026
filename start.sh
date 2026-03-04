#!/bin/bash
# Kill any running vite/dev server instances
pkill -f "vite" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null
sleep 1

# Build to catch any TypeScript errors
echo "Building..."
npm run build

if [ $? -ne 0 ]; then
  echo "Build failed — fix errors before starting."
  exit 1
fi

echo "Starting dev server..."
npx vite --open
