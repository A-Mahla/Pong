import * as React from 'react'

export type Api = {
	input: RequestInfo | URL,
	option?: RequestInit
}

const originalRequest = async (api: Api) => {

	const response = await fetch(api.input, api.option);
	const data = await response.json();
	return {response, data};

}

const refreshRequest = async () => {

	const response = await fetch(`http://${import.meta.env.VITE_SITE}/api/auth/refresh`);
	const data = await response.json();
	return data;

}

export const FetchApi = async ({input, option={}}: Api) => {
		
	const {response, data} = await originalRequest({input, option});

	if (response.statusText === "Unauthorized" ) {
		const refresh = await refreshRequest();

		if (refresh.statusText === "Unauthorized") {
			location.replace(`http://${import.meta.env.VITE_SITE}`);
		}
		return await originalRequest({input, option});
	}

	return {response, data};
}
