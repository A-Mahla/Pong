import { Typography, Box, Grid, Avatar, Divider } from '@mui/material'
import useAuth from '/src/pong/context/useAuth';

const avatarSx = {
	width: '17rem',
	height: '17rem',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
}

const AboutUs = () => {

	const {navigate} = useAuth();

	const handleHome = (event: React.SyntheticEvent) => {
		event.preventDefault()
		navigate('/')
	};

	return <>
		<Box sx={{my: 'auto'}}>
			<Box sx={{width: '6.5rem'}}>
			<Typography
				className="homeButton"
				variant='h4'
				onClick={handleHome}
			>
				Pong
			</Typography>
			</Box>
		</Box>
		<Divider variant='middle'/>
		<Grid container justifyContent="center" sx={{height: 600, pt: 5, px: '13rem'}}>
			<Grid container display="flex" justifyContent="center" alignItems="center">
				<Typography variant="h3">
					Let me tell you about us...
				</Typography>
			</Grid>
			<Grid item display="flex" xs={12}>
				<Grid item xs={4} display="flex" justifyContent="center">
					<Avatar
						variant="inherit"
						alt="sacha"
						src="/public/slahlou.JPG"
						sx={avatarSx}
					/>
				</Grid>
				<Grid item xs={4} display="flex" justifyContent="center">
					<Avatar
						variant="inherit"
						alt="augustin"
						src="/public/alorain.jpeg"
						sx={avatarSx}
					/>
				</Grid>
				<Grid item xs={4} display="flex" justifyContent="center">
					<Avatar
						variant="inherit"
						alt="amir"
						src="/public/amahla.JPG"
						sx={avatarSx}
					/>
				</Grid>
			</Grid>
		</Grid>	
		</>
}

export default AboutUs;
