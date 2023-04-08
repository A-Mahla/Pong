import { Box, List, ListItem, ListItemButton, ListItemText, Button } from '@mui/material'
import { useContext, useState, useEffect, useCallback } from 'react'
import { ChatContext } from './Chat'
import { FriendRequest } from './Chat.types'
import { socket } from './Socket'

export function FriendRequests() {

	const { friendRequests, setFriendRequests } = useContext(ChatContext)

	const [friendRequestsList, setFriendRequestsList] = useState<React.ReactNode[]>([])

	const handleAccept = useCallback((elem: FriendRequest) => {
		const payload = {
			user1_id: elem.user1Id,
			user2_id: elem.user2Id
		}

		console.log('payload: ', payload)
		
		socket.emit('acceptFriend', payload)

	}, [socket])

	const handleDeny = useCallback((elem : FriendRequest) => {
		console.log(elem)
	}, [])

	useEffect(() => {
		console.log(friendRequests)
		console.log(friendRequests.length)
		setFriendRequestsList(friendRequests.map((elem) => {
				return (
				<ListItem 
						sx={{m: 1}}
					key={elem.id}
					>
						<ListItemText>{elem.user1Login}</ListItemText>
						<ListItemButton onClick={() => handleAccept(elem)}>Accept</ListItemButton>
						<ListItemButton onClick={() => handleDeny(elem)}>Deny</ListItemButton>
				</ListItem>)
		}))
	}, [friendRequests])

	return (
			<List
				>
				{friendRequests.length !== 0 ? friendRequestsList
					: 
					<ListItem>
						<ListItemText>No friend Requests </ListItemText>
					</ListItem>}
			</List>
	)
}