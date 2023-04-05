import React from 'react';
import { styled } from '@mui/system';
//import PropTypes from 'prop-types';


const PlayersListWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box',
  height: '100%',
  overflowY: 'auto',
});


const PlayersListItem = styled('div')(({ isActive }) => ({
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

const PlayersListItemAvatar = styled('div')({
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

const PlayersListItemText = styled('div')({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '16px',
  fontWeight: '600',
});

export const PlayersList = () => {

  const [activePlayers, setActivePlayers] = React.useState(null);

  return (
    <PlayersListWrapper>
      {rows.map((row) => (
        <PlayersListItem
          key={row.id}
          isActive={row.id === activePlayersId}
          onClick={() => setActivePlayers(row)}
        >
          <PlayersListItemAvatar>
            <span>{row.login.charAt(0)}</span>
          </PlayersListItemAvatar>
          <PlayersListItemText>{row.login}</PlayersListItemText>
        </PlayersListItem>
      ))}
    </PlayersListWrapper>
  );
}
