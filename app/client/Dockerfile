# =========== Build ===========

FROM		node:19-alpine as build

RUN			npm install -g npm@latest

WORKDIR		/app

COPY		. /app/

RUN			npm ci
RUN			npm run build

# =========== Production ==========

FROM	nginx:alpine

#ENV		NODE_ENV=production

COPY	--from=build /app/nginx-reverse-proxy/default.conf /etc/nginx/conf.d/.
#COPY	--from=build /app/nginx-reverse-proxy/default.conf.template /etc/nginx/templates/default.conf.template
COPY	--from=build /app/dist /var/www/html/

EXPOSE 8080

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
