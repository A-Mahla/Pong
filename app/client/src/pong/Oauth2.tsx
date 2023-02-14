import { Button, Box } from '@mui/material'
import { useLocation } from "react-router-dom"
import { useCallback } from 'react'


type Props = {
	children?: string
}

export const Oauth2 = (props: Props) => {

	const handleClick = useCallback( async () => {
		let response = await fetch(`https://api.intra.42.fr/v2/oauth/authorize?client_id=u-s4t2ud-2963e5d6c6ab1d8f9e2dcba0e3f2d6909a14a6933dee099c55d7699f8c01f9e7&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fredirect&response_type=code`, {redirect: "manual"})
		location.replace(response.url)
	}, [])

	return (
		<Button sx={{color: 'primary.main'}} onClick={handleClick}>{props.children}</Button>
	)
}

async function fetchApi(query: string) {

	const requestOptions = {
		method: "POST",
	}

	const response = await fetch(`http://localhost:5500/api/auth/intra42/login${query}`, requestOptions)
	.then(response => console.log(response.json()))
	.then(data => console.log(data))
	
}

export const Redirect = () => {
	const url = useLocation()

	fetchApi(url.search)

	location.replace("http://localhost:3000")
	return (
		<>
		{url.search}
		</>
	)
}
