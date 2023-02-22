import Avatar from '@mui/material/Avatar';

const ProfileAvatar = () => {

	return <Avatar
		alt="test"
		src="http://localhost:5500/api/users/default/default_avatar"
	sx={{
		width: '10rem;',
		height: '10rem',
		border: 1,
		boxShadow: 24,
		'@media (max-width: 600px)': {
			width: '7rem',
			height: '7rem',
			mt: -10
		},
		'@media (min-width: 600px) and (max-width: 1000px)': {
			mt: -5
		},
		'@media (min-width: 1000px) and (max-width: 1200px)': {
			ml: '4vw;',
		},
		'@media (min-width: 1200px)': {
			ml: '6vw;',
		},
		AlignItems: 'center'
	}}
	/>
}
export default ProfileAvatar;
