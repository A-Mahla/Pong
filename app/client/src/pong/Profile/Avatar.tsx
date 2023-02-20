import Avatar from '@mui/material/Avatar';

const ProfileAvatar = () => {

	return <Avatar
		alt="test"
		src="http://localhost:5500/api/users/default/default_avatar"
	sx={{
		width: '10rem;',
		height: '10rem',
		border: 1,
		boxShadow: 20,
		'@media (max-width: 1000px)': {
			width: '15vw;',
			height: '15vw;',
			mt: -3
		},
		'@media (min-width: 1000px)': {
			ml: '2vw;',
		},
		AlignItems: 'center'
	}}
	/>
}
export default ProfileAvatar;
