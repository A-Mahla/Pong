# =========== Dockerfile for devlopment ===========

FROM		node:19-alpine AS builder

RUN			npm install -g npm@9.5.1 \
			&& apk --no-cache add curl

WORKDIR		/app

COPY		. /app/

RUN			npm --silent install

EXPOSE		3000

ENTRYPOINT ["sh", "/app/entrypoint-server.sh"]
