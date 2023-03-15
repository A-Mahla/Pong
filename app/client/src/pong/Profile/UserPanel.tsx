import {
	Grid,
	Switch,
	FormControlLabel,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	createTheme,
	ThemeProvider,
	Typography,
	FormControl,
	TextField,
	FormLabel,
	Dialog,
	DialogContent,
} from '@mui/material'

import { 
	List,
	ListItem,
	ListItemText,
	Box,
	Divider, 
	CircularProgress,
	Paper,
	FormHelperText,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState, useEffect, useRef } from 'react'
import useAuth, { useFetchAuth } from '/src/pong/context/useAuth'
import { FetchApi, Api, refreshRequest } from '/src/pong/component/FetchApi'
import * as React from 'react';
import axios from 'axios';

/*const theme = createTheme({
	typography: {
		fontFamily: ['system-ui', 'sans-serif'].join(','),
	},
	});*/

function isNumber(str) {
  return /^\d+$/.test(str);
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
	const {twoFA, token} = useAuth();

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

				console.log(token)

				const result = await axios.post(

					`http://${import.meta.env.VITE_SITE}/api/2fa/generate`,
					{},
					{ 
						withCredentials: true,
						responseType: 'blob',
						headers: {
							Authorization: `Bearer ${token}`,
						}
					}
				)
				
				console.log(result.status)

				if (result.status !== 201) {

					const refresh = await originalRequest()

					if (refresh.response.status !== 200 && refresh.response.status !== 304) {
						fetchType.auth.setToken('');
						fetchType.auth.setUser('');
						fetchType.auth.setId(0);
						fetchType.auth.setIntraLogin('');
						useNavigate()('/login');
						return
					}

					const result2 = await axios.post(

						`http://${import.meta.env.VITE_SITE}/api/2fa/generate`,
						{},
						{ 
							withCredentials: true,
							responseType: 'blob',
							headers: {
								Authorzsation: `Bearer ${token}`,
							}
						}
					)

					await setQrcode(await URL.createObjectURL(result2.data))

				} else {
					await setQrcode(await URL.createObjectURL(result.data))
				}
		
			} catch(err) {
				console.log(err)
			} finally {
				setFetched(true);
			}
		}
		fetching();
		//		return undefined
	}, [])

	return (
		<>
		{!fetched ? (
				<CircularProgress />
			) : (
				<>
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
				</>
			)}
			</>
	);


	

}


const TFAComponent = () => {

	const [check, setCheck] = useState(false)
	const [isActivate, setIsActivate] = useState('Disable')
	const [open, setOpen] = useState(false)

	const auth = useFetchAuth()

	const handleClose = () => {
		setOpen(false);
	}


	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		await setCheck(e.target.checked)
		if (e.target.checked) {
			/*			await FetchApi({
				api: {
					input: `http://${import.meta.env.VITE_SITE}/api/2fa/turn-on`
				},
					auth: auth
					})*/
			setOpen(true)
		} else {
			await FetchApi({
				api: {
					input: `http://${import.meta.env.VITE_SITE}/api/2fa/turn-off`
				},
					auth: auth
			})
		}
		setIsActivate(!e.target.checked === true ? 'Disable' : 'Enable')
	}

	useEffect(() => {
		async function fetching() {
			try {
				const response: Api = await FetchApi({
					api: {
						input: `http://${import.meta.env.VITE_SITE}/api/2fa/activate`
					},
						auth: auth
				})
				setCheck(response.data['isTfaActivate'] ? true : false)
				setIsActivate(!response.data['isTfaActivate'] ? 'Disable' : 'Enable')
			} catch(err) {
				console.log(err)
			}
		}
		fetching()
	}, [])


	return <>
			<Accordion elevation={0}>
				 <AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography
						fontSize={{
							xl: '0.9rem',
							lg: '0.7rem',
							md: '0.6rem',
							mmd: '0.7rem',
							sm: '0.7rem',
							xs: '0.7rem'
						}}
					>
						Two-Factor Authentification
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<FormControlLabel
						sx={{
							mr: 0,
							ml: 0,
							display:'flex',
							alignText: 'left'
						}}
						control={<Switch checked={check} onChange={handleChange}/>}
						label={
							<Typography
								fontFamily={'"system-ui", sans-serif'}
								fontSize={{
									xl: '1rem',
									lg: '0.9rem',
									md: '0.8rem',
									mmd: '0.8rem',
									sm: '0.8rem',
									xs: '0.8rem'
								}}
							>
								{isActivate}
							</Typography>
						}
					/>
				</AccordionDetails>
			</Accordion>
		<Dialog open={open} onClose={handleClose}>
			<DialogContent>
				<QRCodeComponent/>
			</DialogContent>
		</Dialog>
	</>

}

const ChangeInfo = () => {

	const [error, setError] = useState('');

	const username = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const password = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	return <>
		<FormControl>
			<TextField
				type='text'
				id="outlined-password-input"
				inputRef={password}
				variant="outlined"
				label="New Password"
				size="small"
				sx={{p: 1 }}
			></TextField>
			<TextField
				type='text'
				id="outlined-password-input"
				inputRef={password}
				variant="outlined"
				label="Confirm Password"
				size="small"
				sx={{p: 1 }}
			></TextField>

			{error === '' ? null : <Typography align="center" color="tomato">{error}</Typography> }
		</FormControl>
	</>

}



const UserPanelGrid = () => {


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
			<TFAComponent />
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
			<ChangeInfo/>
		</Grid>
	</>

}

export default UserPanelGrid;
