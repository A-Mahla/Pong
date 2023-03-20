import Avatar from '@mui/material/Avatar';
import { Typography, Grid, Button, IconButton } from '@mui/material';
import useAuth from '/src/pong/context/useAuth';
import { FetchApi, Api, originalRequest } from '/src/pong/component/FetchApi'
import React, { createRef, useState } from "react";
import axios from 'axios';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

//const UploadIcon = styled(MuiCloudUpload)(spacing);
//const DeleteIcon = styled(MuiDelete)(spacing);



//src="http://localhost:5500/api/users/default/default_avatar"

type AvatarProps = {
	image: URL,
	setImage: React.Dispatch<React.SetStateAction<URL>>,
}

const ProfileAvatar = (props: AvatarProps) => {

	const inputFileRef = createRef(null);

	const {token} = useAuth()

	const cleanup = () => {
		URL.revokeObjectURL(props.image);
		inputFileRef.current.value = null;
	};


	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

		const newImage = e.target?.files?.[0];

		if (newImage) {

			if (props.image) {
				cleanup();
			}

			const file = new FormData();
			file.append("file", newImage)

			try {

				const result = await axios.post(

					`http://${import.meta.env.VITE_SITE}/api/users/profile/avatar/upload`,
					file,
					{ 
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': "multipart/form-data"
						}
					}
				)

				if (result.status !== 201 && result.status !== 304) {

					const refresh = await originalRequest()

					if (refresh.response.status !== 200 && refresh.response.status !== 304) {
						fetchType.auth.setToken('');
						fetchType.auth.setUser('');
						fetchType.auth.setId(0);
						fetchType.auth.setIntraLogin('');
						useNavigate()('/login');
						return
					}
					
					fetchType.auth.setToken(refresh.data['aT']);

					const result2 = await axios.post(

						`http://${import.meta.env.VITE_SITE}/api/users/profile/avatar/upload`,
						file,
						{ 
							withCredentials: true,
							headers: {
								Authorization: `Bearer ${refresh.data['aT']}`,
								'Content-Type': "multipart/form-data"
							}
						}
					)

					await props.setImage(URL.createObjectURL(newImage));

				} else {

					await props.setImage(URL.createObjectURL(newImage));

				}
			} catch(err) {
				console.log(err)
			}




			}

			//			props.setImage(URL.createObjectURL(newImage));
		}


	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (props.image) {
			event.preventDefault();
			props.setImage(null);
		}
	};

	return (
		<>
		<Grid container
			sx={{
				width: '10rem',
				height: '9rem',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
		<input
			ref={inputFileRef}
			accept="image/*"
			id="avatar-image-upload"
			type="file"
			onChange={handleChange}
			hidden
		/>
		<label htmlFor="avatar-image-upload">
			<IconButton component="span">
				<Avatar
					variant="inherit"
					alt="avatar"
					src={props.image}
					sx={{
						display: 'flex',
						p: 0,
						border: 1,
						boxShadow: 24,
						width: '8rem',
						height: '8rem',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				/>
			</IconButton>
		</label>
		<IconButton
			component="span"
			variant="inherit"
			size='small'
			sx={{
				position: 'relative',
				bottom: 35,
				right: 65,
				"&:hover": { boxShadow: 'none', }
			}}
			onClick={handleClick}
		>
			{props.image ? <DeleteOutlineIcon/> : null}
		</IconButton>
		</Grid>
		</>
	)
}

const NameAvatar = () => {

	const {user} = useAuth()
	
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
			{user}
		</Typography>
	)
}

const AvatarGrid = (props: AvatarProps) => {

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
			<ProfileAvatar image={props.image} setImage={props.setImage} />
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
