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

type InfoProps = {
	isAccordion: boolean,
	setIsAccordion: React.Dispatch<React.SetStateAction<boolean>>,
}

const ChangeInfo = (props: InfoProps) => {

	const [error, setError] = useState('');
	const isQuery950 = useMediaQuery('(max-width: 950px)')

	const password = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;
	const passwordConfirm = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setError('')
	}

	const handlePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (password.current.value === '' || passwordConfirm.current.value === '') {
			setError('')
		} else if ( password.current.value !== passwordConfirm.current.value ) {
			console.log('test')
			setError('Passwords are different')
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
			{ error === '' ? null :
				<Typography variant='caption' align="center" color="tomato"
					sx={{
						//				fontFamily: '"system-ui", sans-serif',
						fontSize: [9, '!important']
					}}
				>
					{error}
				</Typography>
			}
		</FormControl>
	</>
}

const UserPanelGrid = () => {

	const [isAccordion, setIsAccordion] = useState<boolean>(false)

	return <>

		<Grid item xl={4} md={5} xs={12}
			sx={{
				mx: 0,
				border: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				'@media (max-width: 950px)': {
					display: 'block'
				}
			}}
		
		>
			<TFAComponent isAccordion={isAccordion} setIsAccordion={setIsAccordion}/>
		</Grid>
		<Grid item xl={8} md={7} xs={12}
			sx={{
				p: '1vw;',
				border: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<ChangeInfo isAccordion={isAccordion} setIsAccordion={setIsAccordion}/>
		</Grid>
	</>
}

export default UserPanelGrid;
