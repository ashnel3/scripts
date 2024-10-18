OUTPUT?=../../build
SOURCES=MashKey.ahk

# TODO: ahk2exe

all: $(SOURCES)
ifeq ($(OS),Windows_NT)
	@mkdir -p $(OUTPUT)
	@cp $^ $(OUTPUT)
else
	@>&2 echo "Error: unsupported os, skipping!"
endif
