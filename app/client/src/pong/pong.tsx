import '../App.css';
import { Typography, Button } from '@mui/material'
import { useCallback } from "react"  
import { Oauth2, Redirect } from "./oauth2"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

/**
 * ============ Entrypoint of the project =============
 */

export const Pong = () => {

	return (
		<>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Oauth2/>} />
				<Route path="/redirect" element={<Redirect/>} />
			</Routes>
		</BrowserRouter>
		</>
	)
}
