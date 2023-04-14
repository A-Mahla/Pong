import { useContext, useState, useEffect, createContext } from 'react'
import { Box, Divider, Grid } from '@mui/material'
import { Api, FetchApi } from '../component/FetchApi'
import { useFetchAuth } from '../context/useAuth'
import { DirectMessage, Friend, FriendRequest, Message, Room, User } from './Chat.types'
import { RoomBar } from './RoomBar'
import { socket, UpdatesContext } from './Socket'
import { MessagesBox } from './MessagesBox'
import { FriendBar } from './FriendBar'
import { borderLeft } from '@mui/system'
import { styled } from '@mui/system'

type ChatContextType = {
	rooms: Room[];
	setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
	directMessages: DirectMessage[];
	setDirectMessages: React.Dispatch<React.SetStateAction<DirectMessage[]>>;
	friends: User[];
	setFriends: React.Dispatch<React.SetStateAction<User[]>>;
	friendRequests: FriendRequest[];
	setFriendRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>;
	current: {
		name: string;
		id: number;
		ownerId: number
	};
	setCurrent: React.Dispatch<React.SetStateAction<{ name: string; id: number; ownerId: number}>>;
	target: User;
	setTarget: React.Dispatch<React.SetStateAction<User>>;
	isJoining: boolean;
	setIsJoining: React.Dispatch<React.SetStateAction<boolean>>;
	isCreating: boolean;
	setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
	isInDirect: boolean;
	setIsInDirect: React.Dispatch<React.SetStateAction<boolean>>;
	isSearching: boolean;
	setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialChatContext: ChatContextType = {
	rooms: [],
	setRooms: () => null,
	directMessages: [],
	setDirectMessages: () => null,
	friends: [],
	setFriends: () => null,
	friendRequests: [],
	setFriendRequests: () => null,
	current: {
		name: '',
		id: 0,
		ownerId: 0
	},
	setCurrent: () => null,
	target: {
		login: '',
		id: 0,
		avatar: ''
	},
	setTarget: () => null,
	isJoining: false,
	setIsJoining: () => null,
	isCreating: false,
	setIsCreating: () => null,
	isInDirect: false,
	setIsInDirect: () => null,
	isSearching: false,
	setIsSearching: () => null,
};

export const ChatContext = createContext<ChatContextType>(initialChatContext);

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
		setNewFriend,
		declineFriendRequestId,
		setDeclineFriendRequestId
	} = useContext(UpdatesContext)

	const [directMessages, setDirectMessages] = useState<DirectMessage[]>([])

	const [rooms, setRooms] = useState<Room[]>([])

	const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

	const [friends, setFriends] = useState<User[]>([])

	const [current, setCurrent] = useState<{ name: string, id: number, ownerId: number }>({ name: '', id: 0, ownerId: 0 })

	const [target, setTarget] = useState<User>({ login: '', id: 0, avatar: '' })

	const [isJoining, setIsJoining] = useState<boolean>(false)

	const [isSearching, setIsSearching] = useState<boolean>(false)

	const [isCreating, setIsCreating] = useState<boolean>(false)

	const [isInDirect, setIsInDirect] = useState<boolean>(false)

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
			input: `http://${import.meta.env.VITE_SITE}/api/friends/requests`,
		},
		auth: auth
	}

	useEffect(() => {
		async function getFriendRequests() {
			const response = await FetchApi(getFriendsRequestsRequest)
			return response?.data
		}
		getFriendRequests().then(data => setFriendRequests(data))
	}, [])

	const getFriendsRequest: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/friends`,
		},
		auth: auth
	}

	useEffect(() => {
		async function getFriends() {
			const response = await FetchApi(getFriendsRequest)
			console.log('friends: ', response?.data)
			return response?.data
		}
		getFriends().then(data => setFriends(data))
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
			const response = await FetchApi(getMessagesRequest)
			console.log('messages data: ', response?.data)
			return response?.data
		}

		getMessages().then(data => setDirectMessages(data))
	}, [])

	useEffect(() => {
		const getRooms = async () => {
			const response = await FetchApi(findRooms)

			const rooms = response?.data.map((value: Room) => ({
				room_id: value.room_id,
				name: value.name,
				isPublic: value.isPublic,
				ownerId: value.ownerId,
				messages: value.messages
			}))
			return rooms
		}

		getRooms().then(data => {
			console.log('rooms: ', data)
			setRooms(data)
		})

	}, [])

	useEffect(() => {
		if (newRoomMessage !== undefined) {
			if (newRoomMessage.room_id != undefined) {
				setRooms(rooms.map((room) => {
					if (room.room_id === newRoomMessage.room_id)
						room.messages = [...room.messages, newRoomMessage]
					return room
				}))
			}
			setNewRoomMessage(undefined)
		}
		if (newDirectMessage !== undefined) {
			console.log('oueee', newDirectMessage)
			console.log('directMessages: ', directMessages)
			setDirectMessages([...directMessages, newDirectMessage])
			setNewDirectMessage(undefined)
		}
		if (newRoom !== undefined) {
			setRooms([...rooms, newRoom])
			setNewRoom(undefined)
		}
		if (leavedRoom !== undefined) {
			console.log('leave a room')
			setRooms(rooms.filter((room) => {
				if (room.room_id !== leavedRoom) {
					return rooms
				}
			}))
			if (current.id === leavedRoom)
				setCurrent({name: '', id: 0, ownerId: 0})
			setLeavedRoom(undefined)
		}
		if (newFriendRequest !== undefined) {
			console.log('newFriendRequest: ', newFriendRequest)
			setFriendRequests([...friendRequests, newFriendRequest])
			setNewFriendRequest(undefined)
		}
		if (newFriend !== undefined) {
			console.log(`newFriend: `, newFriend)
			setFriends([...friends, newFriend])
			setNewFriend(undefined)
		}
		if (declineFriendRequestId !== undefined) {
			console.log(declineFriendRequestId)
			//console.log(friendRequests.filter((friendRequest) => (friendRequest.id !== declineFriendRequestId)))
			setFriendRequests(friendRequests.filter((friendRequest) => (friendRequest.id !== declineFriendRequestId)))
			setDeclineFriendRequestId(undefined)
		}

	}, [newRoomMessage, newDirectMessage, newRoom, leavedRoom, newFriendRequest, newFriend, declineFriendRequestId])

	return (
		<ChatContext.Provider value={chatContext}>
			<Grid container >
				<Grid item xs={6} md={2} sx={{p: '2px'}}>
					<RoomBar />
				</Grid>
				<Grid item xs={6} md={2} sx={{p: '2px'}}>
					<FriendBar />
				</Grid>

				<Grid item xs={12} md={8} sx={{p: '2px'}}>
					<MessagesBox />
				</Grid>
			</Grid>
		</ChatContext.Provider>
	)
}