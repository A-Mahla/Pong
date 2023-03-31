import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useContext, useState, useEffect } from 'react'
import { ChatContext } from './Chat'

export function FriendRequests() {

	const { friendRequests, setFriendRequests } = useContext(ChatContext)

	useEffect(() => {
		console.log(friendRequests)
	}, [friendRequests])

	return (
		<Box>Lol</Box>
	)
}