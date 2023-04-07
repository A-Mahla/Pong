import React, { useContext } from 'react';
import { styled } from '@mui/system';
import { IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import PropTypes from 'prop-types';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { FriendListItem, FriendListItemAvatar, FriendListItemText, FriendListWrapper, FriendRequestAvatar, FriendRequestButton, FriendRequestButtonWrapper, FriendRequestItem, FriendRequestListItemText, FriendRequestWrapper, UserListItem, UserListWrapper } from './FriendBarUtils';
import { ChatContext } from './Chat';
import useAuth, { useFetchAuth } from '../context/useAuth';
import { FetchApi } from '../component/FetchApi';
import { socket } from './Socket';
import { AddFriendData } from './Chat.types';


export const FriendBar = () => {
  //const friends = [
  //  { id: 1, login: 'John Doe' },
  //  { id: 2, login: 'Jane Smith' },
  //  { id: 3, login: 'Mike Johnson' },
  //  { id: 4, login: 'Sarah Williams' },
  //  { id: 5, login: 'David Lee' },
  //  { id: 6, login: 'Karen Brown' },
  //  { id: 7, login: 'Tom Wilson' },
  //  { id: 8, login: 'Alice Green' },
  //  { id: 9, login: 'Peter Parker' },
  //  { id: 10, login: 'Mary Jane' },
  //  { id: 11, login: 'Bruce Wayne' },
  //  { id: 12, login: 'Clark Kent' },
  //  { id: 13, login: 'Tony Stark' },
  //  { id: 14, login: 'Steve Rogers' },
  //  { id: 15, login: 'Thor Odinson' },
  //  { id: 16, login: 'Natasha Romanoff' },
  //  { id: 17, login: 'Wanda Maximoff' },
  //  { id: 18, login: 'Vision' },
  //  { id: 19, login: 'Scott Lang' },
  //  { id: 20, login: 'Stephen Strange' }
  //];
  const { friends, friendRequests } = useContext(ChatContext)
  const [activeFriendId, setActiveFriendId] = React.useState(0);
  //const [friendRequests, setFriendRequests] = React.useState([]);
  const [addFriendDialogOpen, setAddFriendDialogOpen] = React.useState(false);
  const [friendRequestsDialogOpen, setFriendRequestsDialogOpen] = React.useState(false);
  const [matchingUsers, setMatchingUsers] = React.useState([])
  const useContextAuth = useFetchAuth()
  const { id } = useAuth()

  const handleFriendClick = (friendId) => {
    console.log('friendId: ', friendId)
    setActiveFriendId(friendId);
  };

  const handleAddFriendClick = () => {
    setAddFriendDialogOpen(true);
  };

  const handleAddFriendDialogClose = () => {
    setMatchingUsers([])
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

  React.useEffect(() => {
    console.log('friends requests: ', friendRequests)
  }, [friendRequests])

  const handleSendFriendRequestClick = (userId: number) => {

    const payload: AddFriendData = {
      user1_id: id,
      user2_id: userId
    }

    socket.emit('friendRequest', payload)
  }

  const handleSeachUserOnChange = (e) => {
    const delayDebounce = setTimeout(async () => {
      if (e.target.value === '')
        return setMatchingUsers([])

      const { data } = await FetchApi({
        api: {
          input: `http://${import.meta.env.VITE_SITE}/api/users/search/${e.target.value}`,
          option: {}
        },
        auth: useContextAuth
      })

      setMatchingUsers(data.map((value) => ({
        id: value.id,
        login: value.login,
        avatar: value.avatar
      })))

    }, 800)
    return () => clearTimeout(delayDebounce)
  }

  return (
    <FriendListWrapper>
      {friends.map((friend) => (
        <FriendListItem key={friend.id} friend={friend} onClick={handleFriendClick} activeFriendId={activeFriendId} />
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
          <TextField label="Username" fullWidth onChange={handleSeachUserOnChange} />
        </DialogContent>
        <UserListWrapper>
          {matchingUsers.map((user) => (
            <UserListItem
              key={user.id} friends={friends} onClick={handleSendFriendRequestClick} user={user} friendRequests={friendRequests} id={id} />
          ))}
        </UserListWrapper>
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
              <FriendRequestItem key={friendRequest.id} friendRequest={friendRequest} id={id} />
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