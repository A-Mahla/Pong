# =========== Dockerfile for devlopment ===========

FROM		node:19-alpine

WORKDIR		/app

COPY		. /app/

RUN			npm --silent install 

EXPOSE		5173

ENTRYPOINT ["npm", "run", "dev"]
