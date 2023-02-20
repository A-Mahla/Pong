import { ThemeProvider, createTheme } from '@mui/material'
import { Redirect } from './Oauth2'
import  MainPage  from './MainPage'
import LeadPage from './LeadPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './Login'
import { Test } from './Test'

/**
 * ============ Entrypoint of the project =============
 */

const theme = createTheme({
	typography: {
		fontFamily: ['pong-policy']
	},
	palette: {
		primary: {
			main: 'rgba(21, 35, 47, 0.87)'
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
					<Route path='/pong' element={<LeadPage/>} />
					<Route path='/test' element={<Test/>} />
					<Route path="/redirect" element={<Redirect/>} />
					<Route path='/login' element={<Login/>}/>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
		</>
	)
}
