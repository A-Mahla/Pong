import {
	Divider,
	Box,
	Button,
	FormControl,
	Grid,
	TextField,
	Typography,
	IconButton,
	Avatar,
} from '@mui/material';
import React, {
	useRef,
	useEffect,
	useState,
	createRef,
} from 'react'
import useAuth, {useFetchAuth} from '/src/pong/context/useAuth';
import { FetchApi, Api, refreshRequest } from '/src/pong/component/FetchApi'
import axios from 'axios';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function isNumberOrString(str) {
	return /^([0-9a-zA-Z_]){3,20}$/.test(str);
}

function isPassword(str) {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(str);
}


const SignUp = () => {

	const {navigate, token} = useAuth();
	const authFetching = useFetchAuth()

	const [error, setError] = useState('');
	const [loginError, setLoginError] = useState('');

	const [file, setFile] = useState<any>(null);
	const [image, setImage] = useState<URL>(null);

	const inputFileRef = createRef(null);

	const login = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;
	const password = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;
	const passwordConfirm = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;

	const cleanup = () => {
		URL.revokeObjectURL(image);
		inputFileRef.current.value = null;
	};

	const handleChange = (e: React.ChangeEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setError('')
		setLoginError('')
	}

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()

		await setFile(e.target?.files?.[0])

		if (e.target?.files?.[0]) {

			if (image) {
				cleanup();
			}
			await setImage(URL.createObjectURL(e.target?.files?.[0]));
		}
	}

	const handleAvatarDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (image) {
			event.preventDefault();
			setImage(null);
		}
	};

	const handleHome = (event: React.SyntheticEvent) => {
		event.preventDefault()
		navigate('/')
	};

	const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		if (login.current.value === '') {
			setLoginError("Invalid login");
			return
		} else if (login.current.value.length < 3
			|| login.current.value.length > 20) {
			setLoginError('Login must contain at least between 3 and 20 characters')
			return
		} else if (!isNumberOrString(login.current.value)) {
			setLoginError('Login must contain just letters, numbers or underscores')
			return
		} else if (password.current.value === '' || passwordConfirm.current.value === '') {
			setError("Invalid Passwords");
			return
		} else if ( password.current.value !== passwordConfirm.current.value ) {
			setError('Passwords are different')
			return
		} else if ( password.current.value.length < 8
			|| password.current.value.length > 72 ) {
			setError('Password must contain at least between 8 and 72 characters')
			return
		} else if (!isPassword(password.current.value)) {
			setError('Password must contain at least one uppercase, one lowercase, one number and one special character')
			return
		}

		await setLoginError(await authSignup(username.current.value, password.current.value))
	}

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


		<Grid container justifyContent="center" sx={{height: 600, pt: 15}}>
			<FormControl>

				<Box display="flex" justifyContent="center" alignItems="center"
					sx={{mb: 4}}
				>
				<Grid container
					sx={{
						width: '11rem',
						height: '11rem',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
				<input
					ref={inputFileRef}
					accept="image/*"
					id="avatar-image-upload"
					type="file"
					onChange={handleAvatarChange}
					hidden
				/>
				<label htmlFor="avatar-image-upload">
					<IconButton component="span">
						<Avatar
							variant="inherit"
							alt="avatar"
							src={image}
							sx={{
								display: 'flex',
								p: 0,
								border: 1,
								boxShadow: 24,
								width: '11rem',
								height: '11rem',
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
						right: 80,
						"&:hover": { boxShadow: 'none', }
					}}
					onClick={handleAvatarDelete}
				>
					{image ? <DeleteOutlineIcon/> : null}
				</IconButton>
				</Grid>
				</Box>

				<TextField
					required
					type='text'
					inputRef={login}
					label="Login / Username"
					onChange={handleChange}
					sx={{mb: 3}}
					helperText={ loginError === '' ?
						null :
						<Typography variant='caption' align="center" color="tomato"
							sx={{
								fontFamily: '"system-ui", sans-serif',
								fontSize: [9, '!important']
							}}
						>
							{loginError}
						</Typography>
					}
				></TextField>

				<TextField
					required
					type='text'
					id="outlined-password-input"
					inputRef={password}
					label="Password"
					onChange={handleChange}
					inputProps={{
						style: {
							fontFamily: '"system-ui", sans-serif'
						}
					}}
					sx={{mb: 1}}
				></TextField>

				<TextField
					required
					type='text'
					id="outlined-password-input"
					inputRef={passwordConfirm}
					label="Confirm Password"
					onChange={handleChange}
					inputProps={{
						style: {
							fontFamily: '"system-ui", sans-serif'
						}
					}}
					sx={{ mb: 3}}
					helperText={ error === '' ?
						null :
						<Typography variant='caption' align="center" color="tomato"
							sx={{
								fontFamily: '"system-ui", sans-serif',
								fontSize: [9, '!important']
							}}
						>
							{error}
						</Typography>
					}
				></TextField>

				<Button sx={{color: 'primary.main'}} onClick={handleSignup}>
					signup
				</Button>

			</FormControl>
		</Grid>
	</>
}
export default SignUp; 
