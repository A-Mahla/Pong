import { Button, Box, Grid, Typography } from '@mui/material'
import { useLocation } from "react-router-dom"
import React, { useCallback, useRef, useState } from 'react'
import { TextField, FormControl } from "@mui/material"


type Props = {
	children?: string
}

export const Oauth2 = (props: Props) => {

	const handleClick = useCallback( async () => {
		fetch(`https://api.intra.42.fr/v2/oauth/authorize?client_id=u-s4t2ud-2963e5d6c6ab1d8f9e2dcba0e3f2d6909a14a6933dee099c55d7699f8c01f9e7&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fredirect&response_type=code`, {redirect: "manual"})
		.then(response => location.replace(response.url))
	}, [])

	return (
		<Button sx={{color: 'primary.main'}} onClick={handleClick}>{props.children}</Button>
	)
}

export const Redirect = () => {

	const url = useLocation()

	const requestOptions = {
		method: "GET",
	}

	const [intraLogin, setIntraLogin] = useState('')

	let fetched = false

	fetch(`http://localhost:5500/api/auth/intra42/login${url.search}`, requestOptions)
	.then(response => response.json())
	.then(data => {
		if (data["statusCode"] == 200)
		{
			if (data["body"]["signedin"] == true)
				console.log(data['body'])
					//return location.replace("http://localhost:3000")
			setIntraLogin(data['body']['intraLogin'])
			fetched = true
		}
	})

	console.log('intraLogin', intraLogin)

	const [error, setError] = useState('')
 
	const login = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>

	const handleLogin = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {

		e.preventDefault()

		const requestOptions = {
			method: "POST",
		}

		fetch(`http://localhost:5500/api/users/intra?login=${login.current.value}&intraLogin=${intraLogin}`, requestOptions)
		.then(response => response.json())
		.then(data => {
			if (data["statusCode"] != 200)
				setError(data["message"])
			else
				location.replace("http://localhost:3000")
		})

	}, [intraLogin, fetched])

	return (
		<Grid container justifyContent="center">
			<FormControl>
			<TextField type="text" inputRef={login} label="Login" sx={{p : 1}}/>	
			<Button sx={{color: 'primary.main'}} onClick={handleLogin}>signin</Button>
			{error.lenght === 0 ? null : <Typography sx={{p:1}} align="center" color="tomato">{error}</Typography> }
			</FormControl>
		</Grid>
	)
}
