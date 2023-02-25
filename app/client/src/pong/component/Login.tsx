import {
	Divider,
	Box,
	Button,
	FormControl,
	Grid,
	TextField,
	Typography
} from '@mui/material';
import React, { useCallback, useRef, useState} from 'react'
import { LogoutButton } from '/src/pong/component/LogoutButton';
import { Oauth2 } from '/src/pong/component/Oauth2';
import Cookies from 'js-cookie'
import { FetchApi } from '/src/pong/component/utils/FetchApi';
//import { _2fa } from "./2fa"
import '/src/App'

export function Login() {

	const [error, setError] = useState('');

	const username = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const password = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
		const [data, setData] = useState<any>(null);
		e.preventDefault()

		const requestOptions = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			 },
			body: JSON.stringify({
				login: `${username.current.value}`,
				password: `${password.current.value}`
			})
		}

	
		
		const response = await fetch(`http://${import.meta.env.VITE_SITE}/api/auth/signin`, requestOptions)
		if (response.status != 201)
			setError('Error fetch')
		else
		{
			console.log(import.meta.env.VITE_SITE)
			const data = await response.json()
			const res = await fetch(`http://${import.meta.env.VITE_SITE}/api/auth/refresh`)
			//		const test = await res.json();
		//	location.replace('http://localhost:3000/pong')
		}
/*		useEffect(() => {
			const dataResponse = FetchApi(
				`http://${import.meta.env.VITE_SITE}/api/auth/signin`,
				requestOptions
			);
			setData(dataResponse);
		})*/
		/*	const response = await FetchApi(
			`http://${import.meta.env.VITE_SITE}/api/auth/signin`,
			requestOptions
		)*/;	 
	}




	/*	const handleSignup = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
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

		const requestOptions = {
			method: "POST"
		}

		fetch(`http://localhost:8080/api/users/signup?login=${username.current.value}&password=${password.current.value}`,
			requestOptions)
		.then(response => response.json())
		.then(data => {
			if (data["statusCode"] != 200)
				setError(data['message'])
			else
			{
				Cookies.set('login', data['body']['login'], {expires: 7})
				location.replace('http://localhost:8080')
			}
		})

	}, [])
	 */
	return <>
	<Box container sx={{my: 'auto'}}>
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

			<Button sx={{color: 'primary.main'}} onClick={handleLogin}>signup</Button>
			<Button sx={{color: 'primary.main'}} onClick={handleLogin}>signin</Button>
			<Oauth2>Login via intra</Oauth2>
			{error.length === 0 ? null : <Typography sx={{p:1}} align="center" color="tomato">{error}</Typography> }
		</FormControl>
	</Grid>
	</>

}

//: <LogoutButton>log out</LogoutButton>
//		}
