import * as React from 'react'
import { Box } from '@mui/material'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { Link } from "react-router-dom"
import { List, ListSubheader }  from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import InfoIcon from '@mui/icons-material/Info'
import LoginIcon from '@mui/icons-material/Login'
import IconButton from '@mui/material/IconButton'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

type propsSwip = {
	login: boolean
	sx: {
		justifyContent?: string,
		pl?: string,
		position?: string,
		right?: string
	}
}

const listTextMenu = {
	'@media (max-width:600px)': {
		fontSize: '2vw;'
	},
	fontSize: '1.5vw;'
}

const listIconButton = {
	'@media (max-width:600px)': {
		display: 'none'
	},
}

const Swipeable = (props: propsSwip) => {

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

		if ( e &&
			e.type == 'keydown' &&
			(e as React.KeyboardEvent).key == 'Tab'
		) {
			return;
		}

		setState({ ...state, [anchor]: open})
	}

	const Swip = (props: propsSwip) => {

		return (
			<Box
				sx={{
					width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '30vw;',
					'@media (max-width:300px)': {
						width: '33vw;',
					},
				}}
				role="presentation"
				onClick={toggleDrawer(anchor, false)}
				onKeyDown={toggleDrawer(anchor, false)}
			>
				<List subheader={
					<ListSubheader
						component="div"
						id="nested-list-subheader"
						sx={{
							pr: 0,
						}}
					>
						Pong
						<Divider variant="middle" />
					</ListSubheader>}
				>
					{props.login === false ?
						<ListItemButton component={Link} to="/login">
						<ListItemIcon sx={listIconButton}>
							<LoginIcon />
						</ListItemIcon>
							<ListItemText
								primary="Login / Signup"
								disableTypography={true}
								sx={listTextMenu} />
						</ListItemButton>
					:
						<ListItemButton component={Link} to="/">
						<ListItemIcon sx={listIconButton}>
							<LoginIcon />
						</ListItemIcon>
							<ListItemText
								primary="Logout"
								disableTypography={true}
								sx={listTextMenu} />
						</ListItemButton>
					}
					<Divider variant="middle" />
					<ListItemButton>
						<ListItemIcon sx={listIconButton}>
							<EmailIcon />
						</ListItemIcon>
						<ListItemText
							primary="Contact"
							disableTypography={true}
							sx={listTextMenu} />
					</ListItemButton>
					<ListItemButton>
						<ListItemIcon sx={listIconButton}>
							<InfoIcon />
						</ListItemIcon>
						<ListItemText
							primary="About Us"
							disableTypography={true}
							sx={listTextMenu} />
					</ListItemButton>
				</List>
			</Box>
		)
	}

	//		<Box sx={{justifyContent: 'center', px: 2}}>

	return (
			<Box sx={props.sx}>
			<React.Fragment key={anchor}>
				<IconButton
					onClick={toggleDrawer(anchor, true)}
					variant="contained"
					sx={{background: 'primary'}}
				>
					<MenuRoundedIcon sx={{
						fontSize: '2rem',
						'@media (min-width:800px)': {
							fontSize: '4vw;'
						}
					}} />
				</IconButton>
				<SwipeableDrawer
					anchor={anchor}
					open={state[anchor]}
					onClose={toggleDrawer(anchor, false)}
					onOpen={toggleDrawer(anchor, true)}
				>
					<Swip {...props}/>
				</SwipeableDrawer>
			</React.Fragment>
		</Box>
	);
}
export default Swipeable;

