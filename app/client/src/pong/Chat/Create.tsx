import React , { useContext, useRef, useState, useCallback } from 'react'
import { Box, FormControl, Switch, TextField, FormControlLabel, Button } from "@mui/material"
import { ChatContext } from "./Chat"
import useAuth, { useFetchAuth } from '../context/useAuth'
import { FetchApi } from '../component/FetchApi'

export function CreateRoom() {
	const roomName = useRef('')

	const roomPassword = useRef('')
	
	const {isCreating, socket} = useContext(ChatContext) 

	const [secured, isSecured] = useState(false)

	const {user} = useAuth()

	const handleSwitch = useCallback(() => {
		secured ? isSecured(false) : isSecured(true)
	})

	const handleCreateRoom = useCallback(() => {

		if (roomName === '')
			return
		else if (secured && roomPassword === '')
			return

		const newRoomData = {
			roomName: roomName.current.value,
			roomPassword: roomPassword.current.value,
			roomOwner: user
		}

		console.log('payload: ', newRoomData);
		

		socket.emit('createRoom', newRoomData, (response) => {
			console.log('creatRoom response: ', response);
		})


		console.log('roomName: ', roomName.current.value);
		console.log('roomPasswd: ', roomPassword.current.value);
		isCreating(false)
	}, [socket])

	return (
		<FormControl>
			{secured ? 'secured' : 'not secured'} 
			<FormControlLabel control={<Switch onChange={handleSwitch}/>} label="Protected" />
			<TextField placeholder="room name" inputRef={roomName}/>
			{secured ? <TextField placeholder="room password" inputRef={roomPassword}/> : null }
			<Button onClick={handleCreateRoom}>Create room</Button>
		</FormControl>
	)
}