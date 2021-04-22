args="$(filter-out $@,$(MAKECMDGOALS))"

### DEVELOPMENT
start: 
	docker-compose --env-file .env.dev up -d

stop:
	docker-compose --env-file .env.dev down

restart:
	docker-compose --env-file .env.dev restart $(call args)

log:
	docker-compose logs -f $(call args)

logs:
	docker-compose logs -f

rm:
	docker-compose rm

### PRODUCTION
build:
	docker-compose build --no-cache --force-rm
	docker image prune -f --filter label=stage=builder

prod:
	docker-compose -f docker-compose.prod.yml build --force-rm
	docker image prune -f --filter label=stage=builder
	docker-compose -f docker-compose.prod.yml up -d


start_prod:
	docker-compose -f docker-compose.prod.yml up -d


stop_prod:
	docker-compose -f docker-compose.prod.yml down


restart_prod:
	docker-compose -f docker-compose.prod.yml restart

log_prod:
	docker-compose -f docker-compose.prod.yml logs -f $(call args)


logs_prod:
	docker-compose -f docker-compose.prod.yml logs -f
	


%:      # thanks to chakrit
	@:    # thanks to William Pursell
