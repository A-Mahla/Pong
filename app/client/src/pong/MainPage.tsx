import { React } from 'react'
import { Oauth2 } from "./Oauth2"
import { Route } from 'react-router-dom'
import { Typography, Button, Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Link } from "react-router-dom"

const titleStyle = {
	fontSize: '17vw;',
	'@media (min-width:600px)': {
		fontSize: '18vw;',
	},
	fontWeight: '700',
	textAlign: 'left',
}

const buttonStyle = {
	fontSize: '1vw;',
	borderRadius: 28,
	flexWrap: 'wrap',
}

const Swipeable = () => {
	return <>
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
	</>
}

export const MainPage = () => {

	return <>
		<Grid container display='flex' spacing={0}>
			<Grid item xs={8}>
				<Typography variant='h1' sx={titleStyle}>Pong</Typography>
			</Grid>
			<Grid item xs={4}>
				<Grid container display='flex'>
					<Grid item xs={4} sx={{px: '0.5vw;'}}>
						<Button
							color='primary'
							sx={buttonStyle}
							size='small'
							variant="contained"
							fullWidth
						>
							About us
						</Button>
					</Grid>
					<Grid item xs={4} sx={{px: '1vw;'}}>
						<Button
							color='primary'
							sx={buttonStyle}
							size='small'
							variant="contained"
							fullWidth
						>
							Contact
						</Button>
					</Grid>
					<Grid item xs={4}></Grid>
				</Grid> 
			</Grid>
		</Grid>
		<Button component={Link} to="/login">LOGIN / SIGNUP</Button>
		<Swipeable/>
	</>
}

