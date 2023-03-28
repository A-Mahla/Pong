import { useContext, useState, useEffect, createContext} from 'react'
import { Box } from '@mui/material'
import { Api, FetchApi } from '../component/FetchApi'
import { useFetchAuth } from '../context/useAuth'
import { Message, Room } from './Chat.types'
import { DirectMessageBar } from './DirectMessageBar'
import { MessagesBox } from './MessagesBox'
import { RoomBar } from './RoomBar'
import { socket, UpdatesContext } from './Socket'

const initialChatContext = {
	rooms: [],
	setRooms: null,
	directMessages: [],
	setDirectMessages: null,
	current: {},
	setCurrent: null,
	target: {},
	setTarget: null,
	isJoining: false,
	setIsJoining: null,
	isCreating: false,
	setIsCreating: null,
	isInDirect: false,
	setIsInDirect: null
}

export const ChatContext = createContext(initialChatContext)

export function Chat() {
	const {
		newDirectMessage,
		setNewDirectMessage,
		newRoomMessage,
		setNewRoomMessage,
		newRoom,
		setNewRoom,
		leavedRoom,
		setLeavedRoom
	} = useContext(UpdatesContext)

	const [directMessages, setDirectMessages] = useState<Message[]>([])

	const [rooms, setRooms] = useState<Room[]>([])

	const [current, setCurrent] = useState({name: '', id: 0})
	
	const [target, setTarget] = useState({login: '', id: 0})

	const [isJoining, setIsJoining] = useState(false)

	const [isCreating, setIsCreating] = useState(false)

	const [isInDirect, setIsInDirect] = useState(false)


	const chatContext = {
		rooms: rooms,
		setRooms: setRooms,
		directMessages: directMessages,
		setDirectMessages: setDirectMessages,
		current: current,
		setCurrent: setCurrent,
		target: target,
		setTarget: setTarget,
		isJoining: isJoining,
		setIsJoining: setIsJoining,
		isCreating: isCreating,
		setIsCreating: setIsCreating,
		isInDirect: isInDirect,
		setIsInDirect: setIsInDirect,
	}

	const auth = useFetchAuth()

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
			const { data } = await FetchApi(getMessagesRequest)
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
		if (newDirectMessage !== undefined) {
			console.log('oueee', newDirectMessage)
			console.log('directMessages: ', directMessages)
			setDirectMessages([...directMessages, newDirectMessage])
			setNewDirectMessage()
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

	}, [newRoomMessage, newDirectMessage, newRoom, leavedRoom])

	return (
		<ChatContext.Provider value={chatContext}>
			<Box
				sx={{display: 'flex', borderRadius:2, p:0,m:2,border: 1,maxHeight:500, overflow:'auto'}}
				>
				<RoomBar />
				<DirectMessageBar />
				<MessagesBox />

			</Box>
		</ChatContext.Provider>
	)
}