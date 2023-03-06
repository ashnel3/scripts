#!/usr/bin/env bash

CSV_SEPERATOR=".separator ','"

# Create csv files from a sqlite db
# ex: sqlite2csv db.sqlite test.csv -> test.tablea.csv test.tableb.csv...

sqlite2csv() {
  local tables=($(sqlite3 "$1" .tables))
  echo "Saving tables to: \"$2.*.csv\"..."
  for t in "${tables[@]}"; do
    local filename="$2.$t.csv"
    echo "  - Writing \"$filename\""
    {
      sqlite3 "$1" \
        "$CSV_SEPERATOR ','" \
        "SELECT name FROM pragma_table_info('$t');"
      echo ""
      sqlite3 "$1" \
        "$CSV_SEPERATOR" \
        "SELECT * FROM '$t';"
    } >> "$2.$t.csv"
  done
  echo "Saved ${#tables[@]} tables!"
}

[[ "${1##*.}" != "sqlite" ]] \
  && echo "Error: invalid sqlite file: \"$1\"!" >&2 \
  && exit 1
[[ ! -f "$1" ]] \
  && echo "Error: failed to find file: \"$1\"!" >&2 \
  && exit 1
[[ "${2##*.}" != "csv" ]] \
  && echo "Error: invalid csv path: \"$2\"!" >&2 \
  && exit 1

sqlite2csv "$1" "$(basename "$2" ".csv")"
