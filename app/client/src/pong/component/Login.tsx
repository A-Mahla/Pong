import {
	Divider,
	Box,
	Button,
	FormControl,
	Grid,
	TextField,
	Typography
} from '@mui/material';
import React, {
	useCallback,
	useRef,
	useState,
	useMemo
} from 'react'
//import { LogoutButton } from '/src/pong/component/LogoutButton';
import { Oauth2 } from '/src/pong/component/Oauth2';
//import Cookies from 'js-cookie'
import { FetchApi } from '/src/pong/component/FetchApi';
import useAuth from '/src/pong/context/useAuth';
//import { _2fa } from "./2fa"
import '/src/App'


export const Login = () => {

	const {authLogin, authSignup} = useAuth();

	const [error, setError] = useState('');

	const username = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const password = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;


	const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		async function loginAsync() {
			setError(await authLogin(username.current.value, password.current.value))
		}
		loginAsync();
	}

	const handleSignup = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		if (username.current.value === '')
		{
			setError("invalid login");
			return
		}
		else if (password.current.value === '')
		{
			setError('password invalid')
			return
		}

		async function loginAsync() {
			setError(await authSignup(username.current.value, password.current.value))
		}
		loginAsync();
	})
	
	return <>
	<Box sx={{my: 'auto'}}>
		<Typography variant='h4'>Pong</Typography>
	</Box>
	<Divider variant='middle'/>
	<Grid container justifyContent="center" sx={{height: 600, pt: 15}}>

		<FormControl>
			<TextField
				type='text'
				inputRef={username}
				label="Login"
				sx={{p: 1, mb: 1}}
			></TextField>
			<TextField
				type="password"
				id="outlined-password-input"
				inputRef={password}
				variant="outlined"
				label="Password"
				sx={{p: 1 }}
			></TextField>

			<Button sx={{color: 'primary.main'}} onClick={handleSignup}>signup</Button>
			<Button sx={{color: 'primary.main'}} onClick={handleLogin}>signin</Button>
			<Oauth2>Login via intra</Oauth2>
			{error === '' ? null : <Typography align="center" color="tomato">{error}</Typography> }
		</FormControl>
	</Grid>
	</>

}

//: <LogoutButton>log out</LogoutButton>
//		}
