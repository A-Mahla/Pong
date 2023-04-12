import React , { useContext, useRef, useState, useCallback } from 'react'
import { Box, FormControl, Switch, TextField, FormControlLabel, Button } from "@mui/material"
import { ChatContext } from "./Chat"
import useAuth, { useFetchAuth } from '../context/useAuth'
import { FetchApi } from '../component/FetchApi'
import { CreateRoomData } from './Chat.types'
import { socket } from './Socket'

export function CreateRoom({setBoolean} :{setBoolean: (bool: boolean) => void}) {
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
		<FormControl sx={{m: '1rem'}}>
			<FormControlLabel control={<Switch onChange={handleSwitch}/>} label="Protected" />
			<TextField sx={{marginTop: '1rem'}} label="name" inputRef={name}/>
			<TextField disabled={!secured} sx={{marginTop: '1rem'}} label="password" inputRef={password}/>
			<Box sx={{display: 'flex'}}>
				<Button sx={{m: '1rem'}}onClick={handleCreateRoom}>Create room</Button>
				<Button sx={{m: '1rem'}}onClick={() => setBoolean(false)}>Cancel</Button>
			</Box>
		</FormControl>
	)
}