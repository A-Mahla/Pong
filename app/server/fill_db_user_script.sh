curl -i -X POST http://localhost:3500/api/auth/signup -H "Content-Type: application/json" -d '{"login":"sacha", "password":"lahlou", "avatar":"slahlou.jpg"}'

curl -i -X POST http://localhost:3500/api/auth/signup -H "Content-Type: application/json" -d '{"login":"gus", "password":"alorain", "avatar":"alorain.jpg"}'

curl -i -X POST http://localhost:3500/api/auth/signup -H "Content-Type: application/json" -d '{"login":"amir", "password":"mahla", "avatar":"amahla.jpg"}'


curl -i -X POST http://localhost:3500/api/auth/signup -H "Content-Type: application/json" -d '{"login":"random", "password":"user"}'