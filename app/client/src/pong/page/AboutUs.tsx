import { Typography, Box, Grid, Avatar, Divider } from '@mui/material'
import useAuth from '../context/useAuth';

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
						alt="sacha"
						src="/public/slahlou.JPG"
						sx={avatarSx}
					/>
				</Grid>
				<Grid item xs={4} display="flex" justifyContent="center">
					<Avatar
						alt="augustin"
						src="/public/alorain.jpeg"
						sx={avatarSx}
					/>
				</Grid>
				<Grid item xs={4} display="flex" justifyContent="center">
					<Avatar
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

/* About us Text : 
 * "Welcome to the Mighty Pong Contest website! Our mission, Sacha Lahlou, Augustin Lorain, and Amir Mahla, all students at 42 school in Paris, is to bring you an exciting online gaming experience with real-time multiplayer games and a friendly community of players.

Our website is designed with the latest technology, ensuring a smooth and enjoyable user experience. The backend of the site is powered by NestJS, while the frontend is written with a TypeScript framework of our choice. We utilize a PostgreSQL database, and all passwords stored on our site are hashed for security purposes.

To create an account on our site, users must log in through the OAuth system of 42 intranet. Once logged in, they can choose a unique name, upload an avatar, and even enable two-factor authentication for added security.

In addition to playing Pong with other players, our site features a chat system that allows users to create channels, send direct messages, and even invite others to play games through the chat interface. The chat system also allows users to block other players and access their profiles.

Our Pong game is designed to be faithful to the original 1972 version, with the option for customization such as power-ups and different maps. Users can also select a default version without any extra features. We have a matchmaking system in place so that users can join a queue and be automatically matched with another player.

We take security very seriously on our website and ensure that all user input is validated on the server side to protect against SQL injections. We also maintain user stats, such as wins and losses, ladder level, and achievements, which are displayed on their profile for other users to see.

You can contact us through the form on our website. We are excited to bring you the Mighty Pong Contest website and hope you enjoy your gaming experience with us. Thank you for visiting, and we look forward to seeing you on the leaderboards!"*/
