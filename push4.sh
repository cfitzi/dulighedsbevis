#!/bin/bash
set -e
cd "$(dirname "$0")"

# Clean up any stale lock files
rm -f .git/index.lock

# Stage all changes
git add -A

# Commit
git commit -m "Full course correction chain: COG→CTW→CTS→CM→CC

Interactive current triangle redesigned:
- Current drift shown at destination (B) — where you'd end up uncorrected
- Triangle: A→Bcomp (CTW) + current (Bcomp→B) = A→B (COG)
- Leeway (wind) with port/starboard toggle and visual arc
- Full TVMDC chain: variation + deviation → magnetic + compass course
- Correction chain pipeline displayed below diagram
- Touch support for mobile drag
- Static study diagram updated to match

Also includes all previous features:
- Spaced repetition, review mistakes, Danish terms
- Exam timer, CDMVT pipeline, vessel lights fix
- Buoy quiz label fix, compass rose clipping fix"

# Push
git push origin main

echo ""
echo "✅ Pushed! Railway will auto-deploy from main."
echo "   Check: https://dulighedsbevis-production.up.railway.app/"
