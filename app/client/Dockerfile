# =========== Dockerfile for devlopment ===========

FROM		node:19-alpine

RUN			npm install -g npm@9.5.1

WORKDIR		/app

COPY		. /app/

RUN			npm --silent install 

EXPOSE		5173

ENTRYPOINT ["npm", "run", "dev"]
