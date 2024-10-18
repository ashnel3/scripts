OUTPUT?=../../build
SOURCES=$(wildcard *.sh)

all: $(SOURCES)
	@mkdir -p $(OUTPUT)
	@for f in $^; do                      \
		cp "$$f" "$(OUTPUT)/$${f%.sh}";  \
	done
