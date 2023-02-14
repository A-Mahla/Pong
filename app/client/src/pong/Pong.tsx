import { Typography, Button, ThemeProvider, createTheme } from '@mui/material'
import { useCallback } from "react"  
import { Redirect } from "./Oauth2"
import { MainPage } from "./MainPage"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

/**
 * ============ Entrypoint of the project =============
 */

const theme = createTheme({
	typography: {
		fontFamily: ['pong-policy']
	},
	palette: {
		primary: {
			main: 'rgba(0, 0, 0, 0.87)'
		}
	}
})

export const Pong = () => {

	return (
		<>
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<MainPage/>} />
					<Route path="/redirect" element={<Redirect/>} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
		</>
	)
}
