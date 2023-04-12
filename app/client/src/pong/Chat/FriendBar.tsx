import React, { useContext } from 'react';
import { styled } from '@mui/system';
import { IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { FriendListItem, FriendListItemAvatar, FriendListItemText, FriendListWrapper, FriendRequestAvatar, FriendRequestButton, FriendRequestButtonWrapper, FriendRequestItem, FriendRequestListItemText, FriendRequestWrapper, UserListItem, UserListWrapper } from './FriendBarUtils';
import { ChatContext } from './Chat';
import useAuth, { useFetchAuth } from '../context/useAuth';
import { FetchApi } from '../component/FetchApi';
import { socket } from './Socket';
import { AddFriendData, User } from './Chat.types';


export const FriendBar = () => {

  const { friends, friendRequests,
    target, setTarget,
    current, setCurrent
  } = useContext(ChatContext)
  const [activeFriendId, setActiveFriendId] = React.useState(0);
  const [addFriendDialogOpen, setAddFriendDialogOpen] = React.useState(false);
  const [friendRequestsDialogOpen, setFriendRequestsDialogOpen] = React.useState(false);
  const [matchingUsers, setMatchingUsers] = React.useState<User[]>([])
  const useContextAuth = useFetchAuth()
  const { id } = useAuth()

  const handleFriendClick = (friend: User) => {
    console.log('friendId: ', friend)
    setTarget(friend)
    setCurrent({name: '', id: 0})
    setActiveFriendId(friend.id);
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

  const handleSearchUserOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const delayDebounce = setTimeout(async () => {
      if (event.target.value === '')
        return setMatchingUsers([])

      const response = await FetchApi({
        api: {
          input: `http://${import.meta.env.VITE_SITE}/api/users/search/${event.target.value}`,
          option: {}
        },
        auth: useContextAuth
      })

      setMatchingUsers(response?.data.map((value: User) => ({
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
      <Divider/>
      <FriendRequestButton onClick={handleAddFriendClick}>
        <FriendListItemAvatar>
          <PersonAddIcon />
        </FriendListItemAvatar>
        <FriendListItemText>
          Add friend
        </FriendListItemText>
      </FriendRequestButton>
      <FriendRequestButton onClick={handleFriendRequestCheckClick}>
        <FriendListItemAvatar>
          <PeopleIcon />
        </FriendListItemAvatar>
        <FriendListItemText>
          Friend Requests
        </FriendListItemText>
      </FriendRequestButton>
      <Dialog open={addFriendDialogOpen} onClose={handleAddFriendDialogClose}>
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <TextField sx={{marginTop:'1rem'}} label="Username" fullWidth onChange={handleSearchUserOnChange} />
        </DialogContent>
        <UserListWrapper>
          {matchingUsers.map((user) => (
            <UserListItem
              key={user.id} friends={friends} onClick={handleSendFriendRequestClick} user={user} friendRequests={friendRequests} id={id} />
          ))}
        </UserListWrapper>
        <DialogActions>
          <Button onClick={handleAddFriendDialogClose}>Cancel</Button>
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
          <Button onClick={handleFriendRequestsDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </FriendListWrapper>
  );
}