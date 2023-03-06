import React , { useContext, useRef } from 'react'
import { Box, FormControl, Switch, TextField, FormControlLabel } from "@mui/material"
import { ChatContext } from "./Chat"

export function CreateRoom() {
	const roomName = useRef('')
	
	const {creating, isCreating} = useContext(ChatContext) 

	return (
		<Box>{creating ?
			<FormControl>
				<TextField placeholder="room name" ref={roomName}/>
				<FormControlLabel control={<Switch />} label="Protected" />
			</FormControl>
		: <div>not creating</div>}</Box>
	)
}