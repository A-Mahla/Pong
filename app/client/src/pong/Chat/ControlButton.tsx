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
	const [adminMembers, setAdminMembers] = useState<User[]>([])
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
	}, [displayList, isSettingsOpen])

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

	}, [displayList, isSettingsOpen])

	useEffect(() => {
		const getAdmins = async () => {
			const getAdminMembersRequest = {

				api: {
					input: `http://${import.meta.env.VITE_SITE}/api/rooms/${current.id}/admins`
				},
				auth: auth
			}

			const response = await FetchApi(getAdminMembersRequest)

			return response?.data
		}

		getAdmins().then(data => setAdminMembers(data))
	}, [displayList, isSettingsOpen])

	const handleSettingsButtonClick = () => {
		setIsSettingsOpen(true)
	}

	const handleSettingsButtonClose = () => {
		setIsSettingsOpen(false)
	}

	const handleUnbanMember = (bannedUserId: number) => {
		setBannedUsers(bannedUsers.filter(user => user.id !== bannedUserId))
	}

	return (
		<div>
			<SettingsButtonWrapper onClick={handleSettingsButtonClick} >
				<SettingsIcon />
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
					{
						id === current.ownerId || adminMembers.find(admin => admin.id === id)?

							<Button sx={{ flex: '1' }} onClick={() => setDisplayList(UserListType.BANNED)}>Banned</Button>
							:
							null

					}
				</Box>
				<DialogContent sx={{ p: 0 }}>
					<UserListWrapper>
						{
							displayList === UserListType.MEMBERS ?
								members.map((member) => {
									return (<UserListItem key={member.id} user={member} id={id} currentRoom={current}
									setMembers={setMembers} setBannedUsers={setBannedUsers} setAdminMembers={setAdminMembers} 
									members={members} bannedUsers={bannedUsers} adminMembers={adminMembers}/>)
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