import {
	Box,
	Grid,
	Typography,
	FormControl,
	TextField,
	Button,
} from '@mui/material'
import useMediaQuery from "/src/pong/hooks/useMediaQuery"
import { useState, useRef } from 'react'
import * as React from 'react';
import TFAComponent from '/src/pong/Profile/TFAComponent'
import { FetchApi, Api } from '/src/pong/component/FetchApi'
import useAuth, { useFetchAuth } from '/src/pong/context/useAuth'

type InfoProps = {
	isAccordion: boolean,
	setIsAccordion: React.Dispatch<React.SetStateAction<boolean>>,
}

const ChangeInfo = (props: InfoProps) => {

	const fetchAuth = useFetchAuth()

	const [error, setError] = useState('');
	const isQuery950 = useMediaQuery('(max-width: 950px)')

	const password = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;
	const passwordConfirm = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setError('')
	}

	const handlePassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (password.current.value === '' || passwordConfirm.current.value === '') {
			setError('')
		} else if ( password.current.value !== passwordConfirm.current.value ) {
			setError('Passwords are different')
		} else {
			const response = await FetchApi({
				api: {
					input: `http://${import.meta.env.VITE_SITE}/api/users/profile/pass`,
					option: {
						method: 'POST',
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							password: password.current.value,
						}),
					}
				},
				auth: fetchAuth,
			})
			console.log('test')
			if (response.response.status === 201) {
				password.current.value = null;
				passwordConfirm.current.value = null;
				setError('Password Modified');
			}
		}
	}

	return <>
		<FormControl>
			<Box display={props.isAccordion && isQuery950 ? 'flex' : 'grid'}
				justifyContent='center'
				sx={ isQuery950 && props.isAccordion ?
					{ '@media (max-width: 950px)': { pt: 0.5 }, justifyContent:'center' } :
					{ '@media (max-width: 950px)': { pt: 0.5 }, justifyContent:'center' }
				}
			>
				<TextField
					type='text'
					id="outlined-password-input"
					inputRef={password}
					variant="outlined"
					label="New Password"
					size="small"
					onChange={handleChange}
					inputProps={{
						style: {
							fontFamily: '"system-ui", sans-serif'
						}
					}}
					sx={{p: 1 }}
				></TextField>
				<TextField
					type='text'
					id="outlined-password-input"
					inputRef={passwordConfirm}
					variant="outlined"
					label="Confirm Password"
					size="small"
					onChange={handleChange}
					inputProps={{
						style: {
							fontFamily: '"system-ui", sans-serif'
						}
					}}
					sx={{p: 1 }}
				></TextField>
				<Button size="small"
					sx={{ color: 'primary.main',
						'@media (max-width: 950px)': {
							p: 0
						},
					 }}
					onClick={handlePassword}>change password</Button>
			</Box>
			{ error === '' ?
				null :
				<>
				{ error === 'Password Modified' ?
					<Typography variant='caption' align="center" style={{color:"#229954"}}
						sx={{
							//				fontFamily: '"system-ui", sans-serif',
							fontSize: [9, '!important']
						}}
					>
						{error}
					</Typography> :
					<Typography variant='caption' align="center" color="tomato"
						sx={{
							//				fontFamily: '"system-ui", sans-serif',
							fontSize: [9, '!important']
						}}
					>
						{error}
					</Typography>
				}
				</>
			}
		</FormControl>
	</>
}

export default ChangeInfo;
