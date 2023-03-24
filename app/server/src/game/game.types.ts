import { Socket } from "socket.io"


export interface GamePatron {
	//roomId: string, // not sure yet i need it
	countDownRequired: boolean,
	canvasHeight: number,
	canvasWidth: number,
	playerHeight: number,
	playerWidth: number
}


export const gamePatron: GamePatron = {
	//roomId: string, // not sure yet i need it
	countDownRequired: false,
	canvasHeight: 640,
	canvasWidth: 1200,
	playerHeight: 100,
	playerWidth: 5
}

export interface RoomInfo {
	roomId: string
}

export type Player = {
	id: number,
	login: string,
	playerRole: "p1" | "p2",
	playerSocket: Socket,
	socketID: string
}

export type ClientPayload = {
	id: string,
	login: string
}

export type GameDataType = {
	roomInfo: {
		//roomId: string, // not sure yet i need it
		timer: number
	},
	player1: {
		login: string,
		y: number,
		score: number,
		timeout: number
	},
	player2: {
		login: string,
		y: number,
		score: number,
		timeout: number
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

export enum Status {
	EMPTY,
	LOCKED,
	ONE_PLAYER,
	TWO_PLAYER,
	RUNNING,
	OVER
  }
