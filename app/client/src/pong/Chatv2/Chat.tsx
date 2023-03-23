import {useContext, useState, useEffect} from 'react'
import { Api, FetchApi } from '../component/FetchApi'
import { useFetchAuth } from '../context/useAuth'
import { Message, Room } from './Chat.types'
import { socket, UpdatesContext } from './Socket'

const initialDirectMessageContext = {
	directMessages: [],
	setDirectMessages: null,
}

export 

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

	const [rooms, setRooms] = useState<Room[]>()

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
		<ChatContext.Provider >
			<RoomBar/>
			<DirectMessageBar/>
			<MessagesBox/>
		</ChatContext.Provider>
	)
}

