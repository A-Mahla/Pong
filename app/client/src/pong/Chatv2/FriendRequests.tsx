import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useContext, useState, useEffect } from 'react'
import { ChatContext } from './Chat'

export function FriendRequests() {

	const { friends } = useContext(ChatContext)

	const [requests, setRequests] = useState()

	useEffect(() => {
		setRequests(friends.map((friendRelation) => {
			return()
		}))

	}, [friends])

	return (
		<Box>Lol</Box>
	)
}