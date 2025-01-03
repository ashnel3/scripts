OUTPUT?=./build
INPUT=./MashKey.ahk

all:
ifeq ($(OS),Windows_NT)
	@mkdir -p $(OUTPUT)
	@bash ../ahk2exe/ahk2exe.sh $(INPUT) -o=$(OUTPUT)/mash-key.exe
else
	@>&2 echo "Error: unsupported os, skipping!"
endif

start:
	AutoHotkey $(INPUT)
