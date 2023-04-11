//import { Box, List, ListItem, ListItemButton, ListItemText, Dialog } from "@mui/material" 
//import { useCallback, useContext } from "react"
//import { ChatContext } from "./Chat"
//import { Room } from "./Chat.types"
//import { CreateRoom } from "./Create"
//import { SearchRoom } from "./Search"
//
//export function RoomBar() {
//
//	const {
//		rooms,
//		current, setCurrent,
//		target, setTarget,
//		isCreating, setIsCreating,
//		isJoining, setIsJoining,
//		isInDirect, setIsInDirect
//			} = useContext(ChatContext)
//
//	const handleChangeRoom = useCallback((room: Room) => {
//		
//
//		if (room.id === current.id)
//			return
//
//		console.log(room)
//
//		setCurrent(room)
//		setTarget({login: '', id: 0, avatar: ''})
//
//	}, [])
//
//	const handleCreateRoom = useCallback(() => {
//
//		isCreating ? setIsCreating(false) : setIsCreating(true)
//		if (isJoining)
//			setIsJoining(false)
//		if (isInDirect)
//			setIsInDirect(false)
//
//	}, [isCreating, isJoining, isInDirect])
//
//	const handleSearchRoom = useCallback(() => {
//		isJoining ? setIsJoining(false) : setIsJoining(true)
//		if (isCreating)
//			setIsCreating(false)
//		if (isInDirect)
//			setIsInDirect(false)
//
//	}, [isJoining, isCreating, isInDirect])
//
//	const roomList = rooms.map((room) => {
//
//		if (current.id === room.id) {
//			return (
//				<ListItem 
//					disablePadding
//					key={room.id}
//					sx={{borderRadius: 20,bgcolor: 'LightSkyBlue'}}
//					>
//					<ListItemButton
//						sx={{borderRadius: 10}}
//						onClick={() => handleChangeRoom(room)}
//						>
//						<ListItemText
//							sx={{textAlign: 'center'}}
//							>{room.name}</ListItemText>
//					</ListItemButton>
//				</ListItem>
//			)
//
//		}
//		else {
//			return (
//				<ListItem 
//					disablePadding
//					key={room.id}
//					sx={{borderRadius: 20,bgcolor: 'lightgrey'}}
//					>
//					<ListItemButton
//						sx={{borderRadius: 10}}
//						onClick={() => handleChangeRoom(room)}
//						>
//						<ListItemText
//							sx={{textAlign: 'center'}}
//							>{room.name}</ListItemText>
//					</ListItemButton>
//				</ListItem>
//			)
//
//		}
//
//	})
//
//	return (
//		<ChatContext.Provider value={useContext(ChatContext)}>
//			<List sx={{borderRadius:2, p:0,m:2,border: 1,maxHeight:800, maxWidth:200, overflow:'auto'}}>
//				{roomList}
//
//					<ListItem disablePadding>
//						<ListItemText
//							sx={{textAlign: 'center', bgcolor: 'grey' }}
//							>options</ListItemText>
//					</ListItem>
//
//					<ListItem disablePadding>
//						<ListItemButton
//							onClick={handleCreateRoom}
//							sx={{borderRadius: 10}}>	
//							<ListItemText 
//								sx={{textAlign: 'center'}}
//								>create room</ListItemText>
//						</ListItemButton>
//					</ListItem>
//
//					<ListItem disablePadding>
//						<ListItemButton
//							onClick={handleSearchRoom}
//							sx={{borderRadius: 10}}>	
//							<ListItemText 
//								sx={{textAlign: 'center'}}
//								>search room</ListItemText>
//						</ListItemButton>
//					</ListItem>
//			</List>
//			<Dialog
//				open={isCreating}
//				onClose={() => setIsCreating(false) }
//				>
//					<CreateRoom/>
//				</Dialog>
//
//			<Dialog
//				open={isJoining}
//				onClose={() => setIsJoining(false) }
//				>
//					<SearchRoom/>
//				</Dialog>
//
//		</ChatContext.Provider>
//	)
//}

import React, { useContext, useState } from 'react'
import { ChatContext } from './Chat'
import { Room } from './Chat.types'
import { RoomBarButton, RoomListItem, RoomListItemAvatar, RoomListItemText, RoomListWrapper } from './RoomBarUtils'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { FetchApi } from '../component/FetchApi';
import { useFetchAuth } from '../context/useAuth';
import { CreateRoom } from './Create';

export function RoomBar() {

	const { rooms, setRooms } = useContext(ChatContext)
	const [activeRoomId, setActiveRoomId] = useState<number>(0)
	const [createRoomDialogOpen, setCreateRoomDialogOpen] = useState<boolean>(false) 
	const [searchRoomDialogOpen, setSearchRoomDialogOpen] = useState<boolean>(false) 
	const [matchingRooms, setMatchingRooms] = useState<Room[]>([])
	const useContextAuth = useFetchAuth()

	const handleRoomClick = (room: Room) => {
		console.log(room)
	}

	const handleSearchRoomClick = () => {
		setSearchRoomDialogOpen(true)
	}

	const handleCreateRoomClick = () => {
		setCreateRoomDialogOpen(true)
	}

	const handleSearchRoomOnChange  = (event: React.ChangeEvent<HTMLInputElement>) => {


		const delayDebounce = setTimeout(async () => {
			const searchTerm = event.target.value
			if (searchTerm === '')
				return setMatchingRooms([])

			const response = await FetchApi({
				api: {
					input: `http://${import.meta.env.VITE_SITE}/api/rooms/search/${searchTerm}`,
					option: {}
				},
				auth: useContextAuth
			})
			
			console.log('matching rooms: ', response?.data)

			setMatchingRooms(response?.data.map((value: Room) => ({
				room_id: value.room_id,
				name: value.name
			})))

		}, 800)
		return () => clearTimeout(delayDebounce)
	}

	return (
		<RoomListWrapper>
			{rooms.map(
				room => <RoomListItem key={room.room_id} room={room} activeRoomId={activeRoomId} onClick={handleRoomClick} />
			
			)}
			<Divider/>
			<RoomBarButton onClick={handleSearchRoomClick}>
				<RoomListItemAvatar>
					<SearchIcon/>		
				</RoomListItemAvatar>
				<RoomListItemText>
					Search room
				</RoomListItemText>

			</RoomBarButton>
			<RoomBarButton onClick={handleCreateRoomClick}>
				<RoomListItemAvatar>
					<AddIcon/>	
				</RoomListItemAvatar>
				<RoomListItemText>
					Create room
				</RoomListItemText>
			</RoomBarButton>
			<Dialog open={searchRoomDialogOpen} onClose={() => setSearchRoomDialogOpen(false)}>
				<DialogTitle>Search Room</DialogTitle>
				<DialogContent>
					<TextField  sx={{m:'1rem'}}label="Room name" fullWidth onChange={handleSearchRoomOnChange} />

					{matchingRooms.map(
						room => <RoomListItem key={room.room_id} room={room} activeRoomId={activeRoomId} onClick={handleRoomClick} />
					
					)}
				</DialogContent>
			</Dialog> 
			<Dialog open={createRoomDialogOpen} onClose={() => setCreateRoomDialogOpen(false)}>
				<CreateRoom></CreateRoom>
			</Dialog> 
		</RoomListWrapper>
	)
}