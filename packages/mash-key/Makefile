OUTPUT?=./build
INPUT=MashKey.ahk

$(OUTPUT)/$(INPUT): $(INPUT)
	@mkdir -p "$(OUTPUT)"
	@cp $^ $@

start:
	AutoHotkey $(INPUT)

.PHONY: start
