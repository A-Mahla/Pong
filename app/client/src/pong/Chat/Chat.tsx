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

	const [newRoom, setNewRoom] = useState<Room>()

	const [leavedRoom, setLeavedRoom] = useState<number>()

	const [newMessage, setNewMessage] = useState<Message>()

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

			const rooms = data.map((value) => ({
				id: value.room_id,
				name: value.name,
				messages: value.messages
			}))

			return rooms

		}
		getRooms().then(data => {
			setRooms(data)
		})

	}, [])

	useEffect(() => {		//---ROOMS & MESSAGES--//

		function onConnectEvent() {
			socket.emit('join', id)
		}

		socket.on('connect', onConnectEvent)

		function onRoomCreatedEvent(payload) {
			setNewRoom(payload)
		}

		socket.on('roomCreated', onRoomCreatedEvent)

		function onRoomJoinedEvent(payload) {
				setNewRoom({id: payload.room_id, name: payload.name, messages: payload.messages})		
		}

		socket.on('roomJoined', onRoomJoinedEvent)

		function onRoomLeavedEvent(payload) {
			console.log(`leaving room ${payload.room_id}`)
			setLeavedRoom(payload.room_id)
		}

		socket.on('roomLeaved', onRoomLeavedEvent)

		function onRoomMessageEvent(newMessage) {
			console.log(`receive message: "${newMessage.content}" send by n:${newMessage.sender_id}`)
			setNewMessage(newMessage)
		}

		socket.on('roomMessage', onRoomMessageEvent)

		return () => {
			socket.off('connect', onConnectEvent)
			socket.off('roomCreated', onRoomCreatedEvent)
			socket.off('roomJoined', onRoomJoinedEvent)
			socket.off('roomLeaved', onRoomLeavedEvent)
			socket.off('roomMessage', onRoomMessageEvent)
		}

	}, [socket])

	useEffect(() => {
		if (newMessage !== undefined) {
			if (newMessage.room_id != undefined) {
				setRooms(rooms.map((room) => {
					if (room.id === newMessage.room_id)
						room.messages = [...room.messages, newMessage]
					return room
				}))
			}
			setNewMessage()
		}
		if (newRoom !== undefined) {
			setRooms([...rooms, newRoom])
			setNewRoom()
		}
		if (leavedRoom !== undefined) {
			console.log('leave a room')
			setRooms(rooms.filter((room) => {
				if (room.id !== leavedRoom) {
					return rooms 
				}
			}))
			setLeavedRoom()
		}

	}, [newMessage, newRoom, leavedRoom])

	const handleSubmit = () => {
		const messageData : MessageData = {
			content: message.current.value,
			sender_id: id,
			room: {
				id: current.id,
				name: current.name
			}
		}
		socket.emit('roomMessage', messageData)
	}

	//const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

	//	const messageData : MessageData = {
	//		content: message.current.value,
	//		sender_id: id,
	//		room: {
	//			id: current.id,
	//			name: current.name
	//		}
	//	}
	//	socket.emit('roomMessage', messageData)
	//}, [current])

	const handleChangeRoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

		const payload = JSON.parse(e.target.value)

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

		socket.emit('leaveRoom', leaveData)

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
					{rooms.map((room) => (<div key={room.id}>{room.id}</div>))}
					{rooms.length !== 0 ? rooms.map((value) => (<Button value={JSON.stringify({id: value.id, name: value.name})} key={value.id} onClick={handleChangeRoom}>{value.name}</Button>)): null}
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