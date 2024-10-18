#!/usr/bin/env bash

set -euo pipefail

[ "$#" -lt 1 ] \
    && >&2 echo "Error: expected a playlist path!" \
    && exit 1
[ "$#" -lt 2 ] \
    && >&2 echo "Error: expected file paths!" \
    && exit 1

playlist_path="${1-out.m3u}"
shift
{
    for path in $@; do
        echo "$path"
    done
} >> "$playlist_path"
