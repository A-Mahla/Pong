import { useContext, useNavigate } from 'react'
import useAuth from '/src/pong/context/useAuth'

export type Api = {
	input: RequestInfo | URL,
	func: React.Dispatch<React.SetStateAction<string>>,
	option?: RequestInit,
}

export type responseApi = {
	response: any
	reponse: Response,
	data: JSON.Element
}

export const originalRequest = async (api: Api) => {

	const response = await fetch(api.input, api.option);
	const data = await response.json();
	return {response, data};

}

export const refreshRequest = async () => {


	const response = await fetch(`http://${import.meta.env.VITE_SITE}/api/auth/refresh`);
	const data = await response.json();
	return { response, data };

}

export const FetchApi = async ({input, func, option={}}: Api) => {

	try {

		const response: responseApi = await originalRequest({
			input, option,
			func: undefined
		});

		if (response.response.statusText === "Unauthorized") {

			const request: responseApi = await refreshRequest();

			if (refresh.response.status !== 200 && refresh.response.status !== 304) {
				useNavigate()('/login');
			}

			func(refresh.data['aT']);

			return await originalRequest({
				input,
				option: {
					...option,
					headers: {
						...headers,
						'Authorization': `Bearer ${refresh.data['aT']}`,
					}
				},
				func: undefined
			});
		}
		return response;

	} catch (err) {
		console.log(err);
	}
}
