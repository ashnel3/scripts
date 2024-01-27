#!/bin/bash

set -euo pipefail

# Create playlist from files / directories

for path in "${@:2}"; do
  [[ ! -d "$path" ]] \
    && realpath "$path"
done > "${1%.*}.m3u"
