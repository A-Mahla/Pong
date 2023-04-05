import React , { useContext, useRef, useState, useCallback } from 'react'
import { Box, FormControl, Switch, TextField, FormControlLabel, Button } from "@mui/material"
import { ChatContext } from "./Chat"
import useAuth, { useFetchAuth } from '../context/useAuth'
import { FetchApi } from '../component/FetchApi'
import { CreateRoomData } from './Chat.types'
import { socket } from './Socket'

export function CreateRoom() {
	const name = useRef('')

	const password = useRef('')
	
	const {isCreating, setIsCreating} = useContext(ChatContext) 

	const [secured, isSecured] = useState(false)

	const {user, id} = useAuth()

	const handleSwitch = useCallback(() => {
		secured ? isSecured(false) : isSecured(true)
	})

	const handleCreateRoom = useCallback(() => {

		if (name === '')
			return
		else if (secured && password === '')
			return

		const newRoomData : CreateRoomData  = {
			name: name.current.value,
			password: password.current ? password.current.value : '',
			owner_id: id
		}

		socket.emit('createRoom', newRoomData)

		setIsCreating(false)
	}, [socket])

	return (
		<FormControl>
			<Button onClick={() => (setIsCreating(false))}>x</Button>
			{secured ? 'secured' : 'not secured'} 
			<FormControlLabel control={<Switch onChange={handleSwitch}/>} label="Protected" />
			<TextField placeholder="room name" inputRef={name}/>
			{secured ? <TextField placeholder="room password" inputRef={password}/> : null }
			<Button onClick={handleCreateRoom}>Create room</Button>
		</FormControl>
	)
}