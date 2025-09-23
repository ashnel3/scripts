OUTPUT?=./build
INPUT=AutoLoad.ahk

$(OUTPUT)/$(INPUT): $(INPUT)
	@mkdir -p "$(OUTPUT)"
	@cp $^ $@

start:
	AutoHotkey $(INPUT)

.PHONY: start
