#!/bin/bash
set -e
cd "$(dirname "$0")"

rm -f .git/index.lock
git add -A

git commit -m "Add all IALA buoy types + complete bell/gong/morse fog signals

Buoyage (from Søfartsstyrelsen IALA System A poster):
- Emergency wreck marking buoy: blue/yellow stripes, yellow cross
- Racing/mooring buoy: yellow/orange, no nav significance
- New danger mark: standard IALA + Racon D / AIS
- 3 new SVG components, 6 new quiz questions (visual + text)
- Study sections: wreck marks, beacons (båker types)
- 6 new Danish buoyage terms

Sound signals (from sailing school teaching material):
- Expanded from 12 → 20 SOUND_SIGNALS entries
- Added: overtake agreement (Charlie), Morse H (pilot),
  anchor bell (<100m / ≥100m with gong), Morse R (Romeo),
  aground bell signals, dredging vessel signals
- New audio: bell (1200Hz sine decay), gong (220Hz resonant),
  bellstroke (single ping), belldouble (two quick pings)
- SignalPatternSVG: new visual icons for bell/gong/bellstroke
- Study material split into Manoeuvre + Fog sections
- 7 new COLREGS quiz questions on bell/gong/fog signals
- Teacher note: every bell/gong signal = decreased manoeuvrability"

git push origin main

echo ""
echo "✅ Pushed! Railway will auto-deploy."
echo "   https://dulighedsbevis-production.up.railway.app/"
