import { Button, FormControl, Grid, TextField, Typography } from '@mui/material';
import React, { useCallback, useRef, useState} from 'react'
import { Oauth2 } from './Oauth2';
import '../App'

export function Login() {

	const [error, setError] = useState('');

	const [signup, setSignup] = useState(false)

	const username = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const password = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const handleLogin = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		
		const requestOptions = {
			method: "GET",
/* 			headers: { 'Content-type': 'application/json'},
			body: JSON.stringify({login: username.current.value,
				password: password.current.value}) */
		}
		fetch(`http://localhost:5500/api/users/login?login=${username.current.value}&password=${password.current.value}`,
			requestOptions)
		.then(response => response.json())
		.then(data => {
			if (data['statusCode'] != 200)
				setError(data['message'])
			else
				location.replace('http://localhost:3000')
			
			console.log(data)})
	}, [])

	const handleSignup = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		
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
				location.replace('http://localhost:3000')
		})

	}, [])

	return (
	<Grid container justifyContent="center">
		<FormControl>
			<TextField type='text' inputRef={username} label="Login" sx={{p: 1}}></TextField>
			<TextField type='text' inputRef={password} variant="outlined" label="Password"sx={{p: 1}}></TextField>

			<Button sx={{color: 'primary.main'}} onClick={handleSignup}>signup</Button>
			<Button sx={{color: 'primary.main'}} onClick={handleLogin}>signin</Button>
			<Oauth2>Login via intra</Oauth2>
			{error.lenght === 0 ? <></> : <Typography sx={{p:1}} align="center" color="tomato">{error}</Typography> }
		</FormControl>
	</Grid>
	)

}