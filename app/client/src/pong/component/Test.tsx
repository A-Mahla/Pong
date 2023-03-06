import { useFetchAuth } from '/src/pong/context/useAuth'
import { FetchApi, Api } from '/src/pong/component/FetchApi'
import { useState, useEffect } from 'react'

const Test = () => {

	const {fetched, setFetched} = useState(false);

	const fetchType: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/2fa/generate`,
				option: {
				method: "GET",
			},
		},
		auth: useFetchAuth(),
	}

	useEffect( () => {

		async function fetching() {
			const {response, data} = FetchApi(fetchType);
			setFetched(true);
		}
		fetching();
	}, [])
	


}
