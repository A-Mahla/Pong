import { Box, Grid } from '@mui/material'
import './LeadPage.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFF00',
    },
    secondary: {
      main: '#FF00FF',
    },
  },
});


const Profile = () => {
	return <>
		<ThemeProvider theme={theme}>
			<Grid item xs={5}
				sx={{
					position: 'relative',
					top: '3rem',
					height: '12rem',
					p: '1vw;',
					border: 1
				}
			}>
			</Grid>
			<Grid item xs={7}
				sx={{
					position: 'relative',
					top: '3rem',
					height: '12rem',
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
		</ ThemeProvider>
	</>
}
export default Profile;
