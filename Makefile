PACKAGES := $(wildcard packages/*)

OUTPUT ?= $(shell realpath ./build)

all: $(PACKAGES)
	@for dir in $^; do \
		OUTPUT=$(OUTPUT) $(MAKE) -C $$dir;   \
	done

clean:
	@rm -rf $(OUTPUT)
