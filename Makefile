COMMON_RUN_ARGS:=-it --env-file ./.env
IMG:=mbelsky/stream-to-file:latest

.PHONY: clean
clean:
	docker rmi --force $(IMG)

.PHONY: build
build:
	docker build -t $(IMG) .

.PHONY: dev
dev:
	docker run $(COMMON_RUN_ARGS) --rm $(IMG) sh
