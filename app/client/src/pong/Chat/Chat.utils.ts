import { State, Action } from "./Chat.types"

export async function getUserRooms(login: string) {

	const requestOptions = {
		method: 'GET',
		headers: {
			'Content-Type' : 'application/json'
		}
	}

	const response = await fetch(`http://${import.meta.env.VITE_SITE}/api/users/rooms/${login}`)
	return (await response.json()).map((value) => ({
		id: value.id,
		name: value.name,
	}))
}

export function reducer(state : State , action : Action) {
	switch (action.type) {
		case "SET_ROOM": 
			return {...state, room: action.payload}
		case "ADD_MESSAGE":
			return {...state, messages: [...state.messages, action.payload]}
		default:
			throw new Error('Unexpected action!')
	}
}