curl -i -X POST http://localhost:3500/api/game/newInvite -H "Content-Type: application/json" -d '{
	"sender_id": 1,
	"sender_login": "sacha",
	"receiver_id": 3,
	"receiver_login": "amir",
	"ballSpeed": "7",
	"paddleSize": "100",
	"duration": "3750"
}'
