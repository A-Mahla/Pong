import React, { useContext, useEffect, useState } from 'react'
import { BannedUserListItem, SettingsButtonWrapper, UserListItem, UserListType, UserListWrapper } from './ControlButtonUtils'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';
import { ChatContext } from './Chat';
import { FetchApi } from '../component/FetchApi';
import useAuth, { useFetchAuth } from '../context/useAuth';
import { User } from './Chat.types';

export function SettingsButtton() {

	const { current } = useContext(ChatContext)
	const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
	const [members, setMembers] = useState<User[]>([])
	const [bannedUsers, setBannedUsers] = useState<User[]>([])
	const [displayList, setDisplayList] = useState<UserListType>(UserListType.MEMBERS)
	const { id } = useAuth()
	const auth = useFetchAuth()

	useEffect(() => {
		console.log(displayList)

		if (displayList === UserListType.MEMBERS)
			return

		const getBannedUsers = async () => {

			const getBannedUsersRequest = {

				api: {
					input: `http://${import.meta.env.VITE_SITE}/api/rooms/${current.id}/bans`
				},
				auth: auth
			}

			const response = await FetchApi(getBannedUsersRequest)

			console.log('bannedUsers: ', response?.data)
			return response?.data
		}

		getBannedUsers().then(data => setBannedUsers(data))
	}, [displayList])

	useEffect(() => {

		if (displayList === UserListType.BANNED)
			return

		const getMembers = async () => {

			const getMembersRequest = {

				api: {
					input: `http://${import.meta.env.VITE_SITE}/api/rooms/${current.id}/members`
				},
				auth: auth
			}

			const response = await FetchApi(getMembersRequest)

			return response?.data
		}

		getMembers().then(data => setMembers(data))

	}, [displayList])

	const handleSettingsButtonClick = () => {
		setIsSettingsOpen(true)
	}

	const handleSettingsButtonClose = () => {
		setIsSettingsOpen(false)
	}

	const handleBanMember = (bannedMemberId: number) => {
		setMembers(members.filter(member => member.id !== bannedMemberId))
	}

	const handleUnbanMember = (bannedUserId: number) => {
		setBannedUsers(bannedUsers.filter(user => user.id !== bannedUserId))
	}

	const membersTab = [
		{ id: 1, login: 'User 1', avatar: 'https://via.placeholder.com/150' },
		{ id: 2, login: 'User 2', avatar: 'https://via.placeholder.com/150' },
		{ id: 3, login: 'User 3', avatar: 'https://via.placeholder.com/150' },
		{ id: 4, login: 'User 4', avatar: 'https://via.placeholder.com/150' },
		{ id: 5, login: 'User 5', avatar: 'https://via.placeholder.com/150' },
		{ id: 6, login: 'User 6', avatar: 'https://via.placeholder.com/150' },
		{ id: 7, login: 'User 7', avatar: 'https://via.placeholder.com/150' },
		{ id: 8, login: 'User 8', avatar: 'https://via.placeholder.com/150' },
		{ id: 9, login: 'User 9', avatar: 'https://via.placeholder.com/150' },
		{ id: 10, login: 'User 10', avatar: 'https://via.placeholder.com/150' },
		{ id: 11, login: 'User 11', avatar: 'https://via.placeholder.com/150' },
		{ id: 12, login: 'User 12', avatar: 'https://via.placeholder.com/150' },
		{ id: 13, login: 'User 13', avatar: 'https://via.placeholder.com/150' },
		{ id: 14, login: 'User 14', avatar: 'https://via.placeholder.com/150' },
		{ id: 15, login: 'User 15', avatar: 'https://via.placeholder.com/150' },
	];



	return (
		<div>
			<SettingsButtonWrapper onClick={handleSettingsButtonClick} >
				<SettingsIcon/>
			</SettingsButtonWrapper>
			<Dialog open={isSettingsOpen} onClose={handleSettingsButtonClose}
				fullWidth
				maxWidth="xs"
				PaperProps={{
					style: {
						borderRadius: '32px',
						width: '50rem',
						minHeight: '10rem'
					}
				}}
			>
				<DialogTitle>settings</DialogTitle>
				<Box width="100%" display="flex">
					<Button sx={{ flex: '1' }} onClick={() => setDisplayList(UserListType.MEMBERS)}>Members</Button>
					<Button sx={{ flex: '1' }} onClick={() => setDisplayList(UserListType.BANNED)}>Banned</Button>
				</Box>
				<DialogContent sx={{ p: 0 }}>
					<UserListWrapper>
						{
							displayList === UserListType.MEMBERS ?
								members.map((member) => {
									return (<UserListItem key={member.id} user={member} id={id} currentRoom={current} onClick={handleBanMember} />)
								})
								:
								bannedUsers.map((member) => {
									return (<BannedUserListItem key={member.id} user={member} id={id} currentRoom={current} onClick={handleUnbanMember} />)
								})
						}
					</UserListWrapper>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSettingsButtonClose}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}