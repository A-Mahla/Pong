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
import { LogoutButton } from './LogoutButton';
import { Oauth2 } from './Oauth2';
import Cookies from 'js-cookie'
//import { _2fa } from "./2fa"
import '../App'

export function Login() {

	const [error, setError] = useState('');

	const username = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const password = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		const requestOptions = {
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				login: `${username.current.value}`,
				password: `${password.current.value}`
			})
		}

		const response = await fetch('http://localhost:5500/api/users/auth/login', requestOptions)
		if (response.status != 201)
			setError('Error fetch')
		else
		{
			const data = await response.json()
			Cookies.set('accessToken', data['access_token'], {expires: 7})
			location.replace('http://localhost:3000/pong')
		}
	//	.then(response => JSON.stringify(response))
// 		.then(data => {
// 			console.log(data)
// 			if (response.status != 201)
// 			{
// 				console.log('YOOOOOOo')
// 				setError(data['message'])
// 			}
// 			else
// 			{
// //				Cookies.set('login', data['body']['login'], {expires: 7})
// 				Cookies.set('accesToken', data['acces_token'], {expires: 7})
// 				location.replace('http://localhost:3000/pong')
// 			}

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

		const requestOptions = {
			method: "POST"
		}

		fetch(`http://localhost:5500/api/users/signup?login=${username.current.value}&password=${password.current.value}`,
			requestOptions)
		.then(response => response.json())
		.then(data => {
			if (data["statusCode"] != 200)
				setError(data['message'])
			else
			{
				Cookies.set('login', data['body']['login'], {expires: 7})
				location.replace('http://localhost:3000')
			}
		})

	}, [])

	return <>
	<Box container sx={{my: 'auto'}}>
		<Typography variant='h4'>Pong</Typography>
	</Box>
	<Divider variant='middle'/>
	<Grid container justifyContent="center" sx={{height: 600, pt: 15}}>
		{(Cookies.get('login')) === undefined ?

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
			{error.length === 0 ? null : <Typography sx={{p:1}} align="center" color="tomato">{error}</Typography> }
		</FormControl>
		: <LogoutButton>log out</LogoutButton>
		}
	</Grid>
	</>

}
