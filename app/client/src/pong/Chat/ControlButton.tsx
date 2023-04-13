import React, { useContext, useEffect, useState } from 'react'
import { SettingsButtonWrapper, UserListItem, UserListWrapper } from './ControlButtonUtils'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';
import { ChatContext } from './Chat';
import { FetchApi } from '../component/FetchApi';
import useAuth, { useFetchAuth } from '../context/useAuth';
import { User } from './Chat.types';

export function SettingsButtton() {

	const { current } = useContext(ChatContext)
	const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
	const [members, setMembers] = useState<User[]>([])
	const { id } = useAuth()
	const auth = useFetchAuth()

	useEffect(() => {

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

	}, [])

	const handleSettingsButtonClick = () => {
		setIsSettingsOpen(true)
	}

	const handleSettingsButtonClose = () => {
		setIsSettingsOpen(false)
	}

	return (
		<>
			<SettingsButtonWrapper>
				<SettingsIcon onClick={handleSettingsButtonClick} />
			</SettingsButtonWrapper>
			<Dialog open={isSettingsOpen} onClose={handleSettingsButtonClose}
				fullWidth
				maxWidth="xs"
				>
				<DialogTitle>settings</DialogTitle>
				<DialogContent sx={{ p: 0 }}>
					<UserListWrapper>
						{
							members.map((member) => {
								return (<UserListItem key={member.id} user={member} id={id} />)
							})
						}
					</UserListWrapper>
				</DialogContent>
			</Dialog>
		</>
	)
}