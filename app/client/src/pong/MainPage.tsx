import { Oauth2 } from "./Oauth2"
import { Route } from 'react-router-dom'
import { Typography, Button, Box } from '@mui/material'

const boxStyle = {
	fontSize: '20vw;',
	fontWeight: '700',
	textAlign: 'left',
}

export const MainPage = () => {
	return (
		<Box>
			<Typography variant='h1' sx={boxStyle}>Pong</Typography>
			<Oauth2/>
		</Box>
	)
}

//<Oauth2/>
