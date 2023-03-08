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


const centralBoxStyle = {
	height: '25rem',
	p: 1,
	borderRadius: '32px',
	'&.MuiPaper-root': {
		backgroundColor: 'primary'
	}
}

const AuthInstruction = () => {

	return <>
		<Box
			display='flex'
			justifyContent='center'
			sx={{
				mt: '2rem',
				height: '2rem'
			}}
		>
			<Typography variant='body'>
				Two-Factor Authentication (2FA)
			</Typography>
		</Box>
		<Divider variant='middle'/>
		<Box display='flex' justifyContent='center'>
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

	const {user, token} = useAuth();

	const [open, setOpen] = useState(false);

	const [fetched, setFetched] = useState(false);
	const [url, setUrl] = useState<string>('');
	const [qrcode, setQrcode] = useState<string>('');
	const [code, setCode] = useState<string>('');

	const codeValidate = useRef<HTMLInputElement>('')

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		if( e.target.value.length === 6 )
			console.log(e.target.value)
	}



	useEffect( () => {

			async function fetching() {
				const result = await axios.post(
				`/api/2fa/generate`,
				{},
				{ 
					responseType: 'blob',
					headers: {
						'Authorization': `Bearer ${token}`
					},
				}
				);

			setUrl(URL.createObjectURL(result.data))
			setFetched(true);
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
					<Box sx={{mt: '3rem', px: '10rem', pt: '5rem'}}>
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
									flexDirection: 'row',
									flexWrap: 'wrap'
								}}
							>
								<Grid item xs={6}>
									<AuthInstruction />
								</Grid>
								<Grid justifyContent='center' item xs={6}>
									<Box display='flex' justifyContent='center'>
										<img src={url} />
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
												inputRef={codeValidate}
												label="Authentication"
												inputProps={{
													inputMode: 'numeric',
													pattern: '[0-9]*',
													sx: {
														fontSize:13
													}
												}}
												sx={{p: 0, mx: 1, mt: 1}}
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

//			<Grid container justifyContent='center' sx={{ height: 600, pt: 15 }}>
//				</Grid>


 
