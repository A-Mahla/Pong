import { Button, TextField, FormControl, Paper, Box} from "@mui/material"
import React, { useRef, useCallback, useState, useEffect, useReducer} from "react"
import io from "socket.io-client"
import Cookies from 'js-cookie'
import './Chat.css'

const socket = io.connect("http://localhost:8080")
console.log("socket: ", socket)

type MessageData = {
	content: string,
	sender: string,
	time?: string,
	room: string
}

const initialState: State = {
	room: 'general',
	messages: []
}

type State = {
	room: string,
	messages: MessageData[]
}

type Action = {
	type: string,
	payload: string | MessageData
}

function reducer(state : State , action : Action) {
	switch (action.type) {
		case "SET_ROOM": 
			return {...state, room: action.payload}
		case "ADD_MESSAGE":
			return {...state, messages: [...state.messages, action.payload]}
		default:
			throw new Error('Unexpected action!')
	}
}

export function Chat() {

	const message = useRef('')

	const [state, dispatch] = useReducer(reducer, initialState)

	const messageListener = (...args) => {

			const newMessage = {
				...args[0],
				time: 
					new Date(Date.now()).getHours() + 
					':' + 
					new Date(Date.now()).getMinutes(),
			}

			dispatch({type: 'ADD_MESSAGE', payload: newMessage})
			console.log(state);
			console.log("args: ", args);
	}

	useEffect(() => {
		console.log('socker in useEffect', socket);
		
		socket.on('message', messageListener)
		return () => {
			socket.off("message", messageListener)
		}
	})

	const handleSubmit = useCallback((e : React.MouseEvent<HTMLButtonElement>) => {

		const messageData = {
			content: message.current.value,
			sender: Cookies.get('login'),
			room: state.room
		} 

		socket.emit('message', messageData, function(response) {
			console.log('RESPONSE',response);
		})
	}, [state.room])

	const handleChangeRoom = useCallback((e : React.MouseEvent<HTMLButtonElement>) => {

		dispatch({type: "SET_ROOM", payload: e.target.value})	
	}, [])

	const handleCreateRoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

		socket.emit('createRoom', 'lol', function(response) {
			console.log("RESPONSE CREATE", response)
		})
	}, [])

	return (
		<FormControl>
			<Paper>
				<Paper>
					{state.messages.map((message, index) => (state.room === message.room ? <Box key={index} className='messageSent'>{message.content} + {message.time}</Box> : null))}
				</Paper>

				<TextField type='text' placeholder={`${state.room}`}  inputRef={message}/>
				
				<Button onClick={handleSubmit}>send message</Button>
				<Button value='general' onClick={handleChangeRoom}>general</Button>
				<Button value='dev' onClick={handleChangeRoom}>dev</Button>
				<Button value='random' onClick={handleChangeRoom}>random</Button>
				<Button onClick={handleCreateRoom}>create room</Button>
			</Paper>
		</FormControl>
		)
}