#!/bin/bash
set -e
cd "$(dirname "$0")"

rm -f .git/index.lock
git add -A

git commit -m "Add sound signals, day shapes, mock exam + course explainer

Sound Signals Exercise (COLREGS topic):
- 12 COLREGS sound signals with Web Audio API playback
- Horn sounds: 440Hz short blasts, 350Hz prolonged foghorn
- Two modes: hear signal → name it, read meaning → identify pattern
- Visual bar diagrams for each signal pattern
- Finite rounds with progress bar and mistake review
- Includes maneuvering, overtaking, and fog signals

Day Shapes Exercise (COLREGS topic):
- 10 day shapes: anchor, aground, NUC, RAM, CBD, fishing,
  sailing under motor, towing, mine clearance
- SVG rendering: balls, diamonds, cones, cylinders on a pole
- Two modes: see shape → name vessel, read type → pick shape
- Finite rounds with completion screen

Mock Exam Mode:
- 40 questions (proportionally weighted across all 7 topics)
- 45-minute time limit with countdown
- 70% pass mark (28/40) with PASS/FAIL display
- Per-topic breakdown on results screen
- Prominent mock exam card on dashboard
- Spaced repetition weighting for question selection

Also includes:
- Course correction explainer (COG→CC and CC→COG scenarios)
- Preferred channel buoy marks + SVGs
- Fixed buoy quiz loop (finite rounds)
- Improved interactive current triangle"

git push origin main

echo ""
echo "✅ Pushed! Railway will auto-deploy."
echo "   https://dulighedsbevis-production.up.railway.app/"
