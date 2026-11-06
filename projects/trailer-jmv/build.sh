#!/bin/sh
# Tráiler completo con un comando: captura del juego real → imagen → sonido → máster.
# LIB = librería de estilos (render); GAME = carpeta del juego (repo de la web).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/home/user/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "LIB debe apuntar a la librería (core/render/video.mjs)"; exit 1; }
cd "$HERE"
[ -d out/clips/enmascarado-fin ] || node tools/capture.mjs
[ -d out/clips/recuerdo ] || node tools/capture-recuerdo.mjs
[ -f assets/pepe.png ] || node tools/assets.mjs
node --test "tests/**/*.test.js"
node -e "import('./src/timeline.js').then(m=>require('fs').writeFileSync('out/timeline.json',JSON.stringify({DUR:m.DUR,BEAT:m.BEAT,SECS:m.SECS,EV:m.EV,PALETTE_STEPS:m.PALETTE_STEPS,HITS:m.HITS})))"
"$LIB/.venv/bin/python" tools/score.py out/timeline.json out/mix.wav
cd "$LIB"
node core/render/video.mjs "$HERE" --fps 24 --size 1080x1920 --workers 4 --out "$HERE/out/video.mp4"
cd "$HERE"
sh tools/master.sh out/video.mp4 out/mix.wav trailer-jmv.mp4
ffmpeg -y -loglevel error -ss 46 -i trailer-jmv.mp4 -frames:v 1 -q:v 2 poster.jpg
echo "listo: $HERE/trailer-jmv.mp4"
