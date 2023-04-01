
curl -i -X POST -H "Content-Type: application/json" -d '{"player1": {"id": "3", "score": 15}, "player2": {"id": "1", "score": 15}}' http://localhost:3500/api/game/test/createFullGame
curl -i -X POST -H "Content-Type: application/json" -d '{"player1": {"id": "3", "score": 10}, "player2": {"id": "1", "score": 15}}' http://localhost:3500/api/game/test/createFullGame
curl -i -X POST -H "Content-Type: application/json" -d '{"player1": {"id": "3", "score": 12}, "player2": {"id": "1", "score": 6}}' http://localhost:3500/api/game/test/createFullGame
curl -i -X POST -H "Content-Type: application/json" -d '{"player1": {"id": "3", "score": 10}, "player2": {"id": "1", "score": 23}}' http://localhost:3500/api/game/test/createFullGame
curl -i -X POST -H "Content-Type: application/json" -d '{"player1": {"id": "3", "score": 19}, "player2": {"id": "1", "score": 9}}' http://localhost:3500/api/game/test/createFullGame
curl -i -X POST -H "Content-Type: application/json" -d '{"player1": {"id": "3", "score": 14}, "player2": {"id": "1", "score": 15}}' http://localhost:3500/api/game/test/createFullGame
