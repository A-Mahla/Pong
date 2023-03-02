import { useContext, useNavigate } from 'react'
import useAuth from '/src/pong/context/useAuth'

export type Api = {
	api: {
		input: RequestInfo | URL,
		option?: RequestInit,
	}
	auth: {
		token: string,
		setUser: React.Dispatch<React.SetStateAction<string>>,
		setToken: React.Dispatch<React.SetStateAction<string>>,
	}
}

export type apiInput = {
	input: RequestInfo | URL,
	option?: RequestInit,
}

export type responseApi = {
	response: Response,
	data: JSON.Element
}

export const originalRequest = async (api: apiInput) => {

	const response = await fetch(api.input, api.option);
	const data = await response.json();
	return {response, data};

}

export const refreshRequest = async () => {


	const response = await fetch(`http://${import.meta.env.VITE_SITE}/api/auth/refresh`);
	const data = await response.json();
	return { response, data };

}

export const FetchApi = async (fetchType: Api) => {

	try {

		fetchApi.api['option']['headers']['Authorization'] = `Bearer ${fetchType.auth.token}`

		const response: responseApi = await originalRequest(fetchType.api)

		if (response.response.statusText === "Unauthorized") {

			const request: responseApi = await refreshRequest();

			if (refresh.response.status !== 200 && refresh.response.status !== 304) {
				fetchType.auth.setToken('');
				fetchType.auth.setUser('');
				useNavigate()('/login');
			}

			fetchType.auth.setToken(refresh.data['aT']);
			fetchApi.api['option']['headers']['Authorization'] = `Bearer ${refresh.data['aT']}`

			return await originalRequest(fetchApi)
		}
		return response;

	} catch (err) {
		console.log(err);
	}
}
