IMAGE_NAME=website-ceei
CONTAINER_NAME=website-ceei

start:
	docker build -t $(IMAGE_NAME) . 
	docker run -d --name $(CONTAINER_NAME) -p 3000:3000 $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME) && docker rm $(CONTAINER_NAME)

restart:
	$(MAKE) stop
	$(MAKE) start
