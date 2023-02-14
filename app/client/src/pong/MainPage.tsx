import { Oauth2 } from "./Oauth2"
import { Route } from 'react-router-dom'
import { Typography, Button, Box} from '@mui/material'
import { Link } from "react-router-dom"

const boxStyle = {
	fontSize: '20vw;',
	fontWeight: '700',
	textAlign: 'left',
}

export const MainPage = () => {
	return (
		<Box>
			<Typography variant='h1' sx={boxStyle}>Pong</Typography>
			<Button component={Link} to="/login">LOGIN / SIGNUP</Button>
		</Box>
	)
}

//<Oauth2/>
