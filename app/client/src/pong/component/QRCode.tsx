import useAuth, { useFetchAuth } from '/src/pong/context/useAuth';
import { FetchApi, Api } from '/src/pong/component/FetchApi';
import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import axios from 'axios';
import { Box } from '@mui/material';



import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import Typography from '@mui/joy/Typography';

import { Experimental_CssVarsProvider } from '@mui/material/styles';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';


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

	
	return <>
		<CssVarsProvider>
		<Button
			variant="outlined"
			color="neutral"
			startDecorator={<Add />}
			onClick={() => setOpen(true)}
		>
			QRCode
		</Button>
		<Modal
			open={open} onClose={() => setOpen(false)} sx={{bgColor: '#000000'}}>
			<ModalDialog
				aria-labelledby="Google Authenticator"
				aria-describedby="Google Authenticator"
				sx={{ maxWidth: 500 }}
			 >
				{!fetched ?
					null :
					<img src={url} />
				}
				<Input
					color="neutral"
					disabled={false}
					placeholder="Authorization Code"
					size="md"
					sx={{
						 "--Input-focusedThickness": "0px"
					}}
					onChange={handleChange}
				/>
			</ModalDialog>
		</Modal>
	</CssVarsProvider>
	</>

}


 
