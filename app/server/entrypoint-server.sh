#!/bin/sh

if [ ! -d "/app/prisma/migrations" ]
then
	npx prisma migrate dev --name init
	npx prisma generate
fi

npm run start:dev
