import React , { useContext, useRef, useState, useCallback } from 'react'
import { Box, FormControl, Switch, TextField, FormControlLabel, Button } from "@mui/material"
import { ChatContext } from "./Chat"
import useAuth, { useFetchAuth } from '../context/useAuth'
import { FetchApi } from '../component/FetchApi'
import { CreateRoomData } from './Chat.types'
import { socket } from './Socket'

export function CreateRoom() {
	const name = useRef<HTMLInputElement>()

	const password = useRef<HTMLInputElement>()
	
	const {isCreating, setIsCreating} = useContext(ChatContext) 

	const [secured, isSecured] = useState(false)

	const {user, id} = useAuth()

	const handleSwitch = useCallback(() => {
		secured ? isSecured(false) : isSecured(true)
	}, [secured])

	const handleCreateRoom = useCallback(() => {

		if (name.current?.value === '')
			return
		else if (secured && password.current?.value === '')
			return

		const newRoomData : CreateRoomData  = {
			name: name.current?.value as string,
			password: password.current?.value ? password.current?.value : '',
			owner_id: id
		}

		console.log('createRoomData: ', newRoomData)

		socket.emit('createRoom', newRoomData)

		setIsCreating(false)
	}, [socket])

	return (
		<FormControl>
			{secured ? 'secured' : 'not secured'} 
			<FormControlLabel control={<Switch onChange={handleSwitch}/>} label="Protected" />
			<TextField placeholder="room name" inputRef={name}/>
			{secured ? <TextField placeholder="room password" inputRef={password}/> : null }
			<Button onClick={handleCreateRoom}>Create room</Button>
		</FormControl>
	)
}