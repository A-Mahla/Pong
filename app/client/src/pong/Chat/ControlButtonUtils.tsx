import { Button, IconButton, Box } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { styled } from '@mui/system'
import { useEffect, useState } from 'react';
import { User } from './Chat.types';
import useAuth, { useFetchAuth } from '../context/useAuth';
import { FetchApi } from '../component/FetchApi';
import FetchAvatar from '../component/FetchAvatar';
import { socket } from './Socket';

export enum UserListType {
	MEMBERS = 'members',
	BANNED = 'banned',
  }

export const SettingsButtonWrapper = styled('div')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '40px',
	width: '40px',
	borderRadius: '50%',
	marginRight: '2rem',
	backgroundColor: '#ffffff',
	flexShrink: 0,
	'&:hover': {
		backgroundColor: '#EDEDED',
	},
});

//--------------------members

export const UserListWrapper = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	backgroundColor: '#f2f2f2',
	boxSizing: 'border-box',
	height: '400px',
	overflowY: 'auto',
});

const UserListItemWrapper = styled('div')({
	padding: '8px 1rem',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	height: '56px',
	borderRadius: '8px',
	cursor: 'pointer',

	'&:hover': {
		backgroundColor: '#EDEDED',
	},
});

const UserListItemAvatar = styled('div')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '40px',
	width: '40px',
	borderRadius: '50%',
	marginRight: '1rem',
	backgroundColor: '#ffffff',
	flexShrink: 0
});

const UserListItemText = styled('div')({
	flexGrow: 1,
	width: '100%',
});

const IconButtonWrapper = styled(IconButton)({
	marginLeft: '1rem'
})

export const UserListItem = ({ user, id, currentRoom, onClick }: { user: User, id: number, currentRoom: {id: number, name: string, ownerId: number}, onClick: (id: number) => void }) => {

	if (id === user.id)
		return null

	const [isSendingRequest, setIsSendingRequest] = useState(false);
	const handleBanMemberClick = (member: User) => {
		setIsSendingRequest(true);

		const banData = {
			room_id: currentRoom.id,
			room_name: currentRoom.name,
			user_id: user.id
		}

		socket.emit('banMember', banData)

		onClick(user.id)

		setIsSendingRequest(false);
	};

	return (
		<UserListItemWrapper>
			<UserListItemAvatar>
				<FetchAvatar avatar={user.avatar} sx={{ height: '100%', width: '100%' }} />
			</UserListItemAvatar>
			<UserListItemText>{user.login}</UserListItemText>
			{
				<Box sx={{display: 'flex'}}>

					<IconButtonWrapper onClick={() => console.log('Mute')} disabled={isSendingRequest}>
						{/*<VolumeUpIcon />*/}
						<VolumeOffIcon />
					</IconButtonWrapper>

					<IconButtonWrapper onClick={() => handleBanMemberClick(user)} disabled={isSendingRequest}>
						{/*<CheckCircleOutlineIcon/>*/}
						<BlockIcon />

					</IconButtonWrapper>

					<IconButtonWrapper onClick={() => console.log('Kick')} disabled={isSendingRequest}>
						<ExitToAppIcon />

					</IconButtonWrapper>
				</Box>

			}
		</UserListItemWrapper>
	);
};

export const BannedUserListItem = ({ user, id, currentRoom, onClick }: { user: User, id: number, currentRoom: {id: number, name: string, ownerId: number}, onClick: (id: number) => void }) => {

	if (id === user.id)
		return null

	const [isSendingRequest, setIsSendingRequest] = useState(false);
	const handleBanMemberClick = (member: User) => {
		setIsSendingRequest(true);

		const banData = {
			room_id: currentRoom.id,
			room_name: currentRoom.name,
			user_id: user.id
		}

		socket.emit('unbanMember', banData)

		onClick(user.id)

		setIsSendingRequest(false);
	};

	return (
		<UserListItemWrapper>
			<UserListItemAvatar>
				<FetchAvatar avatar={user.avatar} sx={{ height: '100%', width: '100%' }} />
			</UserListItemAvatar>
			<UserListItemText>{user.login}</UserListItemText>
			{
				<Box sx={{display: 'flex'}}>
					<IconButtonWrapper onClick={() => handleBanMemberClick(user)} disabled={isSendingRequest}>
						<CheckCircleOutlineIcon/>
					</IconButtonWrapper>
				</Box>

			}
		</UserListItemWrapper>
	);
};