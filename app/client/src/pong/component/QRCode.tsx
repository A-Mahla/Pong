import useAuth, { useFetchAuth } from '/src/pong/context/useAuth';
import { FetchApi, Api } from '/src/pong/component/FetchApi';
import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import axios from 'axios';
import { 
	List,
	ListItem,
	ListItemText,
	Box,
	Grid, 
	Divider, 
	Typography, 
	TextField, 
	FormControl, 
	CircularProgress,
	Paper,
	FormHelperText,
} from '@mui/material';
import { useFormControl } from '@mui/material/FormControl';


function isNumber(str) {
  return /^\d+$/.test(str);
}

const centralBoxStyle = {
	height: '25rem',
	p: 1,
	borderRadius: '32px',
	'&.MuiPaper-root': {
		backgroundColor: 'primary'
	},
	'@media (max-width: 950px)': {
		p: 0,
		height: '40rem'
	},
	'@media (max-width: 780px)': {
		width: 400
	}
}

const AuthInstruction = () => {

	return <>
		<Box
			display='flex'
			justifyContent='center'
			sx={{
				mt: '2rem',
				height: '2rem',
			}}
		>
			<Typography variant='body'>
				Two-Factor Authentication
			</Typography>
		</Box>
		<Divider variant='middle'/>
		<Box display='flex'
			justifyContent='center'
		>
			<List>
				<ListItem
					sx={{
						listStyleType: "number",
						display: 'list-item',
					}}
				>
					<ListItemText
						primary='Install Google Authenticator (IOS - Android)
							or Authy (IOS - Android).'
						disableTypography={true}
						sx={{
							fontSize: 12
						}}
					/>
				</ListItem>
				<ListItem
					sx={{
						listStyleType: "number",
						display: 'list-item',
					}}
				>
					<ListItemText
						primary="In the authenticator app, select '+' icon"
						disableTypography={true}
						sx={{
							fontSize: 12
						}}
					/>
				</ListItem>
				<ListItem
					sx={{
						listStyleType: "number",
						display: 'list-item',
					}}
				>
					<ListItemText
						primary="Select 'Scan a barcode (or QR code)' and use the phone's camera
								to scan this barcode."
						disableTypography={true}
						sx={{
							fontSize: 12
						}}
					/>
				</ListItem>
			</List>
		</Box>
	</>

}

export const QRCodeComponent = () => {

	//	const {user, token, twoFA} = useAuth();
	const {twoFA} = useAuth();

	const {error, setError} = useState<string>('')

	const [fetched, setFetched] = useState(false);
	const [qrcode, setQrcode] = useState<string>('');
	const [code, setCode] = useState<string>('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		if( e.target.value.length === 6 ) {

			if (!isNumber(e.target.value)) {
				setError('Error Code')
			} else {

				try {
					twoFA(`http://${import.meta.env.VITE_SITE}/api/2fa/authenticate?twoFA=${e.target.value}`)
				} catch(err) {
					console.log(err)
				}

			}

		}
	}



	useEffect( () => {


		async function fetching() {

			try {
				const result = await axios.post(

					`http://${import.meta.env.VITE_SITE}/api/2fa/generate`,
					{},
					{ 
						withCredentials: true,
						responseType: 'blob',
					}
				);
		
				setQrcode(URL.createObjectURL(result.data))
			} catch(err) {
				console.log(err)
			} finally {
				setFetched(true);
			}
		}
		fetching();
		return undefined
	}, [])

	return (
		<>
		{!fetched ? (
				<CircularProgress />
			) : (
				<>
					<Box sx={{ my: 'auto' }}>
						<Typography variant='h4'>Pong</Typography>
					</Box>
					<Divider variant='middle' />
					<Box display='flex'
						justifyContent='center'
						sx={{
							mt: '3rem',
							px: '10rem',
							pt: '5rem',
							'@media (max-width: 780px)': {
								px: '0vw;'
							}
						}}
					>
						<Paper elevation={24} sx={centralBoxStyle}>
							<Grid container
								className='test'
								sx={{
									all: 'initial',
									ml: '3rem',
									mt: '3rem',
									mb: '3rem',
									mr: '3rem',
									height: '19rem',
									widht:  '30rem',
									display: 'flex',
									'@media (max-width: 950px)': {
										display: 'block',
									}
								}}
							>
								<Grid item md={6} xs={12}>
									<AuthInstruction />
								</Grid>
								<Grid justifyContent='center' item md={6} xs={12}>
									<Box display='flex' justifyContent='center'>
										<img src={qrcode} />
									</Box>
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
													mt: 1
												}}
											></TextField>
										</FormControl>
									</Box>
								</Grid>
							</Grid>
						</Paper>
					</Box>
				</>
			)}
			</>
	);


	

}
