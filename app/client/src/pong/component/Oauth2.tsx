import { Divider, Box, Button, Grid, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import React, { useCallback, useRef, useState, useEffect } from 'react'
import { TextField, FormControl, CircularProgress } from "@mui/material"
import Cookies from 'js-cookie'
import useAuth from '/src/pong/context/useAuth'
import { TFAComponent } from '/src/pong/component/Login'


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

const IntraSignup = () => {

	const {intraLogin, authSignupIntra, loading} = useAuth()

	const [error, setError] = useState('')

	const login = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>

	const handleIntraLogin = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {

		e.preventDefault()
		async function signAsync() {
			setError(await authSignupIntra(`http://${import.meta.env.VITE_SITE}/api/auth/intra42?login=${login.current.value}&intraLogin=${intraLogin}`))
		}
		signAsync();
	})


	return	<FormControl>
		<TextField type="text" inputRef={login} label="Login" sx={{p : 1}}/>	
		<Button sx={{color: 'primary.main'}} onClick={handleIntraLogin}>signin</Button>
		{error === '' ? null : <Typography sx={{p:1}} align="center" color="tomato">{error}</Typography> }
	</FormControl>
}

export const Redirect = () => {

	const url = useLocation()

	const {authLogIntra, error, setError} = useAuth()

	const [status, setStatus] = useState('')

	const [fetched, setFetched] = useState(false)

	const [intraLogin, setIntraLogin] = useState('')

	const [open, setOpen] = useState(true)

	const [isSignup, setIsSignup] = useState(false)

	useEffect(() => {
		async function fetching() {
			await setStatus(await authLogIntra(`http://${import.meta.env.VITE_SITE}/api/auth/intra42/login${url.search}`))
			setFetched(true)
		}
		fetching()
		return undefined
	}, [])


	return (
		<>
		<Box sx={{ my: 'auto' }}>
			<Typography variant='h4'>Pong</Typography>
		</Box>
		<Divider variant='middle'/>
		<Grid container justifyContent="center" sx={{pt: 10}}>
			{fetched && (status === '2FA' || status === 'else')
				? ( <>	
					{ status === '2FA' ? <TFAComponent open={open} setOpen={setOpen} /> : <IntraSignup /> }
					</> )
				: (
					<Box>
						<CircularProgress/> 
					</Box>
				)
			}
		</Grid>
		</>
	)
}
