#!/usr/bin/env bash

# Scale image

[[ ! -f "$1" ]] \
  && echo "Error: invalid argument image!" >&2 \
  && exit 1
[[ ! "$2" =~ ^[0-9]+%$ ]] \
  && echo "Error: invalid argument scale!" \
  && exit 1

ext=".${1##*.}"
filename=$(basename "$1" "$ext")
magick "$1" -scale "$2" "${filename}.${2%\%}${ext}"
