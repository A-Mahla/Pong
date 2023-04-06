NAME		:= pong

all			: ${NAME}

${NAME}		: dev

prod		:
			docker compose up --build

dev			:
			docker compose -f docker-compose.dev.yml up --build

compose		:
			docker-compose -f docker-compose.dev.yml up --build

clean		: clean-dev

clean-prod	:
			docker compose down

clean-dev	:
			docker compose -f docker-compose.dev.yml down

clean-comp	:
			docker-compose -f docker-compose.dev.yml down

fclean 		: fclean-dev

fclean-prod	: clean-prod
			docker system prune -af
			docker rmi postgres:latest nestjs:latest react:latest nginx_proxy:latest -f
			docker volume rm postgres -f
			rm -rf ./app/server/prisma/migrations

fclean-dev	: clean-dev
			docker system prune -af
			docker rmi postgres:latest nestjs:latest react:latest nginx_proxy:latest -f
			docker volume rm postgres -f
			rm -rf ./app/server/prisma/migrations

fclean-comp	: clean-comp
			docker system prune -af
			docker rmi postgres:latest nestjs:latest react:latest nginx_proxy:latest -f
			docker volume rm postgres -f
			rm -rf ./app/server/prisma/migrations

re			: re-dev

re-prod		: fclean-prod
			make prod

re-dev		: fclean-dev
			make dev

re-comp		: fclean-comp
			make compose

.PHONY: pong all dev prod compose clean clean-dev clean-prod clean-comp fclean fclean-dev fclean-prod fclean-comp re re-dev re-prod re-comp
