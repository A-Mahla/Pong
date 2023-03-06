#!/bin/sh

if [ ! -d "/app/prisma/migrations" ]
then
	npx prisma migrate dev --name init
	npx prisma generate
	(sleep 20 && ./fill_db_user_script.sh && ./fill_db_game_script.sh && ./fill_db_UserInGame_script.sh && npx prisma studio) &
	npm run start:dev
else
	(sleep 20 && npx prisma studio) &
	npm run start:dev
fi
