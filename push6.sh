#!/bin/bash
set -e
cd "$(dirname "$0")"

rm -f .git/index.lock
git add -A

git commit -m "Add IALA buoys, complete fog signals, right-of-way exercise

Buoyage (from Søfartsstyrelsen IALA System A poster):
- 3 new mark types with SVGs: wreck, racing/mooring, new danger
- 6 new quiz questions + expanded study sections + Danish terms

Sound signals (from sailing school material):
- 20 signals (was 12): added bell, gong, bellstroke, belldouble
- Overtake agreement (Charlie), Morse H (pilot), anchor/aground
  bell+gong, Morse R (Romeo), dredging vessel signals
- New audio engine: bell/gong/bellstroke synthesis via Web Audio
- Pattern SVG renders bell/gong with distinctive visual icons
- 7 new COLREGS quiz questions on fog/bell/gong signals

Right of Way exercise (from Rules of the Sea worksheet):
- 19 interactive scenarios with SVG-rendered vessel diagrams
- Power vs power: head-on, crossing, overtaking (Rules 13-15)
- Power vs sail: Rule 18 hierarchy
- Sail vs sail: port/starboard tack, windward/leeward (Rule 12)
- Night scenarios: determining tack from sidelights
- Wind arrows shown on sail-vs-sail scenarios
- Full explainers citing specific COLREGS rules after each answer
- New 'Right of Way' tab in COLREGS topic view"

git push origin main

echo ""
echo "✅ Pushed! Railway will auto-deploy."
echo "   https://dulighedsbevis-production.up.railway.app/"
