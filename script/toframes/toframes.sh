#!/usr/bin/env bash

set -euo pipefail

[ "$#" -lt 1 ] \
    && >&2 echo "Error: expected a file path!" \
    && exit 1

filepath="${1-}"
filefmt="${2-bmp}"
filename="${filepath##*/}"

ffmpeg -i "$filepath" -r 1/1 "${filename%.*}%04d.$filefmt"
