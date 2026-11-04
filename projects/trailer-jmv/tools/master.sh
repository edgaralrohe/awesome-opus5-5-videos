#!/bin/sh
# Máster (tools/master.py: −14 LUFS, limitador a −1,5 dBFS) y mux sin grano (estilo de píxel).
# Sustituye a core/render/mux.sh porque esta máquina tiene ffmpeg 6 (plan, Riesgos).
set -e
V=$1; A=$2; OUT=$3
"${LIB:-/home/user/lemo-opuscar}/.venv/bin/python" tools/master.py "$A" out/master.wav
ffmpeg -y -loglevel error -i "$V" -i out/master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p' | grep -E "I:|Peak:" | tr -s ' '
