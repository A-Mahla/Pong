import { Button, TextField, FormControl, Paper, Box, InputAdornment, List, ListItem, ListItemButton, ListItemText, Dialog} from "@mui/material"
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
import { ChatFooter } from './ChatFooter'


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
	current: {},
	setCurrent: null
}

const initialRoomContext = {
	rooms: [],
	setRooms: null,
	current: {}
}

const initialDirectMessagesContext = {
	directMessages: [],
	setDirectMessages: null,
	newDirectMessage: {},
	setNewDirectMessage: null
}

export const ChatContext = createContext(initialChatContext)

export const RoomContext = createContext(initialRoomContext)

export const DirectMessagesContext = createContext(initialDirectMessagesContext)

export const socket = io.connect("http://localhost:8080/chat")

export function Chat() {

	const message = useRef('')

	const [current, setCurrent] = useState({name: '', id: 0})

	const [rooms, setRooms] = useState<Room[]>([])

	const [newRoom, setNewRoom] = useState<Room>()

	const [leavedRoom, setLeavedRoom] = useState<number>()

	const [newRoomMessage, setNewRoomMessage] = useState<Message>()

	const [newDirectMessage, setNewDirectMessage] = useState<Message>()

	const [directMessages, setDirectMessages] = useState<Message[]>([])

	const [joining, isJoining] = useState(false)

	const [creating, isCreating] = useState(false)

	const [direct, setDirect] = useState(false)

	const { user, id } = useAuth()

	const auth = useFetchAuth()

	const chatContext = {
		isJoining: isJoining,
		joining: joining,
		isCreating: isCreating,
		creating: creating,
		setDirect: setDirect,
		direct: direct,
		current: current,
		setCurrent: setCurrent
	}

	const roomContext = {
		rooms: rooms,
		setRooms: setRooms,
		current: current
	}

	const directMessageContext = {
		directMessages: directMessages,
		setDirectMessages: setDirectMessages,
		newDirectMessage: newDirectMessage,
		setNewDirectMessage: setNewDirectMessage
	}

	const findRooms: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/users/rooms`,
			option: {
			},
		},
		auth: auth,
	}

	const getMessagesRequest: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/messages/direct`,
			option: {
			},
		},
		auth: auth,
	}

	useEffect(() => {
		async function getMessages() {
			const {data} = await FetchApi(getMessagesRequest)
			console.log('messages data: ', data)
			return data
		}

		getMessages().then(data => setDirectMessages(data))
	}, [])

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

		console.log('add eventListeners')

		socket.emit('join', id)

		function onRoomCreatedEvent(payload) {
			setNewRoom(payload)
		}

		socket.on('roomCreated', onRoomCreatedEvent)

		function onRoomJoinedEvent(payload) {
			console.log(`room ${payload} joined`)
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
			setNewRoomMessage(newMessage)
		}

		socket.on('roomMessage', onRoomMessageEvent)

		function onDirectMessageEvent(newMessage) {
			setNewDirectMessage(newMessage)
		}

		socket.on('directMessage', onDirectMessageEvent)

		return () => {
			socket.off('roomCreated', onRoomCreatedEvent)
			socket.off('roomJoined', onRoomJoinedEvent)
			socket.off('roomLeaved', onRoomLeavedEvent)
			socket.off('roomMessage', onRoomMessageEvent)
		}

	}, [socket])

	useEffect(() => {
		if (newRoomMessage !== undefined) {
			if (newRoomMessage.room_id != undefined) {
				setRooms(rooms.map((room) => {
					if (room.id === newRoomMessage.room_id)
						room.messages = [...room.messages, newRoomMessage]
					return room
				}))
			}
			setNewRoomMessage()
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

	}, [newRoomMessage, newRoom, leavedRoom])


	const handleChangeRoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

		const payload = JSON.parse(e.currentTarget.getAttribute('value'))

		if (payload.id === current.id)
			return

		console.log(payload)

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

	const handleDirectMessages = useCallback(() => {
		direct ? setDirect(false) : setDirect(true)
		if (creating)
			isCreating(false)
		if (joining)
			isJoining(false)

		setCurrent({name: '', id: 0})
	})

	const roomList = rooms.map((room) => {

		if (current.id === room.id) {
			return (
				<ListItem 
					disablePadding
					key={room.id}
					sx={{borderRadius: 20,bgcolor: 'LightSkyBlue'}}
					>
					<ListItemButton
						sx={{borderRadius: 10}}
						onClick={handleChangeRoom}
						value={JSON.stringify(room)}
						>
						<ListItemText
							sx={{textAlign: 'center'}}
							>{room.name}</ListItemText>
					</ListItemButton>
				</ListItem>
			)

		}
		else {
			return (
				<ListItem 
					disablePadding
					key={room.id}
					sx={{borderRadius: 20,bgcolor: 'lightgrey'}}
					>
					<ListItemButton
						sx={{borderRadius: 10}}
						onClick={handleChangeRoom}
						value={JSON.stringify(room)}
						>
						<ListItemText
							sx={{textAlign: 'center'}}
							>{room.name}</ListItemText>
					</ListItemButton>
				</ListItem>
			)

		}

	})

	return (
		<ChatContext.Provider value={chatContext}>
			<Box
				sx={{display: 'flex'}}
				>
				<List sx={{borderRadius:2, p:0,m:2,border: 1,maxHeight:800, maxWidth:200, overflow:'auto'}}>
					<ListItem disablePadding>
						<ListItemButton
							onClick={handleDirectMessages}
							sx={{borderRadius: 10}}>	
							<ListItemText 
								sx={{textAlign: 'center'}}
								>direct messages</ListItemText>
						</ListItemButton>
					</ListItem>

					<ListItem disablePadding>
						<ListItemText
							sx={{textAlign: 'center', bgcolor: 'grey' }}
							>rooms</ListItemText>
					</ListItem>

					{roomList}

					<ListItem disablePadding>
						<ListItemText
							sx={{textAlign: 'center', bgcolor: 'grey' }}
							>options</ListItemText>
					</ListItem>

					<ListItem disablePadding>
						<ListItemButton
							onClick={handleCreateRoom}
							sx={{borderRadius: 10}}>	
							<ListItemText 
								sx={{textAlign: 'center'}}
								>create room</ListItemText>
						</ListItemButton>
					</ListItem>

					<ListItem disablePadding>
						<ListItemButton
							onClick={handleSearchRoom}
							sx={{borderRadius: 10}}>	
							<ListItemText 
								sx={{textAlign: 'center'}}
								>search room</ListItemText>
						</ListItemButton>
					</ListItem>
				</List>

				<RoomContext.Provider value={roomContext}>
					<Dialog
						open={creating}
						onClose={() => isCreating(false) }
						>
							<CreateRoom/>
						</Dialog>

					<Dialog
						open={joining}
						onClose={() => isJoining(false) }
						>
							<SearchRoom/>
						</Dialog>

					<DirectMessagesContext.Provider value={directMessageContext}>
						{direct ? <DirectMessages/> : null}	
					</DirectMessagesContext.Provider>
					<Paper>
						{current.name !== '' ? <RoomMessages/> : null}
						{current.name !== '' ? <ChatFooter/> : null}
					</Paper>
				</RoomContext.Provider>
			</Box>
		</ChatContext.Provider>
	)

}