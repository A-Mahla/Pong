import { Box, List, ListItem, ListItemButton, ListItemText, Button } from '@mui/material'
import { useContext, useState, useEffect, useCallback } from 'react'
import { ChatContext } from './Chat'

export function FriendRequests() {

	const { friendRequests, setFriendRequests } = useContext(ChatContext)

	const [friendRequestsList, setFriendRequestsList] = useState([])

	const handleAccept = useCallback((e) => {
		console.log(e.currentTarget.getAttribute('value'))
	}, [])

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
						<ListItemButton value={elem.user1Id} onClick={handleAccept}>Accept</ListItemButton>
						<ListItemButton value={elem.user1Id} onClick={handleDeny}>Deny</ListItemButton>
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