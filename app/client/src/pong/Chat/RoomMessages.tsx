import { Box } from '@mui/material'
import {useContext} from 'react'
import { RoomContext } from './Chat'
import './Chat.css'

export function RoomMessages() {
	const {rooms, setRooms, current} = useContext(RoomContext)

	console.log('rooms in roomMessages: ', rooms)
	console.log('CURRENT room in roomMessages: ', current)

	const room = rooms.find((room) => {
		return room.id === current.id
	})

	const messages = room.messages

	console.log('room: ', room)
	console.log('room messages: ', room.messages)

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