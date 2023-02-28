curl -i -X POST http://localhost:3500/api/auth/signup -H "Content-Type: application/json" -d '{"login":"sacha", "password":"lahlou"}'

curl -i -X POST http://localhost:3500/api/auth/signup -H "Content-Type: application/json" -d '{"login":"augustin", "password":"gus"}'

curl -i -X POST http://localhost:3500/api/auth/signup -H "Content-Type: application/json" -d '{"login":"amir", "password":"mahla"}'


curl -i -X POST http://localhost:3500/api/auth/signup -H "Content-Type: application/json" -d '{"login":"random", "password":"user"}'
