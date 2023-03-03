import { Box, Grid } from '@mui/material'
import { useEffect } from 'react'
import '/src/pong/page/LeadPage.css'
//import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProfileAvatar from '/src/pong/Profile/Avatar'
import { useFetchAuth } from '/src/pong/context/useAuth' 
import { FetchApi, Api } from '/src/pong/component/FetchApi' 


const Profile = () => {


	const fetchType: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/users/profile/auth`,
			option: {
				method: "GET",
			},
		},
		auth: useFetchAuth(),
	}
	console.log(fetchType)


	useEffect(() => {
		const {response, data} = FetchApi(fetchType)
		return undefined
	}, [])

	return <>
			<Grid item xs={5}
				sx={{
					position: 'relative',
					top: '3rem',
					height: '12rem',
					p: '1vw;',
					border: 1,
					display: 'grid',
					'@media (max-width: 1000px)': {
						height: '14rem',
						alignItems: 'center',
						justifyContent: 'center'
					},
				}
			}>
				<ProfileAvatar />
			</Grid>
			<Grid item xs={7}
				sx={{
					position: 'relative',
					top: '3rem',
					height: '12rem',
					py: '1vw;',
					px: '2vw;',
					border: 1,
					'@media (max-width: 1000px)': {
						height: '14rem',
					},
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
	</>
}
export default Profile;
