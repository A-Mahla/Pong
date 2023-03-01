
export type MessageData = {
	content: string,
	sender: string,
	time?: string,
	room: string
}

export type State = {
	room: string,
	messages: MessageData[]
}

export type Action = {
	type: string,
	payload: string | MessageData
}

export type User = {
	login: string,
}

export type Room = {
	id : number,
	name: string,
}