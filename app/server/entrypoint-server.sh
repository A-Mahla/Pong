#!/bin/sh
if [ ! -d "/app/prisma/migrations" ]
then
#	npx prisma migrate deploy
	npx prisma migrate dev --name init \
	&& npx prisma generate \
	&& npm run build
	(cp -r /app/dist/* /app/save/. && mv /app/save/.dev /app/save/.prod) &
	node dist/main.js
else
	npx prisma generate \
	&& node save/main.js
fi
