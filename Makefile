stop-all:
	 bash ../scripts/docker-stop-all.sh

build:
	docker compose build;

setup: build
	docker compose run --no-deps --user=root:root --rm website mkdir -p /home/server; \
	docker compose run --no-deps --user=root:root --rm website chown -R 1000:1000 /home/server; \

install: setup
	docker compose run --no-deps --rm website npm install;
	npm install

bash:
	docker compose run --rm website bash

start:
	docker compose up