import { Button, TextField, FormControl, Paper, Box} from "@mui/material"
import React, { useRef, useCallback, useState, useEffect, useReducer} from "react"
import { State} from "./Chat.types"
import { reducer, getUserRooms } from "./Chat.utils"
import io from "socket.io-client"
import Cookies from 'js-cookie'
import './Chat.css'

const socket = io.connect("http://localhost:8080")
console.log("socket: ", socket)


const initialState: State = {
	room: 'general',
	messages: []
}

export function Chat() {

	const message = useRef('')

	const [state, dispatch] = useReducer(reducer, initialState)

	const [rooms, setRooms] = useState<any[]>([])

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
		const getRooms = async () => {

			return getUserRooms()
		}
		getRooms().then(data => (setRooms(data)))
	}, [])

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

	const handleCreateRoom = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {

		const payload = {
			roomName: message.current.value,
			ownerName: 'gus'
		}

		console.log("data payload: ", payload)

		socket.emit('createRoom', payload, function(response) {
			console.log("RESPONSE CREATE", response)

		getUserRooms().then(data => (setRooms(data)))
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
				{rooms.map((value, key) => (<Button value={value.name} key={key} onClick={handleChangeRoom}>{value.name}</Button>))}
				<Button value='general' onClick={handleChangeRoom}>general</Button>
				<Button value='dev' onClick={handleChangeRoom}>dev</Button>
				<Button value='random' onClick={handleChangeRoom}>random</Button>
				<Button onClick={handleCreateRoom}>create room</Button>
			</Paper>
		</FormControl>
		)
}