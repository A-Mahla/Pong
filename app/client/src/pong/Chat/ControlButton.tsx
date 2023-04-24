import React, { useContext, useEffect, useState } from 'react'
import { BannedUserListItem, RoomPasswordControl, SettingsButtonWrapper, UserListItem, UserListType, UserListWrapper } from './ControlButtonUtils'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Grid } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';
import { ChatContext } from './Chat';
import { FetchApi } from '../component/FetchApi';
import useAuth, { useFetchAuth } from '../context/useAuth';
import { User } from './Chat.types';
import { socket } from './Socket';

export function SettingsButtton() {

	const { current, target, setTarget } = useContext(ChatContext)
	const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
	const [members, setMembers] = useState<User[]>([])
	const [bannedUsers, setBannedUsers] = useState<User[]>([])
	const [adminMembers, setAdminMembers] = useState<User[]>([])
	const [mutedMembers, setMutedMembers] = useState<User[]>([])
	const [displayList, setDisplayList] = useState<UserListType>(UserListType.MEMBERS)
	const { user, id } = useAuth()
	const auth = useFetchAuth()

	useEffect(() => {
		console.log(displayList)

		if (displayList !== UserListType.BANNED)
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

	useEffect(() => {
		if (displayList !== UserListType.MEMBERS) {
			return
		}

		const getMuteds = async () => {
			const getMutedMembersRequest = {

				api: {
					input: `http://${import.meta.env.VITE_SITE}/api/rooms/${current.id}/muted`
				},
				auth: auth
			}

			const response = await FetchApi(getMutedMembersRequest)

			console.log('mutedUsers: ', response?.data)
			return response?.data
		}

		getMuteds().then(data => setMutedMembers(data))
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

	const handleLeaveRoom = () => {

		const leaveRoomData = {
			room_id: current.id,
			room_name: current.name,
			user_id: id,
			user_login: user,
		}

		socket.emit('leaveRoom', leaveRoomData)
	}

	const handleRemoveFromFriend = () => {
		const RemoveFriendData = {
			sender_id: id,
			user_id: target.id,
		}

		console.log(`remove ${target.login} from friends`)
	}

	const handleBlockUser = () => {

		const BlockUserData = {
			sender_id: id,
			user_id: target.id,
		}

		socket.emit('blockUser', BlockUserData, (response: any) => (console.log('blockUser Response: ', response)))

		console.log(`you blocked ${target.login}`)
		setTarget({id: 0, login: '', avatar: ''})
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
				{
					current.id !== 0 ?
						<div>
							<DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
								settings
								<Button sx={{ borderRadius: '20px' }} onClick={handleLeaveRoom}>Leave Room</Button>
							</DialogTitle>
							<Box width="100%" display="flex">
								<Button sx={{ backgroundColor: (displayList === UserListType.MEMBERS) ? '#f2f2f2' : 'transparent', flex: '1' }} onClick={() => setDisplayList(UserListType.MEMBERS)}>Members</Button>
								{
									id === current.ownerId || adminMembers.find(admin => admin.id === id) ?

										<Button sx={{ backgroundColor: (displayList === UserListType.BANNED) ? '#f2f2f2' : 'transparent', flex: '1' }} onClick={() => setDisplayList(UserListType.BANNED)}>Banned</Button>
										:
										null

								}
								{
									id === current.ownerId ?
										<Button sx={{ backgroundColor: (displayList === UserListType.CONTROL) ? '#f2f2f2' : 'transparent', flex: '1' }} onClick={() => setDisplayList(UserListType.CONTROL)}>CONTROL</Button>
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
													members={members} bannedUsers={bannedUsers} adminMembers={adminMembers}
													setMutedMembers={setMutedMembers} mutedMembers={mutedMembers} />)
											})
											: displayList === UserListType.BANNED ?
												bannedUsers.map((member) => {
													return (<BannedUserListItem key={member.id} user={member} id={id} currentRoom={current} onClick={handleUnbanMember} />)
												})
												:
												<RoomPasswordControl currentRoom={current} />
									}
								</UserListWrapper>
							</DialogContent>
						</div>
						:
						target.id !== 0 ?
							<div>
								<DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
									settings
								</DialogTitle>
								<DialogContent>
									<Box sx={{height: '10rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
										<Button sx={{ borderRadius: '20px', backgroundColor: '#f2f2f9', margin: '0.5rem', p: '0.5rem'}} onClick={handleRemoveFromFriend}>remove from friends</Button>
										<Button sx={{ borderRadius: '20px', backgroundColor: '#f2f2f9', margin: '0.5rem', p: '0.5rem'}} onClick={handleBlockUser}>block</Button>
									</Box>
								</DialogContent>
							</div>
							:
							null




				}
				<DialogActions>
					<Button onClick={handleSettingsButtonClose} sx={{ borderRadius: '20px' }}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}