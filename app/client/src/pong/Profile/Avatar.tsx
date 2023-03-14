import Avatar from '@mui/material/Avatar';
import { Typography, Grid } from '@mui/material';

//src="http://localhost:5500/api/users/default/default_avatar"

const ProfileAvatar = () => {

	return (
		<Avatar
			alt="avatar"
			src=""
			sx={{
				p: 0,
				border: 1,
				boxShadow: 24,
				'@media (max-width: 550px)': {
					width: '7rem',
					height: '7rem',
				},
				'@media (min-width:550px) and (max-width: 950px)': {
					width: '6rem',
					height: '6rem',
				},
				'@media (min-width: 950px)': {
					width: '8rem',
					height: '8rem',
				},
				AlignItems: 'center'
			}}
		/>
	)
}

const NameAvatar = () => {
	
	return (
		<Typography noWrap 
			fontSize={{
				xl: '2rem',
				lg: '1.5rem',
				md: '1.3rem',
				mmd: '1.2rem',
				sm: '1rem',
				xs: '1.5rem'
			}}
		>
			Loginsuperlong
		</Typography>
	)
}

const AvatarGrid = () => {

	return <>
		<Grid item xl={5} md={6} xs={12}
			sx={{
				p: '1vw;',
				border: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}
		}>
			<ProfileAvatar />
		</Grid>
		<Grid item xl={7} md={6} xs={12}
			sx={{
				p: '1vw;',
				border: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<NameAvatar />
		</Grid>
	</>

}

export default AvatarGrid;
