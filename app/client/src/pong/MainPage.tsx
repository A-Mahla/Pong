import * as React from 'react'
import { Oauth2 } from "./Oauth2"
import { Route } from 'react-router-dom'
import { Typography, Button, Box } from '@mui/material'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Grid from '@mui/material/Grid'
import { Link } from "react-router-dom"
import { List, ListSubheader }  from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import InfoIcon from '@mui/icons-material/Info'
import LoginIcon from '@mui/icons-material/Login'
import IconButton from '@mui/material/IconButton'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const titleStyle = {
	fontSize: '17vw;',
	'@media (min-width:600px)': {
		fontSize: '18vw;',
	},
	fontWeight: '700',
	textAlign: 'left',
}

const buttonContactStyle = {
	fontSize: '1.2vw;',
	borderRadius: 28,
	flexWrap: 'wrap',
	pl: 0
}

const listTextMenu = {
	fontSize: '1.5vw;'
}

type Anchor = 'top' | 'left' | 'bottom' | 'right';

/*export default function Swipeable() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
*/

export default function Swipeable() {

	const [state, setState] = React.useState({
		top: false,
		bottom: false,
		right: false,
		left: false
	})

	const anchor: Anchor = 'right'

	const toggleDrawer =
		(anchor: Anchor, open: boolean) =>
		(e: React.KeyboardEvent | React.MouseEvent )=> {
/*
		if ( event &&
			event.type == 'keydown' &&
			event as React.KeyboardEvent).key == 'Tab'
		) {
			return;
		}
		*/
		setState({ ...state, [anchor]: open})
	}

	const Swip = (anchor: Anchor) => {
	
		return (
			<Box
				sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '30vw;' }}
				role="presentation"
				onClick={toggleDrawer(anchor, false)}
				onKeyDown={toggleDrawer(anchor, false)}
			>
				<List subheader={
						<ListSubheader
							component="div"
							id="nested-list-subheader"
							sx={{pr: 0}}
						>
							Pong
							<Divider variant="middle" />
						</ListSubheader>
					}
				>
					<ListItemButton component={Link} to="/login">
						<ListItemIcon>
							<LoginIcon />
						</ListItemIcon>
						<ListItemText
							primary="Login / Signup"
							disableTypography='false'
							sx={listTextMenu} />
					</ListItemButton>
					<Divider variant="middle" />
					<ListItemButton>
						<ListItemIcon>
							<EmailIcon />
						</ListItemIcon>
						<ListItemText
							primary="Contact"
							disableTypography='false'
							sx={listTextMenu} />
					</ListItemButton>
					<ListItemButton>
						<ListItemIcon>
							<InfoIcon />
						</ListItemIcon>
						<ListItemText
							primary="About Us"
							disableTypography='false'
							sx={listTextMenu} />
					</ListItemButton>
				</List>
			</Box>
		)
	}

	return (
		<Box sx={{justifyContent: 'center', px: 2}}>
			<React.Fragment key={anchor}>
				<IconButton
					onClick={toggleDrawer(anchor, true)}
					variant="contained"
				>
					<MenuRoundedIcon />
				</IconButton>
				<SwipeableDrawer
					anchor={anchor}
					open={state[anchor]}
					onClose={toggleDrawer(anchor, false)}
					onOpen={toggleDrawer(anchor, true)}
				>
					<Swip/>
				</SwipeableDrawer>
			</React.Fragment>
		</Box>
	);
}

export const MainPage = () => {

	return <>
		<Grid container display='flex' spacing={0}>
			<Grid item xs={8}>
				<Typography variant='h1' sx={titleStyle}>Pong</Typography>
			</Grid>
			<Grid item xs={4}>
				<Grid container display='flex'>
					<Grid item xs={4}>
						<Button
							color='primary'
							sx={buttonContactStyle}
							size='small'
							variant="text"
							fullWidth
						>
							<Typography
								variant='button'
								sx={{fontSize: '1.5vw;', ml: 0}}
							>
							About us
							</Typography>
						</Button>
					</Grid>
					<Grid item xs={4}>
						<Button
							color='primary'
							sx={buttonContactStyle}
							size='small'
							variant="text"
							fullWidth
						>
							<Typography
								variant='button'
								sx={{fontSize: '1.5vw;', ml: 0}}
							>
							Contact
							</Typography>
						</Button>
					</Grid>
					<Grid item xs={4}>
						<Swipeable/>
					</Grid>
				</Grid> 
			</Grid>
		</Grid>
		<Button component={Link} to="/login">LOGIN / SIGNUP</Button>
	</>
}

