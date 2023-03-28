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
import Game from '/src/pong/page/Game';
import { GameSocketProvider } from './services/GameSocketProvider';
import { GamePage } from './page/Game';
import { ChatSocketProvider } from './Chatv2/Socket';
import SignUp from './component/SignUp';

/**
 * ============ Entrypoint of the project =============
 */

const theme = createTheme({
	typography: {
		fontFamily: ['pong-policy']
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 950,
			lg: 1200,
			xl: 1536,
		},
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
						<Route path='/chat' element={<ChatSocketProvider/>} />
						<Route path='/login' element={<Login/>}/>
						<Route path='/pong' element={<LeadPage/>} />
						<Route path='/signup' element={<SignUp/>}/>
						<Route path="/redirect" element={<Redirect/>} />
					</Routes>
				</AuthProvider>
			</BrowserRouter>
		</ThemeProvider>
		</>
	)
}
//						<Route element= { <LoggedRoute /> }>

//				<Route path='/chat' element={<Chat/>} />

