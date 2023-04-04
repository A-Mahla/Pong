import React from 'react';
import { styled } from '@mui/system';

const FriendListWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  backgroundColor: '#f2f2f2',
  padding: '16px',
  boxSizing: 'border-box',
});

const FriendListItem = styled('div')(({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '56px',
  padding: '0 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: isActive ? '#EDEDED' : 'transparent',

  '&:hover': {
    backgroundColor: '#EDEDED',
  },
}));

const FriendListItemAvatar = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '40px',
  width: '40px',
  borderRadius: '50%',
  marginRight: '16px',
  backgroundColor: '#ffffff',
});

const FriendListItemText = styled('div')({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '16px',
  fontWeight: '600',
});

export const FriendList = () => {
  const friends = [
    { id: 1, name: 'Aliceeeeeeeeeeeeeeeeeeeeeeee' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];
  const [activeFriendId, setActiveFriendId] = React.useState(null);

  const handleFriendClick = (friendId) => {
    setActiveFriendId(friendId);
  };

  return (
    <FriendListWrapper>
      {friends.map((friend) => (
        <FriendListItem
          key={friend.id}
          isActive={friend.id === activeFriendId}
          onClick={() => handleFriendClick(friend.id)}
        >
          <FriendListItemAvatar>
            <span>{friend.name.charAt(0)}</span>
          </FriendListItemAvatar>
          <FriendListItemText>{friend.name}</FriendListItemText>
        </FriendListItem>
      ))}
    </FriendListWrapper>
  );
};


