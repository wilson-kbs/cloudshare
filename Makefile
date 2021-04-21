args="$(filter-out $@,$(MAKECMDGOALS))"
build:
	docker-compose build --no-cache --force-rm
	docker image prune -f --filter label=stage=builder

prod:
	docker-compose build --force-rm
	docker image prune -f --filter label=stage=builder
	docker-compose up -d

start:
	docker-compose up -d

stop:
	docker-compose down

restart:
	docker-compose restart $(call args)

rm:
	docker-compose rm

log:
	docker-compose logs -f $(call args)

logs:
	docker-compose logs -f
	
dev_start:
	docker-compose -f docker-compose.dev.yml --env-file ./config/.env.dev --profile dev up -d

dev_logs:
	docker-compose -f docker-compose.dev.yml --env-file ./config/.env.dev --profile dev logs -f $(call args)

dev_full-logs:
	docker-compose -f docker-compose.dev.yml --env-file ./config/.env.dev --profile dev logs -f

dev_reset:
	docker-compose -f docker-compose.dev.yml --env-file ./config/.env.dev rm

dev_stop:
	docker-compose -f docker-compose.dev.yml --env-file ./config/.env.dev down

dev_restart:
	docker-compose -f docker-compose.dev.yml --env-file ./config/.env.dev --profile dev restart $(call args)


%:      # thanks to chakrit
	@:    # thanks to William Pursell
