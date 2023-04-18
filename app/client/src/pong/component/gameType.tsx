

export type GameData = {
	roomInfo: {
		//roomId: string,

		duration: number
		timer: number
		countDown: number
		playerHeigth: number
		margin?:number
		scaledPlayerheight?: number
		scaledPlayerwidth?: number
	}
	player1: {
		login?: string
		avatar?: string,
		y: number,
		score: number
	},
	player2: {
		login?: string,
		avatar?: string,
		y: number,
		score: number
	},
	ball: {
		x: number,
		y: number,
		r: number,
		speed?: {
			x: number,
			y: number
		}
	}
}

export type constants = {
	gameDuration: number;
	margin: number;

	Playerheight: number;
	Playerwidth: number;

	ballRad: number;

	p1Login?: string;
	// p1Avatar: string;

	p2Login?: string;
	// p2Avatar: string;

	playerYratio: number

	ballXratio: number
	ballYratio: number

}


// here i keep only the data that need to be constantly refresh to ease the computing during game
export type updateData = {
	timer: number
	countDown: number
	p1y: number
	p1score: number
	p2y: number
	p2score: number
	bx: number
	by: number
}
