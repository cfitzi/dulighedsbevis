#!/bin/bash
set -e
cd "$(dirname "$0")"

rm -f .git/index.lock
git add -A

git commit -m "Add preferred channel marks, fix buoy quiz loop, add course explainer

Buoy identification quiz:
- Added preferred channel to starboard (red+green band) and
  preferred channel to port (green+red band) with SVG rendering
- Quiz now has finite rounds: cycles through all 11 marks once
- Progress bar shows question X of 11
- Completion screen with score and mistake review
- Next button shows 'See Results' on last question
- Mistakes tracked and displayed with SVGs on results screen

Course correction explainer:
- Two scenario cards: COG→CC (planning) and CC→COG (position fix)
- Gilleleje→Kullen planning scenario with realistic numbers
- Anholt lighthouse bearing fix scenario
- Sign rule summary with TVMDC/CDMVT mnemonics

Interactive current triangle improvements:
- Bigger correction chain, bearing readout panel, 3-col controls
- CTS line proportional length, bigger leeway arc"

git push origin main

echo ""
echo "✅ Pushed! Railway will auto-deploy."
echo "   https://dulighedsbevis-production.up.railway.app/"
