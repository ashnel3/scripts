OUTPUT=$(shell realpath ./build/testing)

all:
	@mkdir -p $(OUTPUT)
	@for dir in $(wildcard script/*); do \
		OUTPUT=$(OUTPUT)                 \
		$(MAKE) -C $$dir;                \
	done

clean:
	rm -rf $(OUTPUT)
