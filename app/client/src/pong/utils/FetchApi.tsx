
type Api = {
	input: RequestInfo | URL,
	option?: RequestInit

}

export const FetchApi = async (api: Api) => {
	const firstResponse = await fetch(api.input, api.option);
	if (response.statusText === "Unauthorized" ) {
		//		response = await fetch(`http://${import.meta.env.VITE_SITE}/api/auth/refresh`);
		const refresh = await fetch(`http://localhost:8080/api/auth/refresh`);
		if (response.statusText === "Unauthorized") {
			location.replace(`http://localhost:8080`);
			//location.replace(`http://${import.meta.env.VITE_SITE}`);
		}
		return await fetch(api.input, api.option);
	}
	return firstResponse;
}
