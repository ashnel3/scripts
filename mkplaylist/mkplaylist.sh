#!/bin/bash

set -euo pipefail

# Create playlist from files / directories
# Example: mkplaylist Music/**/* playlist_name

PLAYLIST="${!#%.*}.m3u"

[[ $# -lt 1 ]] || [[ -f "$PLAYLIST" ]] \
  && exit 1
for path in "${@:1:$#-1}"; do
  [[ ! -d "$path" ]] \
    && realpath "$path"
done > "$PLAYLIST"
