import { Box, TextField, InputAdornment, List, ListItem, Button, FormControl } from '@mui/material'
import Search from '@mui/icons-material/Search'
import React, { useCallback, useState, useEffect, useContext} from 'react'
import { ChatContext, RoomContext } from './Chat'
import useAuth, { useFetchAuth } from '../context/useAuth'
import { Api, FetchApi } from '../component/FetchApi'
import { JoinRoomData } from './Chat.types'
import { socket } from './Chat'

export function SearchRoom(children : string) {

	const {isJoining} = useContext(ChatContext)

	const {rooms} = useContext(RoomContext)

	const {user, id} = useAuth()

	const [searchTerm, setSearchTerm] = useState('')

	const [matchingRooms, setMatchingRooms] = useState<any[]>([]) 

	const useContextAuth = useFetchAuth()
 
	useEffect(() => {

		const delayDebounce = setTimeout(async () => {
			if (searchTerm === '')
				return setMatchingRooms([]) 

			const {data} = await FetchApi({
				api: {
					input : `http://${import.meta.env.VITE_SITE}/api/rooms/${searchTerm}`,
					option : {}
				},
				auth : useContextAuth
			})

			setMatchingRooms(data.map((value) => ({
				id: value.room_id,
				name: value.name
			})))

		}, 800)
		return () => clearTimeout(delayDebounce)
	}, [searchTerm])	

	const handleJoin = useCallback((e) => {

		const value = JSON.parse(e.target.value)

		const payload: JoinRoomData = {
			user_id: id,
			room_id: value.id,
			room_name: value.name
		}

		socket.emit('joinRoom',  payload)

		isJoining(false)
	}, [socket])	

	const handleChange = useCallback((e) => {
		setSearchTerm(e.target.value)
	})

	const roomList = matchingRooms.map((current) => {
		for (const room of rooms) {
			if (room.id === current.id )
				return null
			else {

				return (<ListItem 
					key={current.id}
					secondaryAction={
						<Button value={JSON.stringify(current)} onClick={handleJoin}>JOIN</Button>
					}
					>{current.name}</ListItem>)
			}
		}
	})

						//{matchingRooms.map((value) => 
						//	(<ListItem 
						//		key={value.id}
						//		secondaryAction={
						//			<Button value={JSON.stringify(value)} onClick={handleJoin}>JOIN</Button>
						//		}
						//		>{value.name}</ListItem>)
						//)}

	return (
				<FormControl>
					<Button onClick={() => (isJoining(false))}>x</Button>
					<TextField
						size="small"
						variant="outlined"
						onChange={handleChange}
						InputProps={{
							startAdornment: (
								<Search/>
							)}}/>
					<List>
						{roomList}
					</List>
				</FormControl>
	) 
} 