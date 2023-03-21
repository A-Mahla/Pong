import { Button, TextField, FormControl, Paper, Box, InputAdornment, List, ListItem, ListItemButton, ListItemText} from "@mui/material"
import React, {useContext, useState, useRef, useCallback} from 'react'
import useAuth from '../context/useAuth'
import { RoomContext, socket } from './Chat'
import { LeaveRoomData, MessageData } from './Chat.types'

export function ChatFooter() {

	const {id, user} = useAuth()

	const {current} = useContext(RoomContext)

	const message = useRef('')

	const handleSubmit = () => {
		const messageData : MessageData = {
			content: message.current.value,
			sender_id: id,
			room: {
				id: current.id,
				name: current.name
			}
		}

		console.log(messageData)
		socket.emit('roomMessage', messageData)
	}

	const handleLeaveRoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		const leaveData : LeaveRoomData = {
			user_id: id,
			user_login: user,
			room_id: current.id,
			room_name: current.name
		}

		socket.emit('leaveRoom', leaveData)

		current.id = 0,
		current.name = ''

	}, [current, socket])

	return (
		<Box>
					{
						current.name !== '' ?
							<Paper>
								<TextField type='text' placeholder={`${current.name}`} inputRef={message} />
								<Button onClick={handleSubmit}>send message</Button>
								<Button onClick={handleLeaveRoom}>leave room</Button>
							</Paper>
						: null
					}

		</Box>
	)
}
