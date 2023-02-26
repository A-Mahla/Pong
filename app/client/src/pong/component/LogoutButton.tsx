import { Button } from "@mui/material"
import { useCallback } from "react"
import Cookies from 'js-cookie'

export function LogoutButton(props: {children : string}) {

	const handleClick = useCallback(() => {
		Cookies.remove('login')
		window.location.reload(true)
	}, [])

	return (
		<Button onClick={handleClick}>{props.children}</Button>
	)
} 