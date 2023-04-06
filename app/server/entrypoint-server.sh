#!/bin/sh

if [ ! -d "/app/prisma/migrations" ]
then
	npx prisma migrate deploy
	npx prisma generate
	npm run start:dev
else
	npm run start:dev
fi
