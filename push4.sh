#!/bin/bash
set -e
cd "$(dirname "$0")"

# Clean up any stale lock files
rm -f .git/index.lock

# Stage all changes
git add -A

# Commit
git commit -m "Improved current triangle: bigger chain, bearing readout, better layout

Interactive current triangle improvements:
- Correction chain (COG→CTW→CTS→CM→CC) now much bigger and prominent
- Bearing readout panel on SVG shows COG/CTW/CTS/SOG in real-time
- Controls reorganised to 3 spacious columns (was cramped 4-col)
- CTS gold line proportionally longer and more visible
- Leeway arc bigger with filled background and label
- COG line thinner to visually distinguish from CTW
- Current drift shown at B (where you'd end up uncorrected)
- 3-digit bearing format (048° not 48°)
- Slider helper for consistent control layout
- Current/drift vectors hidden when drift speed is 0
- Touch support for mobile drag

Also includes all previous features:
- Spaced repetition, review mistakes, Danish terms
- Exam timer, CDMVT pipeline, vessel lights fix
- Buoy quiz label fix, compass rose clipping fix"

# Push
git push origin main

echo ""
echo "✅ Pushed! Railway will auto-deploy from main."
echo "   Check: https://dulighedsbevis-production.up.railway.app/"
