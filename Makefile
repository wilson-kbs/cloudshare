args="$(filter-out $@,$(MAKECMDGOALS))"
dev:
	docker-compose -f docker-compose.yml --env-file ./config/.env.dev --profile dev up -d

logs:
	docker-compose -f docker-compose.yml --env-file ./config/.env.dev --profile dev logs -f $(call args)

full-logs:
	docker-compose -f docker-compose.yml --env-file ./config/.env.dev --profile dev logs -f

reset:
	docker-compose -f docker-compose.yml --env-file ./config/.env.dev rm

stop:
	docker-compose -f docker-compose.yml --env-file ./config/.env.dev down

restart:
	docker-compose -f docker-compose.yml --env-file ./config/.env.dev --profile dev restart $(call args)


%:      # thanks to chakrit
	@:    # thanks to William Pursell
