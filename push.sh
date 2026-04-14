#!/bin/bash
set -e
cd "$(dirname "$0")"

# Clean up broken git state from previous attempt
rm -rf .git
rm -rf node_modules 2>/dev/null || sudo rm -rf node_modules 2>/dev/null || true

# Fresh init
git init
git branch -M main
git remote add origin https://github.com/cfitzi/dulighedsbevis.git

# Stage everything (respects .gitignore)
git add -A

# Commit
git commit -m "Initial commit: duelighedsbevis exam prep app with Docker/Railway deployment

React single-file app covering all 7 exam topics with study material,
interactive quizzes (119 questions), visual identification exercises for
vessel lights and buoy marks, and per-topic mastery tracking.

Dockerised with Vite build + nginx for Railway deployment.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

# Push
git push -u origin main

echo ""
echo "✅ Pushed to https://github.com/cfitzi/dulighedsbevis"
