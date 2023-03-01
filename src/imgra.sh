#!/usr/bin/env bash

# Remove alpha channel from image

[[ ! -f "$1" ]] \
  && echo "Error: missing argument image!" >&2 \
  && exit 1

magick "$1" -alpha off -background white -flatten "$(basename "$1" ".${1##*.}").jpg"
