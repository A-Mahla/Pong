import { useContext, useHistory } as React from 'react'
import { useAuth } from "/src/pong/context/useAuth"

export type Api = {
	input: RequestInfo | URL,
	option?: RequestInit
}

export const originalRequest = async (api: Api) => {

	const response = await fetch(api.input, api.option);
	const data = await response.json();
	return {response, data};

}

export const refreshRequest = async () => {

	const response = await fetch(`http://${import.meta.env.VITE_SITE}/api/auth/refresh`);
	const data = await response.json();
	return data;

}

export const FetchApi = async ({input, option={}}: Api) => {

	const {token, setToken} = useAuth();

	try {
		const { response, data } = await originalRequest({
			input,
			{
				...option,
				header: {
					...header,
					'Authorization': `Bearer ${token}`,
				}
			}
		});

		if (response.statusText !== "Unauthorized") {
			const refresh = await refreshRequest();

			if (refresh.status !== 200 || refresh.status !== 304) {
				useHistory().push(`http://${import.meta.env.VITE_SITE}/login`);
			}

			setToken(token => refresh['aT']);

			return await originalRequest({
				input,
				{
					...option,
					header: {
						...header,
						'Authorization': `Bearer ${token}`,
					}
				}
			});
		}
		return { response, data };

	} catch (err) {
		console.log(err);
	}
}
