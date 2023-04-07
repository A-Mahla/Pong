#!/bin/sh

if [ ! -d "/app/prisma/migrations" ]
then
	npx prisma migrate deploy
	npx prisma generate
	npm run build
	node dist/main.js
else
	node dist/main.js
fi
