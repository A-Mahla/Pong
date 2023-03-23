import { ChatContext, DirectMessagesContext } from "./Chat"
import React, { useContext, useEffect, useState, useCallback, useRef } from "react" 
import { Button, TextField, FormControl, Paper, Box, InputAdornment, List, ListItem, ListItemButton, ListItemText, Dialog} from "@mui/material"
import useAuth, { useFetchAuth } from "../context/useAuth"
import { Api, FetchApi } from "../component/FetchApi"
import { DirectMessage, MessageData, User } from "./Chat.types"
import './Chat.css'
import { socket } from "./Chat"

export function DirectMessages() {

	const {setDirect, current, setCurrent} = useContext(ChatContext)

	const {directMessages, setDirectMessages, newDirectMessage, setNewDirectMessage} = useContext(DirectMessagesContext)

	const [users, setUsers] = useState<User[]>([])

	const [target, setTarget] = useState({
		login: '',	
		id: 0
	})

	const directMessage = useRef('')

	const {user, id} = useAuth()

	const auth = useFetchAuth()

	const getUsersRequest: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/users`,
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
		if (newDirectMessage !== undefined) {
			setDirectMessages([...directMessages, newDirectMessage])
			setNewDirectMessage()
		}

	}, [newDirectMessage])

	const handleChangeTarget = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		const value = JSON.parse(e.currentTarget.getAttribute('value'))

		setTarget(value)
	})

	const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		console.log(directMessage.current.value);

		const payload: MessageData = {
			content: directMessage.current.value,
			sender_id: id,
			recipient_id: target.id	
		}

		directMessage.current.value = ''

		socket.emit('directMessage', payload)
	}, [socket, target])

	const userList = users.map((user) => {

		if (user.id === id)
			return null

		if (user.id === target.id) {

			return (
				<ListItem
					disablePadding	
					key={user.id}
					sx={{borderRadius: 20,bgcolor: 'lightSkyBlue'}}
					>
					<ListItemButton
						sx={{borderRadius: 10}}
						onClick={handleChangeTarget}
						value={JSON.stringify(user)}
						>
						<ListItemText
							sx={{textAlign: 'center'}}	
							>
							{user.login}
							</ListItemText>

					</ListItemButton>

				</ListItem>

			)

		} else {

			return (
				<ListItem
					disablePadding	
					key={user.id}
					sx={{borderRadius: 20,bgcolor: 'lightgrey'}}
					>
					<ListItemButton
						sx={{borderRadius: 10}}
						onClick={handleChangeTarget}
						value={JSON.stringify(user)}
						>
						<ListItemText
							sx={{textAlign: 'center'}}	
							>
							{user.login}
							</ListItemText>

					</ListItemButton>

				</ListItem>
			)
		}
	})

	return (
		<Box
			sx={{display: 'flex'}}
			>
			<List>
				{userList}
			</List>
			{target.id !== 0 ? (
				<FormControl>
					{directMessages.map((message) => {
						<div>{JSON.stringify(message)}</div>
					})}
					<Button>{directMessages !== undefined ? directMessages.length.toString() : lol}</Button>
					{directMessages ?
						directMessages.map((message) => 
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
			
		</Box>
	)
}