import { Button, Grid, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import { TextField, FormControl, CircularProgress } from "@mui/material"
import Cookies from 'js-cookie'
import useAuth from '/src/pong/context/useAuth'


type Props = {
	children?: string
}

export const Oauth2 = (props: Props) => {

	const handleClick = useCallback( async () => {

		let intraUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=';
		intraUrl += `${import.meta.env.VITE_API_UID}`;
		intraUrl += '&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F';
		intraUrl += 'redirect&response_type=code'

		fetch(intraUrl, {redirect: "manual"})
		.then(response => location.replace(response.url))
	}, [])

	return (
		<Button sx={{color: 'primary.main'}} onClick={handleClick}>{props.children}</Button>
	)
}

export const Redirect = () => {

	const url = useLocation()

	const {authLogIntra} = useAuth()

	const [fetched, setFetched] = useState(false)

	const [intraLogin, setIntraLogin] = useState('')

	const [error, setError] = useState('')
 
	const login = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>


	const fetchApi = async () => {

		try {
			const response = await fetch(`http://${import.meta.env.VITE_SITE}/api/auth/intra42/login${url.search}`)
			const data = await response.json()
			console.log(data);
			console.log(response);
			if (response.status == 200) {
				if (data['signedIn']) {

					Cookies.set('login', data['login'], {expires: 7})
					location.replace("http://localhost:8080")
				} else {

					setIntraLogin(data['intraLogin'])
				}
			}
		} catch(err) {
			console.log(err);
		} finally {
			setFetched(true)
		}
	}

	useEffect(() => {
	//	fetchApi()
		setIntraLogin(authLogIntra(`http://${import.meta.env.VITE_SITE}/api/auth/intra42/login${url.search}`))
		setFetched(true)
		return undefined
	}, [])

	const handleIntraLogin = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

		e.preventDefault()

		const requestOptions = {
			method: "POST",
		}
		console.log('login.current.value: ', login.current.value)

		fetch(`http://${import.meta.env.VITE_SITE}/api/users/intra42?login=${login.current.value}&intraLogin=${intraLogin}`, requestOptions)
		.then(response => {
			response.json().then(
				data => {
					if (response.status == 201)
					{
						Cookies.set('login', data['login'], {expires: 7})
						location.replace("http://localhost:8080")
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
