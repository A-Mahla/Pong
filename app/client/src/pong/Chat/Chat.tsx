import { Button, TextField, FormControl, Paper, Box, InputAdornment, List } from "@mui/material"
import React, { useRef, useCallback, useState, useEffect, useReducer, createContext } from "react"
import { State, Room, Message } from "./Chat.types"
import useAuth from '/src/pong/context/useAuth';
import { reducer, getUserRooms } from "./Chat.utils"
import io from "socket.io-client"
import { SearchRoom } from "./Search";
import { CreateRoom } from "./Create";
import './Chat.css'


import { useFetchAuth } from '/src/pong/context/useAuth'
import { FetchApi, Api } from '/src/pong/component/FetchApi'

const initialState: State = {
	room: {
		name: '',
		id: 0
	},
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

	const [current, setCurrent] = useState({name: '', id: 0})

	const [rooms, setRooms] = useState<Room[]>([])

	const [messages, setMessages] = useState<Message[]>([])

	const [joining, isJoining] = useState(false)

	const [creating, isCreating] = useState(false)

	const socket = io.connect("http://localhost:8080/chat")

	const { user } = useAuth()

	const auth = useFetchAuth()

	const context = {
		isJoining: isJoining,
		joining: joining,
		isCreating: isCreating,
		creating: creating,
		socket: socket
	}

	const findRooms: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/users/${user}/rooms`,
			option: {
			},
		},
		auth: auth,
	}

	useEffect(() => {
		const getRooms = async () => {
			const { data } = await FetchApi(findRooms)

			const rooms = data.map((value) => ({
				id: value.room_id,
				name: value.name
			}))

			const messages = []

			for (const room of rooms) {
				const { data } = await FetchApi({
					api: {
						input: `http://${import.meta.env.VITE_SITE}/api/messages/room/${room.id}`
					},
					auth: auth
				})

				messages.push(data)
			}

			return {
				rooms: rooms,
				messages: messages[0]
			}

		}
		getRooms().then(data => {
			setRooms(data.rooms)
			setMessages(data.messages)
			console.log('messages: ', data.messages)
			console.log('rooms: ', data.rooms)
		})

		console.log('state: ', current);

	}, [])

	useEffect(() => {
		console.log('socket in useEffect', socket);

		socket.on('connect', () => {
			socket.emit('join', user)
			console.log('connected')
		})
		socket.on('message', (newMessage) => {

			console.log('setMessages', newMessage)
			messages !== undefined ? setMessages([...messages, newMessage]) : setMessages([newMessage])
				
		})

		socket.on('roomCreated', (payload) => {
			console.log('roomCreated: ', payload)
			setRooms([...rooms, payload])
		})

		socket.on('roomJoined', (payload) => {
			setRooms([...rooms, payload])
		})

		socket.on('roomLeaved', (roomId) => {
			setRooms(rooms.filter((value) => {
				return value.id !== roomId
			}))
		})

		return () => {
			//socket.off('message', messageListener)
		}
	}, [socket, rooms])

	const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

		const messageData = {
			content: message.current.value,
			sender: user,
			room: {
				id: current.id,
				name: current.name
			}
		}

		socket.emit('message', messageData/*,  function (response) {
			console.log('RESPONSE', response);
		} */)
	}, [current])

	const handleChangeRoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

		const payload = JSON.parse(e.target.value)

		if (payload.id === current.id)
			return

		setCurrent(payload)

	}, [messages])

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
			roomId: current.id
		}

		socket.emit('leaveRoom', leaveData, (response) => {
			console.log('leave room response: ', response);
		})
	}, [current])

	return (
		<ChatContext.Provider value={context}>
			<FormControl>
				<div>{user}</div>
				<div>{message.length}</div>
				<Paper>
					<Paper>
					</Paper>
					{messages ? messages.map((message) => (current.id === message.room_id ? <Box key={message.id} className='messageSent'>{message.content} {message.createdAt}</Box> : null)) : null}
					<TextField type='text' placeholder={`${current.name}`} inputRef={message} />

					<Button onClick={handleSubmit}>send message</Button>
					<Button onClick={handleCreateRoom}>create room</Button>
					<Button onClick={handleLeaveRoom}>leave room</Button>
					<Button onClick={handleSearchRoom}>search room</Button>
				</Paper>
				<Paper>
					{rooms.map((value) => (<Button value={JSON.stringify(value)} key={value.id} onClick={handleChangeRoom}>{value.name}</Button>))}
				</Paper>
				{creating ? <CreateRoom /> : null}
				{joining ? <SearchRoom /> : null}
			</FormControl>
		</ChatContext.Provider>
	)
}