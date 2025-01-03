OUTPUT?=./build
INPUT=./AutoLoad.ahk

$(OUTPUT)/auto-load.exe: $(INPUT)
ifeq ($(OS),Windows_NT)
	@mkdir -p $(OUTPUT)
	@bash ../ahk2exe/ahk2exe.sh $^ -o=$@
else
	@>&2 echo "Error: unsupported os, skipping!"
endif

start:
	AutoHotkey $(INPUT)

.PHONY: start
