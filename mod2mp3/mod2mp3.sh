#!/bin/bash

set -euo pipefail

# Mass convert mod files to mp3
# Requires ffmepg with libopenmpt

AUDIO_BITRATE=320k

for file in *; do
  filename="${file%.*}"
  [[ -f "$file" ]] \
    && mkdir -p "$filename" \
    && echo "  - converting: $file" \
    && ffmpeg -i "$file" -ab "$AUDIO_BITRATE" -hide_banner -loglevel error -stats "$filename/$filename.mp3" \
    && mv "$file" "$filename/"
done
