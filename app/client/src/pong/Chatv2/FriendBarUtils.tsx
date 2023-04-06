import { List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PropTypes from 'prop-types';
import { styled } from '@mui/system'
import React from 'react';

export const FriendListWrapper = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	backgroundColor: '#f2f2f2',
	padding: '8px',
	boxSizing: 'border-box',
	height: '600px',
	overflowY: 'auto',
});

export const FriendListItemWrapper = styled('div')(({ isActive }) => ({
	display: 'flex',

	alignItems: 'center',
	height: '56px',
	margin: '4px',
	padding: '0 16px',
	borderRadius: '8px',
	cursor: 'pointer',
	backgroundColor: isActive ? '#EDEDED' : 'transparent',

	'&:hover': {
		backgroundColor: '#EDEDED',
	},
}));

export const FriendListItem = ({ friend, activeFriendId, onClick}) => {
	return (
	  <FriendListItemWrapper
		key={friend.id}
		value={JSON.stringify(friend)}
		isActive={friend.id === activeFriendId}
		onClick={() => onClick(friend.id)}
	  >
		<FriendListItemAvatar>
		  <span>{friend.login.charAt(0)}</span>
		</FriendListItemAvatar>
		<FriendListItemText>{friend.login}</FriendListItemText>
	  </FriendListItemWrapper>
	);
  }
  
  FriendListItem.propTypes = {
	friend: PropTypes.shape({
	  id: PropTypes.number.isRequired,
	  login: PropTypes.string.isRequired,
	}).isRequired,
	activeFriendId: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired,
  };

export const FriendListItemAvatar = styled('div')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '40px',
	width: '40px',
	borderRadius: '50%',
	marginRight: '16px',
	backgroundColor: '#ffffff',
	flexShrink: 0
});

export const FriendListItemText = styled('div')({
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	fontSize: '16px',
	fontWeight: '600',
});

//------------------------

export const FriendRequestWrapper = styled(List)({
	backgroundColor: '#EDEDED',
	borderRadius: '8px',
	padding: '8px',
	marginBottom: '8px',

	'&:last-child': {
		marginBottom: 0,
	},
});

export const FriendRequestItemWrapper = styled(ListItem)({
	backgroundColor: '#EDEDED',
	borderRadius: '8px',
	padding: '8px',
	marginBottom: '8px',

	'&:last-child': {
		marginBottom: 0,
	},
});

export const FriendRequestAvatar = styled(ListItemAvatar)({
	minWidth: '40px',
});

export const FriendRequestListItemText = styled(ListItemText)({
	marginLeft: '16px',
});

export const FriendRequestButtonWrapper = styled('div')({
	display: 'flex',
	gap: '8px',
	marginTop: 'auto',
});

export const FriendRequestButton = styled('div')(({ isActive }) => ({
	display: 'flex',
	alignItems: 'center',
	height: '56px',
	padding: '0 16px',
	margin: '4px',
	borderRadius: '8px',
	cursor: 'pointer',
	backgroundColor: isActive ? '#EDEDED' : 'transparent',

	'&:hover': {
		backgroundColor: '#EDEDED',
	},
}));

export const FriendRequestItem = ({ friendRequest, onAccept, onDecline, id }) => {
	if (id === friendRequest.user1Id)
		return null
	return (
		<FriendRequestItemWrapper>
			<FriendRequestAvatar>
				<Avatar>{friendRequest.user1Login.charAt(0)}</Avatar>
			</FriendRequestAvatar>
			<FriendRequestListItemText primary={friendRequest.user1Login} />
			<FriendRequestButtonWrapper>
				<FriendRequestButton className="accept" onClick={() => onAccept(friendRequest.id)}>
					Accept
				</FriendRequestButton>
				<FriendRequestButton className="decline" onClick={() => onDecline(friendRequest.id)}>
					Decline
				</FriendRequestButton>
			</FriendRequestButtonWrapper>
		</FriendRequestItemWrapper>
	);
};

FriendRequestItem.propTypes = {
	friendRequest: PropTypes.shape({
		id: PropTypes.number.isRequired,
		user1Login: PropTypes.string.isRequired,
		user2Login: PropTypes.string.isRequired,
		user1Id: PropTypes.number.isRequired,
		user2Id: PropTypes.number.isRequired,
	}).isRequired,
	id: PropTypes.number.isRequired,
	onAccept: PropTypes.func.isRequired,
	onDecline: PropTypes.func.isRequired,
};

//--------------matching users


export const UserListWrapper = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	backgroundColor: '#f2f2f2',
	padding: '8px',
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

const UserListItemAvatar = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '40px',
	width: '40px',
	borderRadius: '50%',
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	marginRight: '16px',
}));

const UserListItemText = styled('div')({
	flexGrow: 1,
});

export const UserListItem = ({ user, friends, onClick, friendRequests, id }) => {

	if (id === user.id)
		return null

	const [isSendingRequest, setIsSendingRequest] = React.useState(false);

	const handleAddFriendClick = async () => {
		setIsSendingRequest(true);
		await onClick(user.id);
		setIsSendingRequest(false);
	};

	return (
		<UserListItemWrapper>
			<UserListItemAvatar>
				<span>{user.login.charAt(0)}</span>
			</UserListItemAvatar>
			<UserListItemText>{user.login}</UserListItemText>
			{friends.find((friend) => friend.id === user.id) ? 
				<CheckIcon />
			 : 
				friendRequests.find((request) => request.user1Id === user.id || request.user2Id === user.id) ?
					<MoreHorizIcon/>	
				: 
					<IconButton onClick={handleAddFriendClick} disabled={isSendingRequest}>
						<AddIcon />
					</IconButton>
			
			}
		</UserListItemWrapper>
	);
};

UserListItem.propTypes = {
	user: PropTypes.shape({
	  id: PropTypes.number.isRequired,
	  login: PropTypes.string.isRequired,
	}).isRequired,
	friends: PropTypes.arrayOf(
	  PropTypes.shape({
		id: PropTypes.number.isRequired,
		login: PropTypes.string.isRequired,
	  }),
	).isRequired,
	onClick: PropTypes.func.isRequired,
	friendRequests: PropTypes.arrayOf(
	  PropTypes.shape({
		id: PropTypes.number.isRequired,
		user1Login: PropTypes.string.isRequired,
		user2Login: PropTypes.string.isRequired,
		user1Id: PropTypes.number.isRequired,
		user2Id: PropTypes.number.isRequired,
	  }),
	).isRequired,
	id: PropTypes.number.isRequired
  };