FROM	nginx:latest

COPY	./nginx.conf /etc/nginx/conf.d/.
COPY	./nginx.conf.template /etc/nginx/templates/.

EXPOSE 8080

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
#ENTRYPOINT [ "bash" ]
