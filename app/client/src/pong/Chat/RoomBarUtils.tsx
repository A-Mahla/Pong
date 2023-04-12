import React from 'react'
import { styled } from '@mui/system'
import PropTypes from 'prop-types';
import { List, ListItem, IconButton, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import FetchAvatar from '../component/FetchAvatar';
import { Room } from './Chat.types';

export const RoomListWrapper = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	backgroundColor: '#f2f2f2',
	padding: '8px',
	boxSizing: 'border-box',
	height: '600px',
	overflowY: 'auto',
})

interface RoomListItemWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
	isActive?: boolean;
}

export const RoomListItemWrapper = styled('div')<RoomListItemWrapperProps>(({ isActive }) => ({
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

export const RoomListItemAvatar = styled('div')({
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

export const RoomListItemText = styled('div')({
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	fontSize: '16px',
	fontWeight: '600',
});

export const RoomListItem = ({ room, activeRoomId, onClick }: { room: Room, activeRoomId: number, onClick: (room: Room) => void }) => {
	return (
		<RoomListItemWrapper
			isActive={room.room_id === activeRoomId}
			onClick={() => onClick(room)}
		>
			<RoomListItemAvatar>
				<Avatar>{room.name.charAt(0)}</Avatar>
			</RoomListItemAvatar>
			<RoomListItemText>{room.name}</RoomListItemText>
		</RoomListItemWrapper>
	)
}

RoomListItem.propTypes = {
	room: PropTypes.shape({
		room_id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired,
	activeRoomId: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired,
};

export const RoomBarButtonWrapper = styled('div')({
	display: 'flex',
	gap: '8px',
	marginTop: 'auto',

})

export const RoomBarButton = styled('div')(() => ({
	display: 'flex',
	alignItems: 'center',
	height: '56px',
	padding: '0 16px',
	margin: '4px',
	borderRadius: '8px',
	cursor: 'pointer',

	'&:hover': {
		backgroundColor: '#EDEDED',
	},
}));

export const MatchingRoomListWrapper = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	backgroundColor: '#f2f2f2',
	padding: '8px',
	boxSizing: 'border-box',
	height: '400px',
	overflowY: 'auto',
});

const MatchingRoomListItemWrapper = styled('div')({
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

const MatchingRoomListItemAvatar = styled('div')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '40px',
	width: '40px',
	borderRadius: '50%',
	marginRight: '16px',
});

const MatchingRoomListItemText = styled('div')({
	flexGrow: 1,
});

export const MatchingRoomListItem = ({ room, rooms, onClick}: { room: Room, rooms: Room[], onClick: (room: Room) => void}) => {

	const [isSendingRequest, setIsSendingRequest] = React.useState(false);

	const handleAddFriendClick = async () => {
		setIsSendingRequest(true);
		await onClick(room);
		setIsSendingRequest(false);
	};

	return (
		<MatchingRoomListItemWrapper>
			<MatchingRoomListItemAvatar>
				<Avatar>{room.name.charAt(0)}</Avatar>
			</MatchingRoomListItemAvatar>
			<MatchingRoomListItemText>{room.name}</MatchingRoomListItemText>
			{rooms.find((tmpRoom) => tmpRoom.room_id === room.room_id) ?
				<CheckIcon />
				:
					<IconButton onClick={handleAddFriendClick} disabled={isSendingRequest}>
						<AddIcon />
					</IconButton>

			}
		</MatchingRoomListItemWrapper>
	);
};
 