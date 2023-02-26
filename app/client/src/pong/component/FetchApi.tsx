import * from 'react'

type Api = {
	input: RequestInfo | URL,
	option?: RequestInit
}

let originalRequest = async (api: Api) => {

	let response = await fetch(api.input, api.option);
	let data = await response.json();
	return {response, data};

}

let refreshRequest = async () => {

	let response = await fetch(`http://localhost:8080/api/auth/refresh`);
	let data = await response.json();
	return data;

}

export const FetchApi = async ({input, option={}}: Api) => {
		
	let {response, data} = await originalRequest(api);
	if (response.statusText === "Unauthorszed" ) {
		//		response = await fetch(`http://${import.meta.env.VITE_SITE}/api/auth/refresh`);
		const refresh = await refreshRequest();
		if (refresh.statusText === "Unauthorized") {
			location.replace(`http://localhost:8080`);
			//location.replace(`http://${import.meta.env.VITE_SITE}`);
		}
		return await originalRequest(api);
	}
	return {response, data};
}
