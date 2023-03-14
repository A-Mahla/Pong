
export type GameDataType = {
	roomInfo: {
		//roomId: string, // not sure yet i need it
		countDownRequired: boolean,
		canvasHeight: number,
		canvasWidth: number,
		playerHeight: number
		playerWidth: number
	}
	player1: {
		login?: string,
		y: number,
		score: number
	},
	player2: {
		login?: string,
		y: number,
		score: number
	},
	ball: {
		x: number,
		y: number,
		r: number,
		speed: {
			x: number,
			y: number
		}
	}
}

export interface RoomInfo {
	roomId: string
}

export interface playerInfo {
	roomID: string,
	playerID: string,
	playerRole: "p1" | "p2"
}
