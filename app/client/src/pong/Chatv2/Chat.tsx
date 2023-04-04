import { useContext, useState, useEffect, createContext} from 'react'
import { Box, Grid } from '@mui/material'
import { Api, FetchApi } from '../component/FetchApi'
import { useFetchAuth } from '../context/useAuth'
import { Friend, FriendRequest, Message, Room, User } from './Chat.types'
import { DirectMessageBar } from './DirectMessageBar'
import { RoomBar } from './RoomBar'
import { socket, UpdatesContext } from './Socket'
import { MessagesBox } from './MessagesBox'

const initialChatContext = {
	rooms: [],
	setRooms: null,
	directMessages: [],
	setDirectMessages: null,
	friends: [],
	setFriends: null,
	friendRequests: [],
	setFriendRequests: null,
	current: {},
	setCurrent: null,
	target: {},
	setTarget: null,
	isJoining: false,
	setIsJoining: null,
	isCreating: false,
	setIsCreating: null,
	isInDirect: false,
	setIsInDirect: null,
	isSearching: false,
	setIsSearching: null
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
		setLeavedRoom,
		newFriendRequest,
		setNewFriendRequest,
		newFriend,
		setNewFriend
	} = useContext(UpdatesContext)

	const [directMessages, setDirectMessages] = useState<Message[]>([])

	const [rooms, setRooms] = useState<Room[]>([])

	const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

	const [friends, setFriends] = useState<User[]>([])

	const [current, setCurrent] = useState({name: '', id: 0})
	
	const [target, setTarget] = useState({login: '', id: 0})

	const [isJoining, setIsJoining] = useState(false)

	const [isSearching, setIsSearching] = useState(false)

	const [isCreating, setIsCreating] = useState(false)

	const [isInDirect, setIsInDirect] = useState(false)

	const chatContext = {
		rooms: rooms,
		setRooms: setRooms,
		directMessages: directMessages,
		setDirectMessages: setDirectMessages,
		friends: friends,
		setFriends: setFriends,
		friendRequests: friendRequests,
		setFriendRequests: setFriendRequests,
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
		isSearching: isSearching,
		setIsSearching: setIsSearching
	}

	const auth = useFetchAuth()

	const getFriendsRequestsRequest: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/friends`,
		},
		auth: auth
	}

	useEffect(() => {
		async function getFriendRequests() {
			const {data} = await FetchApi(getFriendsRequestsRequest)
			return data
		}
		getFriendRequests().then(data => setFriendRequests(data))
	}, [])

	const getFriendsRequest: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/users/friends`,
		},
		auth: auth
	}

	useEffect(() => {
		async function getFriends() {
			const {data} = await FetchApi(getFriendsRequest)
			return data
		}
		getFriends().then(data => console.log('friends data: ', data))
	}, [])

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
		if (newFriendRequest != undefined) {
			console.log('newFriendRequest: ', newFriendRequest)
			setFriendRequests([...friendRequests, newFriendRequest])
			setNewFriendRequest()
		}
		if (newFriend != undefined) {
			console.log(`newFriend: `, newFriend)
			setNewFriend()
		}

	}, [newRoomMessage, newDirectMessage, newRoom, leavedRoom, newFriendRequest, newFriend])

	return (
		<ChatContext.Provider value={chatContext}>
			{

/* 			<Box
				sx={{display: 'flex', borderRadius:2, p:0,m:2,border: 1,maxHeight:500, overflow:'auto'}}
				>
				<RoomBar />
				<DirectMessageBar />
				<MessagesBox />

			</Box> */
			}
			<Grid container
				sx={{border:1}}
				>
				<Grid item xs={6} md={2}>
					<RoomBar />
				</Grid>

				<Grid item xs={6} md={2}>
					<DirectMessageBar />
				</Grid>

				<Grid item xs={12} md={8}>
					<MessagesBox />
				</Grid>
			</Grid>
		</ChatContext.Provider>
	)
}