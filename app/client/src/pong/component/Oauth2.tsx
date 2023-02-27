import { Button, Grid, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import { TextField, FormControl, CircularProgress } from "@mui/material"
import Cookies from 'js-cookie'


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

	const [fetched, setFetched] = useState(false)

	const [intraLogin, setIntraLogin] = useState('')

	const [error, setError] = useState('')
 
	const login = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>

	const fetchApi = () => {
		fetch(`http://localhost:5500/api/users/intra42/login${url.search}`)
		.then(response => {
			response.json().then(
				data => {
					if (response.status == 200)
					{
						if (data['signedIn'])
						{
							Cookies.set('login', data['login'], {expires: 7})
							location.replace("http://localhost:3000")
						}
						else
						{
							setIntraLogin(data['intraLogin'])
							setFetched(true)
						}
					}
				}
			)
		})
	}

	useEffect(() => fetchApi())

	const handleIntraLogin = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

		e.preventDefault()

		const requestOptions = {
			method: "POST",
		}
		console.log('login.current.value: ', login.current.value)

		fetch(`http://localhost:5500/api/users/intra42?login=${login.current.value}&intraLogin=${intraLogin}`, requestOptions)
		.then(response => {
			response.json().then(
				data => {
					if (response.status == 201)
					{
						Cookies.set('login', data['login'], {expires: 7})
						location.replace("http://localhost:3000")
					}
					else
						setError(data["message"])
				} 
			)
		})

	}, [intraLogin])

	return (
		<Grid container justifyContent="center">
			{fetched ? 
					<FormControl>
					<TextField type="text" inputRef={login} label="Login" sx={{p : 1}}/>	
					<Button sx={{color: 'primary.main'}} onClick={handleIntraLogin}>signin</Button>
					{error === '' ? null : <Typography sx={{p:1}} align="center" color="tomato">{error}</Typography> }
					</FormControl>
 				: <CircularProgress/>  }
		</Grid>
	)
}
