IMAGE_NAME=website-ceei
CONTAINER_NAME=website-ceei

start:
	docker compose up --build -d

stop:
	docker stop $(CONTAINER_NAME) && docker rm $(CONTAINER_NAME)

restart:
	docker compose down
	docker compose up --build -d

run:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f
	docker compose logs -f
