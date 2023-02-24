import { Box, Grid } from '@mui/material'
import '/src/pong/LeadPage.css'
//import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProfileAvatar from './Avatar'


const Profile = () => {

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
