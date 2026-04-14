#!/bin/bash
set -e
cd "$(dirname "$0")"

rm -f .git/index.lock
git add -A

git commit -m "Add wreck mark, racing/mooring buoy, new danger mark + expanded study material

New buoy types added to BUOY_DATA with SVG rendering:
- Emergency wreck marking buoy (Vragafmærkning):
  blue/yellow vertical stripes, yellow cross topmark
- Racing / mooring buoy (Kapsejlads-/fortøjningstønde):
  yellow/orange spherical buoy, no nav significance
- New danger mark: standard IALA mark + Racon 'D' / AIS

Study material expanded:
- New section: Emergency Wreck Mark & New Danger
- New section: Racing Marks, Mooring Buoys & Beacons
  (covers sejladsbåker, kabelbåker, skydeområder, etc.)
- Updated topic subtitle for broader coverage

Quiz updates:
- 3 new visual identification questions (wreck, racing, new danger)
- 3 new text-based questions on new mark types
- All 14 mark types now in buoy identification exercise
- Danish terminology expanded with 6 new buoyage terms"

git push origin main

echo ""
echo "✅ Pushed! Railway will auto-deploy."
echo "   https://dulighedsbevis-production.up.railway.app/"
