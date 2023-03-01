#!/usr/bin/env bash

# Print image dimensions

[[ ! -f "$1" ]] \
  && echo "Error: missing argument image!" >&2 \
  && exit 1

magick identify -format '%w %h' "$1"
