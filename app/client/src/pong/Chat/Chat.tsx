import { Button, TextField, FormControl, Paper, Box, InputAdornment, List} from "@mui/material"
import React, { useRef, useCallback, useState, useEffect, useReducer, createContext} from "react"
import { State} from "./Chat.types"
import useAuth from '/src/pong/context/useAuth';
import { reducer, getUserRooms } from "./Chat.utils"
import io from "socket.io-client"
import { SearchRoom } from "./Search";
import { CreateRoom } from "./Create";
import './Chat.css'

import { useFetchAuth } from '/src/pong/context/useAuth' 
import { FetchApi, Api } from '/src/pong/component/FetchApi' 

const initialState: State = {
	room: 'general',
	messages: []
}

const initialChatContext = {
	isJoining: null,
	joining: false,
	isCreatoing: null,
	creating: false,
	socket: null
}

export const ChatContext = createContext(initialChatContext)

export function Chat() {


	const message = useRef('')

	const [state, dispatch] = useReducer(reducer, initialState)

	const [rooms, setRooms] = useState<any[]>([])

	const [joining, isJoining] = useState(false)

	const [creating, isCreating] = useState(false)

	const socket = io.connect("http://localhost:8080/chat")

	const context = {
		isJoining: isJoining,
		joining: joining,
		isCreating: isCreating,
		creating: creating,
		socket: socket
	}

	const {user} = useAuth()

	const findRooms: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/users/${user}/rooms`,
			option: {
			},
	},
		auth: useFetchAuth(),
	}

	const messageListener = (...args) => {

			console.log('message receive: ', args[0]);
			

			const newMessage = {
				...args[0],
				time: 
					new Date(Date.now()).getHours() + 
					':' + 
					new Date(Date.now()).getMinutes(),
			}

			dispatch({type: 'ADD_MESSAGE', payload: newMessage})
	}

	useEffect(() => {
		const getRooms = async () => {
			const {response, data} = await FetchApi(findRooms)
			return data.map((value) =>({
				id : value.id ,
				name: value.name
			}) )
		}
		getRooms().then(data => (setRooms(data)))
	}, [joining, creating])

	useEffect(() => {
		console.log('socket in useEffect', socket);

		socket.on('connect', () => {
			socket.emit('join', user)
			console.log('connected')
		})
		socket.on('message', messageListener)
		return () => {
			socket.off("message", messageListener)
		}
	}, [socket])

	const handleSubmit = useCallback((e : React.MouseEvent<HTMLButtonElement>) => {

		const messageData = {
			content: message.current.value,
			sender: user,
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

		creating ? isCreating(false) : isCreating(true)
		if (joining)
			isJoining(false)

	}, [creating, joining])

	const handleSearchRoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		joining ? isJoining(false) : isJoining(true)
		if (creating)
			isCreating(false)

	}, [joining, creating])

	const handleLeaveRoom = useCallback((e) => {
		const leaveData = {
			user: user,
			room: state.room
		}

		socket.emit('leaveRoom', leaveData, (response) => {
			console.log('leave room response: ', response);
		})
	})

	return (
		<ChatContext.Provider value={context}>
			<FormControl>
				<div>{user}</div>
				<Paper>
					<Paper>
						{state.messages.map((message, index) => (state.room === message.room ? <Box key={index} className='messageSent'>{message.content} + {message.time}</Box> : null))}
					</Paper>

					<TextField type='text' placeholder={`${state.room}`}  inputRef={message}/>
					
					<Button onClick={handleSubmit}>send message</Button>
					<Button onClick={handleCreateRoom}>create room</Button>
					<Button onClick={handleLeaveRoom}>leave room</Button>
					<Button onClick={handleSearchRoom}>search room</Button>
				</Paper>
				<Paper>
					{rooms.map((value, key) => (<Button value={value.name} key={key} onClick={handleChangeRoom}>{value.name}</Button>))}
				</Paper>
					{creating ? <CreateRoom/> : null}
					{joining ? <SearchRoom/>: null }
			</FormControl>
		</ChatContext.Provider>
		)
}