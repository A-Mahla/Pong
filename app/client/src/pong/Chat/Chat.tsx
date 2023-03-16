import { Button, TextField, FormControl, Paper, Box, InputAdornment, List } from "@mui/material"
import React, { useRef, useCallback, useState, useEffect, useReducer, createContext } from "react"
import { State, Room, Message, MessageData, LeaveRoomData } from "./Chat.types"
import useAuth from '/src/pong/context/useAuth';
import { reducer, getUserRooms } from "./Chat.utils"
import io from "socket.io-client"
import { SearchRoom } from "./Search";
import { CreateRoom } from "./Create";
import { DirectMessages } from "./DirectMessages";
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
	setDirect: null,
	direct: false,
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

	const [direct, setDirect] = useState(false)

	const socket = io.connect("http://localhost:8080/chat")

	const { user, id } = useAuth()

	const auth = useFetchAuth()

	const context = {
		isJoining: isJoining,
		joining: joining,
		isCreating: isCreating,
		creating: creating,
		setDirect: setDirect,
		direct: direct,
		socket: socket
	}

	const findRooms: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/users/rooms`,
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
			console.log('messages in useEffect: ', messages)

			return {
				rooms: rooms,
				messages: messages.length !== 0 ? messages[0] : messages
			}

		}
		getRooms().then(data => {
			setRooms(data.rooms)
			setMessages(data.messages)
			console.log('messages: ', data.messages)
			console.log('rooms: ', data.rooms)
		})

	}, [])

	useEffect(() => {

		socket.on('connect', () => {
			socket.emit('join', id)
		})

	}, [socket])

	useEffect(() => {		//---ROOMS--//

		socket.on('roomCreated', (payload) => {
			console.log('roomCreated: ', payload)
			setRooms([...rooms, payload])
		})

		socket.on('roomJoined', (payload) => {
			setRooms([...rooms, payload])
		})

		socket.on('roomLeaved', (roomId) => {
				console.log(roomId)
			setRooms(rooms.filter((value) => {
				console.log(value)
				return value.id !== roomId
			}))
		})

	}, [socket ,/* rooms */])

	useEffect(() => {		//---MESSAGES--//

		socket.on('message', (newMessage) => {
			console.log('setMessages', newMessage)
			console.log('messages before setMessages', messages)
			messages !== undefined ? setMessages([...messages, newMessage]) : setMessages([newMessage])
			//setMessages([...messages, newMessage])
		})

		socket.on('roomLeaved', (roomId) => {
				console.log(roomId)
			setMessages(messages.filter((value) => {
				console.log('value in filter: ', value)
				return value.room_id !== roomId
			}))

		socket.on('roomJoined', (payload) => {
			console.log('payload in message useEffect: ', payload)
			})
		})
		
	}, [socket ,/* messages */])

	const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

		const messageData : MessageData = {
			content: message.current.value,
			sender_id: id,
			room: {
				id: current.id,
				name: current.name
			}
		}

		socket.emit('message', messageData)
	}, [current])

	const handleChangeRoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

		const payload = JSON.parse(e.target.value)

		if (payload.id === current.id)
			return

		setCurrent(payload)

	}, [messages])

	const handleCreateRoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

		creating ? isCreating(false) : isCreating(true)
		if (joining)
			isJoining(false)
		if (direct)
			setDirect(false)

	}, [creating, joining])

	const handleSearchRoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		joining ? isJoining(false) : isJoining(true)
		if (creating)
			isCreating(false)
		if (direct)
			setDirect(false)

	}, [joining, creating])

	const handleLeaveRoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		const leaveData : LeaveRoomData = {
			user_id: id,
			user_login: user,
			room_id: current.id,
			room_name: current.name
		}


		console.log('leaveData: ', leaveData)

		socket.emit('leaveRoom', leaveData, (response) => {
			console.log('leave room response: ', response);
		})

		current.id = 0,
		current.name = ''

	}, [current, socket])

	const handleDirectMessages = useCallback(() => {
		direct ? setDirect(false) : setDirect(true)
		if (creating)
			isCreating(false)
		if (joining)
			isJoining(false)
	})

	return (
		<ChatContext.Provider value={context}>
			<FormControl>
				<div>{user}</div>
				<div>{message.length}</div>
				<Paper sx={{m:1}}>
					<Button onClick={handleCreateRoom}>create room</Button>
					<Button onClick={handleSearchRoom}>search room</Button>
					<Button onClick={handleDirectMessages}>direct messages</Button>
				</Paper>
				<Paper sx={{m:1}}>
					{rooms.map((value) => (<Button value={JSON.stringify(value)} key={value.id} onClick={handleChangeRoom}>{value.name}</Button>))}
					{
						current.name !== '' ?
							<Paper>
							<TextField type='text' placeholder={`${current.name}`} inputRef={message} />
							<Button onClick={handleSubmit}>send message</Button>
							<Button onClick={handleLeaveRoom}>leave room</Button>
							{current.id}
							{messages ?
								messages.map((message) => 
									(current.id === message.room_id ) ?
										<Box key={message.id} className='messageSent'>{message.content} {message.createdAt}</Box>
									: null)
								: null}
							</Paper>
						: null
					}
					{messages.map((value) => (<div key={JSON.stringify(value)}>{JSON.stringify(value)}</div>))}
				</Paper>
				{creating ? <CreateRoom /> : null}
				{joining ? <SearchRoom /> : null}
				{direct ? <DirectMessages/> : null}
			</FormControl>
		</ChatContext.Provider>
	)
}