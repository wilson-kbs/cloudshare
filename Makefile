args="$(filter-out $@,$(MAKECMDGOALS))"

VERSION=$(shell date "+%Y.%m.%d-%H:%M:%S")

### DEVELOPMENT
start: 
	docker-compose --env-file .env.dev up -d

stop:
	docker-compose --env-file .env.dev down

restart:
	docker-compose --env-file .env.dev restart $(call args)

log:
	docker-compose --env-file .env.dev logs -f $(call args)

logs:
	docker-compose --env-file .env.dev logs -f

rm:
	docker-compose --env-file .env.dev rm

### PRODUCTION
build:
	docker image prune -a -f --filter label=stage=prod --filter label=app_name=kabaliserv_cloudshare --filter label!=version=$(VERSION)
	docker-compose -f docker-compose.prod.yml build --no-cache --force-rm --build-arg VERSION=$(VERSION)
	docker image prune -a -f --filter label=stage=builder --filter label=app_name=kabaliserv_cloudshare
	docker image prune -a -f --filter label=stage=dev --filter label=app_name=kabaliserv_cloudshare

prod:
	VERSION=$(VERSION) docker-compose -f docker-compose.prod.yml down
	docker image prune -a -f --filter label=stage=prod --filter label=app_name=kabaliserv_cloudshare --filter label!=version=$(VERSION)
	docker-compose -f docker-compose.prod.yml build --force-rm --build-arg VERSION=$(VERSION)
	docker image prune -a -f --filter label=stage=builder --filter label=app_name=kabaliserv_cloudshare
	docker image prune -a -f --filter label=stage=dev --filter label=app_name=kabaliserv_cloudshare
	docker-compose -f docker-compose.prod.yml up -d

start_prod:
	VERSION=$(VERSION) docker-compose -f docker-compose.prod.yml up -d


stop_prod:
	VERSION=$(VERSION) docker-compose -f docker-compose.prod.yml down


restart_prod:
	VERSION=`$(VERSION)` docker-compose -f docker-compose.prod.yml down
	VERSION=$(VERSION) docker-compose -f docker-compose.prod.yml up -d

remove_prod:
	VERSION=$(VERSION) docker-compose -f docker-compose.prod.yml down -v
	docker image prune -a -f --filter label=stage=prod --filter label=app_name=kabaliserv_cloudshare

log_prod:
	docker-compose -f docker-compose.prod.yml logs -f $(call args)


logs_prod:
	docker-compose -f docker-compose.prod.yml logs -f

test:
	echo $(VERSION)
	sleep 5
	echo $(VERSION)
	sleep 5
	echo $(VERSION)
	sleep 5
	echo $(VERSION)


%:      # thanks to chakrit
	@:    # thanks to William Pursell
