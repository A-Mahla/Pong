import { Box, List, ListItem, ListItemButton, ListItemText, Button } from '@mui/material'
import { useContext, useState, useEffect, useCallback } from 'react'
import { ChatContext } from './Chat'
import { socket } from './Socket'

export function FriendRequests() {

	const { friendRequests, setFriendRequests } = useContext(ChatContext)

	const [friendRequestsList, setFriendRequestsList] = useState([])

	const handleAccept = useCallback((e) => {
		const value = JSON.parse(e.currentTarget.getAttribute('value'))
		console.log(value)

		const payload = {
			user1_id: value.user1Id,
			user2_id: value.user2Id
		}

		console.log('payload: ', payload)
		
		socket.emit('acceptFriend', payload)

	}, [socket])

	const handleDeny = useCallback((e) => {
		console.log(e.currentTarget.getAttribute('value'))
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
						<ListItemButton value={JSON.stringify(elem)} onClick={handleAccept}>Accept</ListItemButton>
						<ListItemButton value={JSON.stringify(elem)} onClick={handleDeny}>Deny</ListItemButton>
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