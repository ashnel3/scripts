#!/usr/bin/env bash

VERSION="1.0.0"
USAGE="$(cat << EOF
usage: ahk2exe <input> [options]
description: simple ahk2exe bash wrapper

    example: ahk2exe Test.ahk -o=build/test.exe

	-i, --icon     - set icon
    -o, --output   - set output path
    --help, -h     - Display this message
    -v, --version  - Display version

EOF
)"

# strict mode
set -euo pipefail

# constants
declare -A options
options[icon]=""
options[input]=""
options[output]=""
options[base]=""
options[resourceid]=""
options[codepage]=""
options[compress]=""

ahk2exe_echo() {
	command printf %s\\n "$*" 2>/dev/null
}

ahk2exe_error() {
	>&2 ahk2exe_echo "Error: $@"
}

ahk2exe_has() {
	type "$1" > /dev/null 2>&1
}

ahk2exe_template() {
	echo "$(cat << EOF
\$AutoHotkey = Get-ItemProperty -Path 'HKLM:\SOFTWARE\AutoHotkey'
\$Ahk2Exe = \$AutoHotkey.InstallDir + '\Compiler\Ahk2Exe.exe'

& \$Ahk2Exe
EOF
)"
	return 0
}

ahk2exe_gui() {
	powershell -command "${1:-$(ahk2exe_template)}" && exit 0
}

ahk2exe_run() {
	local template="$(ahk2exe_template)"
	[[ -n "${options[input]}" ]] \
		&& template+=" /in \$(Resolve-Path -Path ${options[input]})" \
		|| ahk2exe_gui "$template"
	[[ -n "${options[icon]}" ]] \
		&& template+=" /icon \$(Resolve-Path -Path ${options[icon]})"
	[[ -n "${options[output]}" ]] \
		&& template+=" /out \$(\$ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath('${options[output]}'))"
	# run template w/ arguments
	powershell -command "$template"
}

ahk2exe_parse() {
	if ! ahk2exe_has "powershell"; then
		ahk2exe_error "failed to find 'powershell.exe'!" \
			&& exit 1
	fi
	while [ "$#" -ne 0 ]; do
		case "$1" in
			--gui ) ahk2exe_gui ;;
			-i=*|--icon=* ) options[icon]="${1#*=}" ;;
			-o=*|--out=* ) options[output]="${1#*=}" ;;
			--help|-h ) ahk2exe_echo "$USAGE" && exit 0 ;;
			-v|--version ) ahk2exe_echo "v$VERSION" && exit 0 ;;
			./* )
				[[ -z options[input] ]] \
					&& ahk2exe_error "too many entrypoints!" \
					&& exit 1
				options[input]="$1"
			;;
			* ) ahk2exe_error "unknown argument '$1'!" && exit 1 ;;
		esac
		shift
	done
}

# parse command-line arguments & run
ahk2exe_parse $@ \
	&& ahk2exe_run
