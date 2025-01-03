OUTPUT?=./build
INPUT=./AutoLoad.ahk

all:
ifeq ($(OS),Windows_NT)
	@mkdir -p $(OUTPUT)
	@bash ../ahk2exe/ahk2exe.sh $(INPUT) -o=$(OUTPUT)/auto-load.exe
else
	@>&2 echo "Error: unsupported os, skipping!"
endif

start:
	AutoHotkey $(INPUT)
