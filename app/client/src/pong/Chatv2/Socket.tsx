import { useEffect, useState, createContext } from 'react'
import { io, Socket } from 'socket.io-client';
import useAuth from '../context/useAuth'
import { Chat } from './Chat'
import { Friend, FriendRequest, Message, Room, User } from './Chat.types'

export const socket: Socket = io(`http://${import.meta.env.VITE_SITE}/chat`)

interface UpdatesContextProps {
	newDirectMessage: Message | undefined;
	setNewDirectMessage: React.Dispatch<React.SetStateAction<Message | undefined>>;
	newRoomMessage: Message | undefined;
	setNewRoomMessage: React.Dispatch<React.SetStateAction<Message | undefined>>;
	newRoom: Room | undefined;
	setNewRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
	leavedRoom: number | undefined;
	setLeavedRoom: React.Dispatch<React.SetStateAction<number | undefined>>;
	newFriendRequest: FriendRequest | undefined;
	setNewFriendRequest: React.Dispatch<React.SetStateAction<FriendRequest | undefined>>;
	newFriend: User | undefined;
	setNewFriend: React.Dispatch<React.SetStateAction<User | undefined>>;
	declineFriendRequestId: number | undefined;
	setDeclineFriendRequestId: React.Dispatch<React.SetStateAction<number | undefined>>;
  }

const initialUpdatesContext = {
	newDirectMessage: undefined,
	setNewDirectMessage: () => {},
	newRoomMessage: undefined,
	setNewRoomMessage: () => {},
	newRoom: undefined,
	setNewRoom: () => {},
	leavedRoom: undefined,
	setLeavedRoom: () => {},
	newFriendRequest: undefined,
	setNewFriendRequest: () => {},
	newFriend: undefined,
	setNewFriend: () => {},
	declineFriendRequestId: undefined,
	setDeclineFriendRequestId: () => {},
}

export const UpdatesContext = createContext<UpdatesContextProps>(initialUpdatesContext)

export function ChatSocketProvider() { //the role of this component is to add event Listener to the socket on event to send news to the other component for them to update the UI

	const { id } = useAuth()

	const [newRoom, setNewRoom] = useState<Room | undefined>(undefined)

	const [leavedRoom, setLeavedRoom] = useState<number | undefined>(undefined)

	const [newRoomMessage, setNewRoomMessage] = useState<Message | undefined>(undefined)

	const [newDirectMessage, setNewDirectMessage] = useState<Message | undefined>(undefined)

	const [newFriendRequest, setNewFriendRequest] = useState<FriendRequest | undefined>(undefined)

	const [newFriend, setNewFriend] = useState<User | undefined>(undefined)

	const [declineFriendRequestId, setDeclineFriendRequestId] = useState<number | undefined>(undefined)

	const updatesContext = {
		newDirectMessage: newDirectMessage,
		setNewDirectMessage: setNewDirectMessage,
		newRoomMessage: newRoomMessage,
		setNewRoomMessage: setNewRoomMessage,
		newRoom: newRoom,
		setNewRoom: setNewRoom,
		leavedRoom: leavedRoom,
		setLeavedRoom: setLeavedRoom,
		newFriendRequest: newFriendRequest,
		setNewFriendRequest: setNewFriendRequest,
		newFriend: newFriend,
		setNewFriend: setNewFriend,
		declineFriendRequestId: declineFriendRequestId,
		setDeclineFriendRequestId: setDeclineFriendRequestId
	}

	useEffect(() => {		//---ROOMS & MESSAGES--//

		socket.emit('join', id)

		function onRoomCreatedEvent(payload: Room) {
			setNewRoom(payload)
		}

		socket.on('roomCreated', onRoomCreatedEvent)

		function onRoomJoinedEvent(payload: Room) {
			console.log(`room ${payload} joined`)
			setNewRoom({ id: payload.id, name: payload.name, messages: payload.messages })
		}

		socket.on('roomJoined', onRoomJoinedEvent)

		function onRoomLeavedEvent(payload: Room) {
			console.log(`leaving room ${payload.id}`)
			setLeavedRoom(payload.id)
		}

		socket.on('roomLeaved', onRoomLeavedEvent)

		function onRoomMessageEvent(newMessage: Message) {
			console.log(`receive message: "${newMessage.content}" send by n:${newMessage.sender_id}`)
			setNewRoomMessage(newMessage)
		}

		socket.on('roomMessage', onRoomMessageEvent)

		function onDirectMessageEvent(newMessage: Message) {
			console.log(`receive message: "${newMessage.content}" send by n:${newMessage.sender_id}`)
			setNewDirectMessage(newMessage)
		}

		socket.on('directMessage', onDirectMessageEvent)

		function onFriendRequestEvent(newFriendRequest: FriendRequest) {
			console.log(`receive friend request: ${JSON.stringify(newFriendRequest)}`)
			setNewFriendRequest(newFriendRequest)
		}

		socket.on('friendRequest', onFriendRequestEvent)

		function onNewFriendEvent(newFriend: User) {
			console.log(`new friend : ${JSON.stringify(newFriend)}`)
			setNewFriend(newFriend)
		}

		socket.on('newFriend', onNewFriendEvent)

		function onDeclineFriendRequest(friendRequestId: number) {
			setDeclineFriendRequestId(friendRequestId)
		}

		socket.on('declineFriend', onDeclineFriendRequest)

		return () => {
			socket.off('roomCreated', onRoomCreatedEvent)
			socket.off('roomJoined', onRoomJoinedEvent)
			socket.off('roomLeaved', onRoomLeavedEvent)
			socket.off('roomMessage', onRoomMessageEvent)
			socket.off('friendRequest', onFriendRequestEvent)
			socket.off('newFriend', onNewFriendEvent)
			socket.off('declineFriend', onDeclineFriendRequest)
		}

	}, [socket])

	return (
		<UpdatesContext.Provider value={updatesContext}>
			<Chat/>
		</UpdatesContext.Provider>
	)

}