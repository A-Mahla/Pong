import { Box, TextField, InputAdornment, List, ListItem, Button, FormControl } from '@mui/material'
import Search from '@mui/icons-material/Search'
import React, { useCallback, useState, useEffect, useContext} from 'react'
import { ChatContext } from './Chat'
import useAuth, { useFetchAuth } from '../context/useAuth'
import { Api, FetchApi } from '../component/FetchApi'

export function SearchRoom(children : string) {

	const {isJoining, socket} = useContext(ChatContext)

	const {user} = useAuth()

	const [searchTerm, setSearchTerm] = useState('')

	const [roomList, setRoomList] = useState<any[]>([]) 

	const useContextAuth = useFetchAuth()
 
	useEffect(() => {

		const delayDebounce = setTimeout(async () => {
			if (searchTerm === '')
				return setRoomList([]) 

			const {data} = await FetchApi({
				api: {
					input : `http://${import.meta.env.VITE_SITE}/api/rooms/${searchTerm}`,
					option : {}
				},
				auth : useContextAuth
			})

			setRoomList(data.map((value) => ({
				id: value.room_id,
				name: value.name
			})))

		}, 800)
		return () => clearTimeout(delayDebounce)
	}, [searchTerm])	

	const handleJoin = useCallback(async (e) => {

		const value = JSON.parse(e.target.value)

		const payload = {
			userLogin: user,
			roomId: value.id,
			roomName: value.name
		}

		console.log('join Room payload: ', payload);
		

		socket.emit('joinRoom',  payload, (response) => {
			console.log('join room response: ', response)
		})

		isJoining(false)
	}, [socket])	

	const handleChange = useCallback((e) => {
		setSearchTerm(e.target.value)
	})

	return (
				<FormControl>
					<TextField
						size="small"
						variant="outlined"
						onChange={handleChange}
						InputProps={{
							startAdornment: (
								<Search/>
							)}}/>
					<List>
						{roomList.map((value) => 
							(<ListItem 
								key={value.id}
								secondaryAction={
									<Button value={JSON.stringify(value)} onClick={handleJoin}>JOIN</Button>
								}
								>{value.name}</ListItem>)
						)}
					</List>
				</FormControl>
	) 
} 