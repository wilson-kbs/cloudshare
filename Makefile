args="$(filter-out $@,$(MAKECMDGOALS))"
dev:
	docker-compose -f docker-compose.yml --env-file ./config/.env.dev --profile dev up

reset:
	docker-compose -f docker-compose.yml --env-file ./config/.env.dev rm

restart:
	docker-compose -f docker-compose.yml --env-file ./config/.env.dev --profile dev restart $(call args)


%:      # thanks to chakrit
	@:    # thanks to William Pursell
