import React from 'react';
import { styled } from '@mui/system';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import PropTypes from 'prop-types';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

//const FriendListWrapper = styled('div')({
//  display: 'flex',
//  flexDirection: 'column',
//  height: '100%',
//  width: '100%',
//  backgroundColor: '#f2f2f2',
//  padding: '16px',
//  boxSizing: 'border-box',
//});

const FriendListWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  backgroundColor: '#f2f2f2',
  padding: '8px',
  boxSizing: 'border-box',
  height: '600px',
  overflowY: 'auto',
});


const FriendListItem = styled('div')(({ isActive }) => ({
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

const FriendListItemAvatar = styled('div')({
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

const FriendListItemText = styled('div')({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '16px',
  fontWeight: '600',
});

//------------------------

const FriendRequestWrapper = styled(ListItem)({
  backgroundColor: '#EDEDED',
  borderRadius: '8px',
  padding: '8px',
  marginBottom: '8px',

  '&:last-child': {
    marginBottom: 0,
  },
});

const FriendRequestAvatar = styled(ListItemAvatar)({
  minWidth: '40px',
});

const FriendRequestListItemText = styled(ListItemText)({
  marginLeft: '16px',
});

const FriendRequestButtonWrapper = styled('div')({
  display: 'flex',
  gap: '8px',
  marginTop: 'auto',
});

const FriendRequestButton = styled('div')(({ isActive }) => ({
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

export const FriendRequestItem = ({ friendRequest, onAccept, onDecline, key }) => {
  return (
    <FriendRequestWrapper>
      <FriendRequestAvatar>
        <Avatar>{friendRequest.name.charAt(0)}</Avatar>
      </FriendRequestAvatar>
      <FriendRequestListItemText primary={friendRequest.name} />
      <FriendRequestButtonWrapper>
        <FriendRequestButton className="accept" onClick={() => onAccept(friendRequest.id)}>
          Accept
        </FriendRequestButton>
        <FriendRequestButton className="decline" onClick={() => onDecline(friendRequest.id)}>
          Decline
        </FriendRequestButton>
      </FriendRequestButtonWrapper>
    </FriendRequestWrapper>
  );
};

FriendRequestItem.propTypes = {
  friendRequest: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  key: PropTypes.number
};

export const FriendList = () => {
  const friends = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mike Johnson' },
    { id: 4, name: 'Sarah Williams' },
    { id: 5, name: 'David Lee' },
    { id: 6, name: 'Karen Brown' },
    { id: 7, name: 'Tom Wilson' },
    { id: 8, name: 'Alice Green' },
    { id: 9, name: 'Peter Parker' },
    { id: 10, name: 'Mary Jane' },
    { id: 11, name: 'Bruce Wayne' },
    { id: 12, name: 'Clark Kent' },
    { id: 13, name: 'Tony Stark' },
    { id: 14, name: 'Steve Rogers' },
    { id: 15, name: 'Thor Odinson' },
    { id: 16, name: 'Natasha Romanoff' },
    { id: 17, name: 'Wanda Maximoff' },
    { id: 18, name: 'Vision' },
    { id: 19, name: 'Scott Lang' },
    { id: 20, name: 'Stephen Strange' }
  ];
  const [activeFriendId, setActiveFriendId] = React.useState(null);
  const [friendRequests, setFriendRequests] = React.useState([]);
  const [addFriendDialogOpen, setAddFriendDialogOpen] = React.useState(false);
  const [friendRequestsDialogOpen, setFriendRequestsDialogOpen] = React.useState(false);

  const handleFriendClick = (friendId) => {
    setActiveFriendId(friendId);
  };

  const handleAddFriendClick = () => {
    setAddFriendDialogOpen(true);
  };

  const handleAddFriendDialogClose = () => {
    setAddFriendDialogOpen(false);
  };

  const handleAddFriendSubmit = () => {
    // Add friend request logic here
    setAddFriendDialogOpen(false);
  };

  const handleFriendRequestCheckClick = () => {
    setFriendRequestsDialogOpen(true);
  };

  const handleFriendRequestsDialogClose = () => {
    setFriendRequestsDialogOpen(false);
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
      <FriendRequestButton variant="contained" onClick={handleAddFriendClick}>
        <FriendListItemAvatar>
          <PersonAddIcon />
        </FriendListItemAvatar>
        <FriendListItemText>
          Add friend
        </FriendListItemText>
      </FriendRequestButton>
      <FriendRequestButton variant="outlined" onClick={handleFriendRequestCheckClick}>
        <FriendListItemAvatar>
          <PeopleIcon />
        </FriendListItemAvatar>
        <FriendListItemText>
          Friend Requests ({friendRequests.length})
        </FriendListItemText>
      </FriendRequestButton>
      <Dialog open={addFriendDialogOpen} onClose={handleAddFriendDialogClose}>
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <TextField label="Username" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddFriendDialogClose}>Cancel</Button>
          <Button onClick={handleAddFriendSubmit} variant="contained" color="primary">
            Send Friend Request
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={friendRequestsDialogOpen} onClose={handleFriendRequestsDialogClose}>
        <DialogTitle>Friend Requests</DialogTitle>
        <DialogContent>
          <FriendRequestWrapper>
            {friendRequests.map((friendRequest) => (
              <FriendRequestItem key={friendRequest.id} friendRequest={friendRequest} onAccept={(id: number) => console.log('accept')} onDecline={(id: number) => console.log('decline')} />
            ))}
          </FriendRequestWrapper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFriendRequestsDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </FriendListWrapper>
  );
}