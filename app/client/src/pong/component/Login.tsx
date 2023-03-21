import {
	Divider,
	Box,
	Button,
	FormControl,
	Grid,
	TextField,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
} from '@mui/material';
import React, {
	useCallback,
	useRef,
	useEffect,
	useState,
	useMemo
} from 'react'
import { useNavigate } from "react-router-dom";
//import { LogoutButton } from '/src/pong/component/LogoutButton';
import { Oauth2 } from '/src/pong/component/Oauth2';
//import Cookies from 'js-cookie'
import { FetchApi } from '/src/pong/component/FetchApi';
import useAuth from '/src/pong/context/useAuth';
//import { _2fa } from "./2fa"
import '/src/App'

function isNumber(str) {
	return /^\d+$/.test(str);
}

type TFAProps = {
	open: boolean,
	setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export const TFAComponent = (props: TFAProps) => {

	const navigate = useNavigate()

	const {error, setError, setUser, setId, twoFA} = useAuth();
	const [count, setCount] = useState(3)

	const handleClose = () => {
		props.setOpen(false)
		navigate('/login')
	}

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setError(undefined)
		if( e.target.value.length === 6 ) {

			if (!isNumber(e.target.value)) {
				setError('Error Authentification Code')
			} else {

				try {
					await twoFA(`http://${import.meta.env.VITE_SITE}/api/2fa/authenticate?twoFA=${e.target.value}`)
				} catch(err) {
					console.log(err)
				}

			}

		}
	}

	useEffect(() => {
		if (!count) {
			setUser('');
			setId(0);
			setError(undefined);
			props.setOpen(false);
			setCount(count => 3)
			navigate('/login')
		}
	}, [count])

	useEffect(() => {
		if (error === 'Error Authentification Code')
			setCount(count => count - 1)
	}, [error])

	return <>
			<Dialog open={props.open} onClose={handleClose}
				 PaperProps={{
					style: {
						borderRadius: '32px',
						height: '15rem',
					}
				}}
			>
			<DialogTitle>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					sx={{mt: 4}}
				>
					<Typography component={'span'} variant='subtitle2' align="center">
						Two-Factor Authentication
					</Typography>
				</Box>
				<Divider variant='middle'/>
			</DialogTitle>
			<DialogContent>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
				>
					<Typography variant='body'
						sx={{
							fontFamily: '"system-ui", sans-serif',
							fontSize: [15, '!important']
						}}
					>
						Enter your code...
					</Typography>
				</Box>
				<Grid justifyContent='center' container>
					<Box
						display='flex'
						justifyContent='center'
						sx={{
							p: '1rem',
						}}
					>
						<FormControl>
							<TextField
								type='text'
								label="Authentication Code"
								onChange={handleChange}
								inputProps={{
									inputMode: 'numeric',
									pattern: '[0-9]*',
									maxLength: 6,
									style: {
										textAlign: 'center',
									},
									sx: {
										py: 1,
										mx: 0,
										px: 0,
										fontSize:22,
									},
								}}
								sx={{
									p: 0,
									pt: 0.5,
									mx: 1,
								}}
								helperText={
									error === '' || error === '2FA' ? null :
									<Typography variant='caption' align="center" color="tomato"
										sx={{
											//				fontFamily: '"system-ui", sans-serif',
											fontSize: [9, '!important']
										}}
									>
										{error}
									</Typography>
								}
							></TextField>
						</FormControl>
					</Box>
				</Grid>
			</DialogContent>
			</Dialog>
		</>
}


export const Login = () => {

	const {authLogin, authSignup, error, setError} = useAuth();

	const [open, setOpen] = useState(false)

	const username = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const password = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const handleChange = (e: React.ChangeEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setError(undefined)
	}


	const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		async function loginAsync() {
			await authLogin(username.current.value, password.current.value)
		}
		loginAsync();
	}

	const handleSignup = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		if (username.current.value === '')
		{
			setError("invalid login");
			return
		} else if (password.current.value === '') {
			setError('password invalid')
			return
		} else if (password.current.length >= 72) {
			setError('password too long')
			return
		}

		async function loginAsync() {
			setError(await authSignup(username.current.value, password.current.value))
		}
		loginAsync();
	})

	useEffect(() => {
		if (error === '2FA') {
			setOpen(true)
		}
	}, [error])

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
					onChange={handleChange}
					sx={{p: 1, mb: 1}}
				></TextField>
				<TextField
					type="password"
					id="outlined-password-input"
					inputRef={password}
					variant="outlined"
					label="Password"
					sx={{p: 1 }}
					onChange={handleChange}
				></TextField>

				<Button sx={{color: 'primary.main'}} onClick={handleSignup}>signup</Button>
				<Button sx={{color: 'primary.main'}} onClick={handleLogin}>signin</Button>
				<Oauth2>Login via intra</Oauth2>
				{!error || error === '2FA' || error === 'Error Authentification Code'
					? null
					: <Typography align="center" color="tomato">{error}</Typography>
				}
			</FormControl>
		</Grid>
		<TFAComponent open={open} setOpen={setOpen} />
	</>

}

//: <LogoutButton>log out</LogoutButton>
//		}
