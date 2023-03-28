import { Box, List, ListItem, ListItemButton, ListItemText, Dialog, TextField, Button } from "@mui/material" 
import { useContext, useState, useEffect, useCallback, useRef } from "react"
import useAuth from "../context/useAuth"
import { ChatContext } from "./Chat"
import './Chat.css'
import { MessageData } from "./Chat.types"
import { socket } from "./Socket"

export function MessagesBox() {

	const {
		rooms, directMessages,
		current, setCurrent,
		target, setTarget,
			} = useContext(ChatContext)

	const [messageList, setMessageList] = useState([])

	useEffect(() => {
		if (target.id !== 0) {
			console.log(directMessages)
			setMessageList(directMessages.map((message) => 
							(target.id === message.recipient_id ) ?
								<ListItem key={message.id}>
									<ListItemText  className='messageSent'>{message.sender_id} {message.content} {message.createdAt}</ListItemText>
								</ListItem>
								:
								<ListItem key={message.id}>
									<ListItemText  className='messageReceived'>{message.sender_id} {message.content} {message.createdAt}</ListItemText>
								</ListItem>)
									)
		}
		else if (current.id !== 0) {
			const room = rooms.find((room) => {
				return room.id === current.id
			})

			if (room === undefined) {
				setMessageList([])
			}
			else {
				setMessageList(room.messages.map((message) => {
						return (
									<ListItem key={message.id}>
										<ListItemText  className='messageReceived'>{message.sender_id} {message.content} {message.createdAt}</ListItemText>/
									</ListItem>
						)
					}))
				}	
		}
	}, [target, current, directMessages, rooms])

	const message = useRef('')

	const {id} = useAuth()

	const handleSubmit = useCallback(() => {
		if (target.id !== 0) {
			console.log(message.current.value);

			const payload: MessageData = {
				content: message.current.value,
				sender_id: id,
				recipient_id: target.id	
			}

			message.current.value = ''

			socket.emit('directMessage', payload)
		}
		else if (current.id !== 0) {
			const messageData : MessageData = {
				content: message.current.value,
				sender_id: id,
				room: {
					id: current.id,
					name: current.name
				}
			}

			message.current.value = ''

			socket.emit('roomMessage', messageData)
		}
	}, [socket, target, current])

	return (
		<Box>
			{messageList.length}
			<List>
				{messageList}
			</List>
			{
				target.id !== 0 || current.id !== 0 ?
				(<Box>
					<TextField inputRef={message} placeholder={target.id !== 0 ? target.login : current.name}/>
					<Button onClick={handleSubmit}>send</Button>
				</Box>) : null
			}

		</Box>	
	)
}