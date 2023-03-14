import { ChatContext } from "./Chat"
import React, { useContext, useEffect, useState, useCallback, useRef } from "react" 
import { Button, FormControl, TextField, Box} from "@mui/material"
import useAuth, { useFetchAuth } from "../context/useAuth"
import { Api, FetchApi } from "../component/FetchApi"
import { DirectMessage, MessageData, User } from "./Chat.types"
import './Chat.css'

export function DirectMessages() {

	const {socket, setDirect} = useContext(ChatContext)

	const [users, setUsers] = useState<User[]>([])

	const [messages, setMessages] = useState<DirectMessage[]>([])

	const [target, setTarget] = useState({
		login: '',
		id: 0
	})

	const directMessage = useRef('')

	const {user} = useAuth()

	const auth = useFetchAuth()

	const getUsersRequest: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/users`,
			option: {
			},
		},
		auth: auth,
	}

	const getMessagesRequest: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/messages/direct/${user}`,
			option: {
			},
		},
		auth: auth,
	}

	useEffect(() => {
		async function getUsers() {
			const {data} = await FetchApi(getUsersRequest)
			console.log('users data: ', data)
			return data
		} 
		getUsers().then(data => setUsers(data))
	}, [])

	useEffect(() => {
		async function getMessages() {
			const {data} = await FetchApi(getMessagesRequest)
			console.log('messages data: ', data)
			return data
		}

		getMessages().then(data => setMessages(data))
	}, [])

	useEffect(() => {
		socket.on("directMessage", (payload) => {
			console.log('payload for direct message: ', payload)
			console.log('messages before setMessages: ', messages)
			setMessages([...messages, payload])	
		})
	}, [socket, messages])

	const changeTarget = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		const value = JSON.parse(e.target.value)
		setTarget(value)
	})

	const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		console.log(directMessage.current.value);

		const payload: MessageData = {
			content: directMessage.current.value,
			sender: user,
			recipient_id: target.id	
		}

		directMessage.current.value = ''

		socket.emit('message', payload, (response) => {
			console.log('message response: ', response);
		})
	}, [socket, target, messages])


	//target.id === message.recipient_id ?
	//	<Box key={message.id} className='messageSent'>{message.sender_id} {message.content} {message.createdAt}</Box>
	//	: (target.id === message.sender_id) ?
	//		<Box key={message.id} className='messageSent'>{message.sender_id} {message.content} {message.createdAt}</Box>
	//		: null

	return (
		<FormControl>
			{users.map((value) => (value.login !== user ? <Button key={value.id} value={JSON.stringify(value)} onClick={changeTarget}>{value.login}</Button> : null))}
			{target.id !== 0 ? (
				<FormControl>
					{messages.map((message) => {
						<div>{JSON.stringify(message)}</div>
					})}
					<Button>{messages !== undefined ? messages.length.toString() : lol}</Button>
					{messages ?
						messages.map((message) => 
							(target.id === message.recipient_id ) ?
								<Box key={message.id} className='messageSent'>{message.sender_id} {message.content} {message.createdAt}</Box>
								: target.id === message.sender_id ?
									<Box key={message.id} className='messageReceived'>{message.sender_id} {message.content} {message.createdAt}</Box>
									: null
						) : null}
					<TextField inputRef={directMessage} placeholder='direct message'/>
					<Button onClick={handleSubmit}>send</Button>
				</FormControl>

			) : null}
			<div>{`target: ${target.login} , ${target.id}`}</div>
		</FormControl>
	)
}