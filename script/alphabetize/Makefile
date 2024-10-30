OUTPUT?=../../build
SOURCES=$(wildcard *.py)

all: $(SOURCES)
	@mkdir -p $(OUTPUT)
	@for f in $^; do                      \
		cp "$$f" "$(OUTPUT)/$${f%.py}";  \
	done
