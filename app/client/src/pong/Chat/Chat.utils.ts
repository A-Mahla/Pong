import { State, Action } from "./Chat.types"

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