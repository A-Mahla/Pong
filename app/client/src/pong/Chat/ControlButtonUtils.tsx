import { Button, IconButton } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block';
import { styled } from '@mui/system'
import { useEffect, useState } from 'react';
import { User } from './Chat.types';
import useAuth, { useFetchAuth } from '../context/useAuth';
import { FetchApi } from '../component/FetchApi';
import FetchAvatar from '../component/FetchAvatar';

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
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	height: '56px',
	padding: '0 16px',
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

export const UserListItem = ({ user, id }: { user: User, id: number }) => {

	//if (id === user.id)
	//	return null

	const [isSendingRequest, setIsSendingRequest] = useState(false);
	const handleAddFriendClick = async () => {
		setIsSendingRequest(true);
		//await onClick(user.id);
		setIsSendingRequest(false);
	};

	return (
		<UserListItemWrapper>
			<UserListItemAvatar>
				<FetchAvatar avatar={user.avatar} sx={{ height: '100%', width: '100%' }} />
			</UserListItemAvatar>
			<UserListItemText>{user.login}</UserListItemText>
			{
				<IconButtonWrapper onClick={handleAddFriendClick} disabled={isSendingRequest}>
					<BlockIcon />
				</IconButtonWrapper>

			}
		</UserListItemWrapper>
	);
};