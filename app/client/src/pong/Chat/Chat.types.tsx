
export type MessageData = {
	content: string,
	sender: string,
	time?: string,
	room?: string
}

export type State = {
	room: {
		name: string,
		id: number
	},
	messages: MessageData[]
}

export type Action = {
	type: string,
	payload: {name: string, id: number} | MessageData
}

export type User = {
	login: string,
}

export type Room = {
	id : number,
	name: string,
}

export type Message = {
	id: number,
	date: string,
	sender_id: number,
	room_id: number,
	content: string
}