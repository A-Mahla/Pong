import { ThemeProvider, createTheme } from '@mui/material';
import { Redirect } from '/src/pong/component/Oauth2';
import  MainPage  from '/src/pong/page/MainPage';
import LeadPage from '/src/pong/page/LeadPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '/src/pong/component/Login';
import { AuthProvider } from '/src/pong/context/useAuth';
import PrivateRoute from '/src/pong/component/PrivateRoute';
import LoggedRoute from '/src/pong/component/LoggedRoute';
import { Chat } from '/src/pong/Chat/Chat';
import { QRCodeComponent } from '/src/pong/component/QRCode';
import GameTest from '/src/pong/page/GameTest';

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
				<AuthProvider >
					<Routes>
						<Route path='/' element={<MainPage/>} />
						<Route path='/chat' element={<Chat/>} />
						<Route path='/2fa' element={<QRCodeComponent/>} />
						<Route element= { <LoggedRoute /> }>
							<Route path='/login' element={<Login/>}/>
						</Route>
						<Route element= { <PrivateRoute /> }>
							<Route path='/pong' element={<LeadPage/>} />
						</Route>
						<Route path="/redirect" element={<Redirect/>} />
						<Route path="/gametest" element={<GameTest/>} />
					</Routes>
				</AuthProvider>
			</BrowserRouter>
		</ThemeProvider>
		</>
	)
}
//						<Route element= { <LoggedRoute /> }>

//				<Route path='/chat' element={<Chat/>} />

