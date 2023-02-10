# =========== Dockerfile for devlopment ===========

FROM		node:19-alpine AS builder

WORKDIR		/app

COPY		. /app/

RUN			npm --silent install

EXPOSE		3000

ENTRYPOINT ["sh", "/app/entrypoint-server.sh"]
