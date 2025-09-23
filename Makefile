PACKAGES := $(wildcard packages/*)

OUTPUT ?= $(shell realpath .)/build

all: $(PACKAGES)
	@for pkg in $^; do \
		OUTPUT=$(OUTPUT) $(MAKE) -C $$pkg; \
	done
