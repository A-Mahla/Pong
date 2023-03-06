import useAuth, { useFetchAuth } from '/src/pong/context/useAuth';
import { FetchApi, Api } from '/src/pong/component/FetchApi';
import { useState, useEffect } from 'react';
import { QRCodeCanvas } from "qrcode.react";
import { Box } from '@mui/material';

export const QRCode = () => {

	const {user} = useAuth();

	const [fetched, setFetched] = useState(false);
	const [url, setUrl] = useState('');
	const [qrcode, setQrcode] = useState<string>('');
	const [code, setCode] = useState<string>('');

	const fetchType: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/2fa/generate`,
			option: {
				method: 'POST'
			},
			dataType: 'null',
		},
		auth: useFetchAuth(),
	}

	useEffect( () => {

		async function fetching() {
			const {response, data} = await FetchApi(fetchType);
			const result = await response.body.getReader().read();
			/*			console.log(result)
			console.log(new TextDecoder().decode(result.value))
			setUrl(new TextDecoder().decode(result.value))
			 */
			console.log(result)
			

			setUrl(result)
			setFetched(true);
		}
		fetching();
		return undefined
	}, [])


	
	return <Box sx={{ 
			display: 'flex',
			justifyContent: 'center',
		}}>
		{!fetched ?
			null :
			<QRCodeCanvas
				id="qrCode"
				value={url}
				size={300}
				bgColor={"#F5F5FF"}
				level={"H"}
			/>
		}
	</Box>

}

