#!/bin/sh

if [ ! -d "/app/prisma/migrations" ]
then
	npx prisma migrate dev --name init
	npx prisma generate
	npm run start:dev
else
	npm run start:dev
fi
