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

	const fetchType: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/2fa/generate`,
			dataType: 'null',
		},
		auth: useFetchAuth(),
	}

	useEffect( () => {

		async function fetching() {
			const {response, data} = await FetchApi(fetchType);
			setFetched(true);
			setUrl(response.body.getReader())
		}
		fetching();
		return undefined
	}, [])
	
	return <Box>
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
