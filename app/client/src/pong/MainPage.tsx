import * as React from 'react'
import { Oauth2 } from './Oauth2'
import Swipeable from './utils/Swipeable'
import { Route } from 'react-router-dom'
import { Typography, Button, Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Link } from "react-router-dom"

const titleStyle = {
	'@media (max-width:600px)': {
		fontSize: '19vw;',
	},
	fontSize: '18vw;',
	fontWeight: '700',
	textAlign: 'left',
}

const buttonContactStyle = {
	'@media (max-width:600px)': {
		display: 'none',
	},
	fontSize: '1.2vw;',
	borderRadius: 14,
	flexWrap: 'wrap',
	px: 0,

}

const gridButton = {
	justifyContent: 'center',
	pt: 1
}

const MainPage = () => {

	return <>
		<Grid container display='flex' spacing={0}>
			<Grid item xs={8}>
				<Typography variant='h1' sx={titleStyle}>Pong</Typography>
			</Grid>
			<Grid item xs={4}>
				<Grid container display='flex'>
					<Grid item xs={4} sx={gridButton}>
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
					<Grid item xs={4} sx={gridButton}>
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
						<Swipeable
							login={false}
							sx={{justifyContent: 'center', px: 2}}/>
					</Grid>
				</Grid> 
			</Grid>
		</Grid>
		<Box sx={{position: 'absolute', bottom: 30, right: 80}}>
			<Button
				component={Link}
				to="/login"
				variant='contained'
				color='primary'
				sx={{
					'@media (max-height:215px)': {
						display: 'none',
					},
					fontSize: '2vw;',
					borderRadius: 14,
					pt: 0.4,
					pb: 0.2,
					px: 'center'
				}}
			>
				LOGIN / SIGNUP
			</Button>
		</Box>
	</>
}
export default MainPage;

