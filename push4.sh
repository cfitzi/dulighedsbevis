#!/bin/bash
set -e
cd "$(dirname "$0")"

# Clean up any stale lock files
rm -f .git/index.lock

# Stage all changes
git add -A

# Commit
git commit -m "Fix interactive current triangle & all 6 features

- Rewrite InteractiveCurrentTriangle: rename vars (ptA/ptB/ptC) to
  avoid shadowing global color palette C, use literal color strings,
  responsive SVG with viewBox, drag handles, grid dots, legend box
- Spaced repetition with weighted random question selection
- Review mistakes mode in results view
- Danish nautical terms glossary per topic
- Exam timer with countdown for mock exams
- Animated CDMVT pipeline visualisation
- Fix vessel lights exercise crash (useEffect import)
- Fix buoy quiz labels leaking answers (showLabel prop)
- Fix compass rose label clipping (padding)"

# Push
git push origin main

echo ""
echo "✅ Pushed! Railway will auto-deploy from main."
echo "   Check: https://dulighedsbevis-production.up.railway.app/"
