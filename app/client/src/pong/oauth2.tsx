import { Button } from '@mui/material'
import { useLocation } from "react-router-dom"
import { useCallback } from 'react'

export const Oauth2 = () => {

	const handleClick = useCallback( async () => {
		let response = await fetch("https://api.intra.42.fr/v2/oauth/authorize?client_id=u-s4t2ud-cf027037aecd3425a69a0c9e8ad026fc94bad3dca05f54d2ee812489852576ce&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fredirect&response_type=code", {redirect: "manual"})
		location.replace(response.url)
	}, [])

	return (
		<>
			<Button onClick={handleClick}>pong</Button>
		</>
	)
}

export const Redirect = () => {
	const url = useLocation()
	console.log(url)
	return (
		<>
		</>
	)
}
