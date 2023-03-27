import { Box, List, ListItem, ListItemButton, ListItemText, Dialog } from "@mui/material" 
import { useCallback, useContext } from "react"
import { ChatContext } from "./Chat"
import { CreateRoom } from "./Create"
import { SearchRoom } from "./Search"

export function RoomBar() {

	const {
		rooms,
		current, setCurrent,
		target, setTarget,
		isCreating, setIsCreating,
		isJoining, setIsJoining,
		isInDirect, setIsInDirect
			} = useContext(ChatContext)

	const handleChangeRoom = useCallback((e) => {
		
		const payload = JSON.parse(e.currentTarget.getAttribute('value'))

		if (payload.id === current.id)
			return

		console.log(payload)

		setCurrent(payload)
		setTarget({login: '', id: 0})

	}, [])

	const handleCreateRoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

		isCreating ? setIsCreating(false) : setIsCreating(true)
		if (isJoining)
			setIsJoining(false)
		if (isInDirect)
			setIsInDirect(false)

	}, [isCreating, isJoining, isInDirect])

	const handleSearchRoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		isJoining ? setIsJoining(false) : setIsJoining(true)
		if (isCreating)
			setIsCreating(false)
		if (isInDirect)
			setIsInDirect(false)

	}, [isJoining, isCreating, isInDirect])

	const roomList = rooms.map((room) => {

		if (current.id === room.id) {
			return (
				<ListItem 
					disablePadding
					key={room.id}
					sx={{borderRadius: 20,bgcolor: 'LightSkyBlue'}}
					>
					<ListItemButton
						sx={{borderRadius: 10}}
						onClick={handleChangeRoom}
						value={JSON.stringify(room)}
						>
						<ListItemText
							sx={{textAlign: 'center'}}
							>{room.name}</ListItemText>
					</ListItemButton>
				</ListItem>
			)

		}
		else {
			return (
				<ListItem 
					disablePadding
					key={room.id}
					sx={{borderRadius: 20,bgcolor: 'lightgrey'}}
					>
					<ListItemButton
						sx={{borderRadius: 10}}
						onClick={handleChangeRoom}
						value={JSON.stringify(room)}
						>
						<ListItemText
							sx={{textAlign: 'center'}}
							>{room.name}</ListItemText>
					</ListItemButton>
				</ListItem>
			)

		}

	})

	return (
		<ChatContext.Provider value={useContext(ChatContext)}>
			<List sx={{borderRadius:2, p:0,m:2,border: 1,maxHeight:800, maxWidth:200, overflow:'auto'}}>
				{roomList}

					<ListItem disablePadding>
						<ListItemText
							sx={{textAlign: 'center', bgcolor: 'grey' }}
							>options</ListItemText>
					</ListItem>

					<ListItem disablePadding>
						<ListItemButton
							onClick={handleCreateRoom}
							sx={{borderRadius: 10}}>	
							<ListItemText 
								sx={{textAlign: 'center'}}
								>create room</ListItemText>
						</ListItemButton>
					</ListItem>

					<ListItem disablePadding>
						<ListItemButton
							onClick={handleSearchRoom}
							sx={{borderRadius: 10}}>	
							<ListItemText 
								sx={{textAlign: 'center'}}
								>search room</ListItemText>
						</ListItemButton>
					</ListItem>
			</List>
			<Dialog
				open={isCreating}
				onClose={() => setIsCreating(false) }
				>
					<CreateRoom/>
				</Dialog>

			<Dialog
				open={isJoining}
				onClose={() => setIsJoining(false) }
				>
					<SearchRoom/>
				</Dialog>

		</ChatContext.Provider>
	)
}