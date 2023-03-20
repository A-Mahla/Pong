import Avatar from '@mui/material/Avatar';
import { Typography, Grid, Button, IconButton } from '@mui/material';
import useAuth from '/src/pong/context/useAuth';
import React, { createRef, useState } from "react";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import styled from "styled-components";

//const UploadIcon = styled(MuiCloudUpload)(spacing);
//const DeleteIcon = styled(MuiDelete)(spacing);



//src="http://localhost:5500/api/users/default/default_avatar"

type AvatarProps = {
	image: URL,
	setImage: React.Dispatch<React.SetStateAction<URL>>,
}

const ProfileAvatar = (props: AvatarProps) => {

	const inputFileRef = createRef(null);


	const handleClick = (event) => {
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
		<input accept="image/*" id="upload-avatar-pic" type="file" hidden />
		<label htmlFor="upload-avatar-pic">
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
			component="block"
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
