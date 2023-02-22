NAME		:= pong

all			: ${NAME}

${NAME}		:
			docker compose up

compose:
			docker-compose up

clean		:
			docker compose down

clean-comp	:
			docker-compose down

fclean		: clean
			docker system prune -af
			docker rmi postgres:latest nestjs:latest react:latest -f
			docker volume rm postgres -f
			rm -rf ./app/server/prisma/migrations

fclean-comp	: clean-comp
			docker system prune -af
			docker rmi postgres:latest nestjs:latest react:latest -f
			docker volume rm postgres -f
			rm -rf ./app/server/prisma/migrations

re			: fclean
			make all
