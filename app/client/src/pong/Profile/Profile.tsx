import { Box, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import '/src/pong/page/LeadPage.css'
//import { ThemeProvider, createTheme } from '@mui/material/styles';
import AvatarGrid from '/src/pong/Profile/Avatar'
import UserPanelGrid from '/src/pong/Profile/UserPanel'
import useAuth, { useFetchAuth } from '/src/pong/context/useAuth' 
import { FetchApi, Api } from '/src/pong/component/FetchApi' 
import { ThemeProvider, createTheme, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const theme = createTheme({
	typography: {
		fontFamily: ['pong-policy']
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 550,
			mmd: 700,
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

const Profile = () => {

	const navigate = useNavigate()

	const {token} = useAuth();

	const [image, setImage] = useState<URL>(null);
	const [fetched, setFetched] = useState(false);


	const fetchType: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/users/profile/info`,
			option: {
				method: "GET",
			},
		},
		auth: useFetchAuth(),
	}


	useEffect(() => {
		async function fetching() {

			try {
				const {response, data} = await FetchApi(fetchType);
				if (response.status === 200 || response.status === 304) {

					if (data['avatar'] !== null) {

						const result = await axios.get(

							`http://${import.meta.env.VITE_SITE}/api/users/profile/avatar`,
								{ 
								withCredentials: true,
								responseType: 'blob',
								headers: {
									Authorization: `Bearer ${token}`,
								}
							}
						)

						await setImage(await URL.createObjectURL(result.data))
					}

				} else {
					navigate('/login')
				}
			} catch(err) {
				console.log(err)
			} finally {
				setFetched(true);
			}

		}
		fetching()
		return undefined
	}, [])



	return <>
	{ !fetched ? <CircularProgress/> : 
		<ThemeProvider theme={theme}>
			<Grid item sm={5} xs={12}
				sx={{
					position: 'relative',
					top: '3rem',
					height: '12rem',
					p: '1vw;',
					border: 1,
					display: 'flex',
					'@media (max-width: 950px)': {
						p: 0,
						display: 'grid',
						height: '14rem',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%'
					},
				}
			}>
				<AvatarGrid image={image} setImage={setImage} />
			</Grid>
			<Grid item xs={7}
				sx={{
					position: 'relative',
					top: '3rem',
					height: '12rem',
					py: '1vw;',
					px: '2vw;',
					border: 1,
					display: 'flex',
					'@media (max-width: 950px)': {
						py: '0.5vw;',
						display: 'block',
						height: '14rem',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%'
					},
					'@media (max-width: 549px)': {
						display: 'none',
					}
				}
			}>
				<UserPanelGrid />
			</Grid>
			<Grid item xs={4}
				sx={{
					position: 'relative',
					top: '3rem',
					height: '20rem',
					py: '1vw;',
					px: '2vw;',
					border: 1
				}
			}>
			</Grid>
			<Grid item xs={4}
				sx={{
					position: 'relative',
					top: '3rem',
					height: '20rem',
					py: '1vw;',
					px: '2vw;',
					border: 1
				}
			}>
			</Grid>
			<Grid item xs={4}
				sx={{
					position: 'relative',
					top: '3rem',
					height: '20rem',
					py: '1vw;',
					px: '2vw;',
					border: 1
				}
			}>
			</Grid>
		</ThemeProvider>
		}
	</>
}
export default Profile;
