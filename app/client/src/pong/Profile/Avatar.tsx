import Avatar from '@mui/material/Avatar';

//src="http://localhost:5500/api/users/default/default_avatar"

const ProfileAvatar = () => {

	return (
		<Avatar
			alt="avatar"
			src=""
			sx={{
				width: '10rem;',
				height: '10rem',
				border: 1,
				boxShadow: 24,
				'@media (max-width: 350px)': {
					position: 'absolute',
					mt: 0,
					mr: '10vw;',
					width: '4rem',
					height: '4rem',
				},
				'@media (min-width: 350px) and (max-width: 470px)': {
					width: '4rem',
					height: '4rem',
					mt: -10
				},
				'@media (min-width:470px) and (max-width: 600px)': {
					width: '6rem',
					height: '6rem',
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
	)
}
export default ProfileAvatar;
