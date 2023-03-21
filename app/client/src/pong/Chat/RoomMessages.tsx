import { Box } from '@mui/material'
import {useEffect, useContext, useState} from 'react'
import { RoomContext } from './Chat'
import './Chat.css'

export function RoomMessages() {
	const {rooms, current} = useContext(RoomContext)

	const [messages, setMessages] = useState([])

	useEffect(() => {
		const room = rooms.find((room) => {
			return room.id === current.id
		})

		setMessages(room.messages)

	}, [rooms])


	const messagesComponent = messages.map((message) => {
		return (
			<Box key={message.id} className='messageSent'>
				{message.content} {message.createdAt} 
			</Box>
		)
	})

	return (
		<>
			{messagesComponent}
		</>
	)
}