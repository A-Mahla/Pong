import { Button, TextField, FormControl, Paper, Box, InputAdornment, List } from "@mui/material"
import React, { useRef, useCallback, useState, useEffect, useReducer, createContext } from "react"
import { State, Room, Message, MessageData, LeaveRoomData } from "./Chat.types"
import useAuth from '/src/pong/context/useAuth';
import { reducer, getUserRooms } from "./Chat.utils"
import io from "socket.io-client"
import { SearchRoom } from "./Search";
import { CreateRoom } from "./Create";
import { DirectMessages } from "./DirectMessages";
import { RoomMessages } from "./RoomMessages";
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

const initialRoomContext = {
	rooms: [],
	setRooms: null
}

export const ChatContext = createContext(initialChatContext)

export const RoomContext = createContext(initialRoomContext)

export function Chat() {

	const message = useRef('')

	const [current, setCurrent] = useState({name: '', id: 0})

	const [rooms, setRooms] = useState<Room[]>([])

	const [joining, isJoining] = useState(false)

	const [creating, isCreating] = useState(false)

	const [direct, setDirect] = useState(false)

	const socket = io.connect("http://localhost:8080/chat")

	const { user, id } = useAuth()

	const auth = useFetchAuth()

	const chatContext = {
		isJoining: isJoining,
		joining: joining,
		isCreating: isCreating,
		creating: creating,
		setDirect: setDirect,
		direct: direct,
		socket: socket
	}

	const roomContext = {
		rooms: rooms,
		setRooms: setRooms,
		current: current
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

			console.log('rooms fetched response with messages: ', data)

			const rooms = data.map((value) => ({
				id: value.room_id,
				name: value.name,
				messages: value.messages
			}))

			return rooms

		}
		getRooms().then(data => {
			setRooms(data)
			console.log('rooms: ', data)
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

	}, [socket, rooms])

	useEffect(() => {		//---MESSAGES--//

		socket.on('message', (newMessage) => {
			if (newMessage.room_id !== undefined) 
			{
				console.log('rooms before newMessage: ', rooms)
				setRooms(rooms.map((room) => {
					if (room.room_id === newMessage.room_id)
						room.messages = [...room.messages, newMessage]
				}))
			}
			console.log('setMessages', newMessage)
		})

		socket.on('roomLeaved', (roomId) => {
				console.log(roomId)
		})

		socket.on('roomJoined', (payload) => {
			console.log('payload in message useEffect: ', payload)
		})

	}, [socket, rooms])

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

		console.log('current: ', payload)

		if (payload.id === current.id)
			return

		setCurrent(payload)

	}, [])

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
		<ChatContext.Provider value={chatContext}>
			<FormControl>
				<div>{user}</div>
				<div>{message.length}</div>
				<Paper sx={{m:1}}>
					<Button onClick={handleCreateRoom}>create room</Button>
					<Button onClick={handleSearchRoom}>search room</Button>
					<Button onClick={handleDirectMessages}>direct messages</Button>
				</Paper>
				<Paper sx={{m:1}}>
					{rooms.map((value) => (<Button value={JSON.stringify({id: value.id, name: value.name})} key={value.id} onClick={handleChangeRoom}>{value.name}</Button>))}
					{
						current.name !== '' ?
							<Paper>
							<TextField type='text' placeholder={`${current.name}`} inputRef={message} />
							<Button onClick={handleSubmit}>send message</Button>
							<Button onClick={handleLeaveRoom}>leave room</Button>
							{current.id}
							<RoomContext.Provider value={roomContext}>
								<RoomMessages/>
							</RoomContext.Provider>
							</Paper>
						: null
					}
				</Paper>
				{creating ? <CreateRoom /> : null}
				{joining ? <SearchRoom /> : null}
				{direct ? <DirectMessages/> : null}
			</FormControl>
		</ChatContext.Provider>
	)
}