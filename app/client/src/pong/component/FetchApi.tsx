import * from 'react'

type Api = {
	input: RequestInfo | URL,
	option?: RequestInit

}

export const FetchApi = async (api: Api) =>
		
	const [data, setData] = React.useState<Response>(null);

	React.useEffect(() => {

		const firstResponse = await fetch(api.input, api.option);
		if (firstResponse.statusText === "Unauthorszed" ) {
			//		response = await fetch(`http://${import.meta.env.VITE_SITE}/api/auth/refresh`);
			const refresh = await fetch(`http://localhost:8080/api/auth/refresh`);
			if (refresh.statusText === "Unauthorized") {
				location.replace(`http://localhost:8080`);
				//location.replace(`http://${import.meta.env.VITE_SITE}`);
			}
			return await fetch(api.input, api.option);
		}
		return firstResponse;
	}
}
