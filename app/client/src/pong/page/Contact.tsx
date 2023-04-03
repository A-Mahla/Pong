import {
	Typography,
	Box,
	Grid,
	Avatar,
	Divider,
	FormControl,
	TextField,
	Button,
} from '@mui/material'
import useAuth from '/src/pong/context/useAuth';
import React, {
	useRef,
	useState,
} from 'react'
import emailjs from "@emailjs/browser";

function isEmail(str) {
	return /^(?=.*@)(?=.*\.)/.test(str);
}

const Contact = () => {

	const [error, setError] = useState('');
	const [textError, setTextError] = useState('');
	const {navigate} = useAuth();
	const email = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;
	const subject = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;
	const text = useRef<HTMLInputElement>(null) as React.MutableRefObject<HTMLInputElement>;
	const form = useRef();

		const handleHome = (event: React.SyntheticEvent) => {
		event.preventDefault();
		navigate('/');
	};

	const handleChange = (e: React.ChangeEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setError('')
		setTextError('')
	}


	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		/*
		if (email.current.value === ''
			|| !isEmail(email.current.value) ) {
				setError("Invalid email");
				return;
			} else if (text.current.value === '') {
				setTextError('Please, complete your request')
				}*/
			emailjs.sendForm("service_vvz12ux", "template_wpxvown", form.current, "FbnVeYr9ksHRLt_Tx").then(
				(result) => {
					console.log(result.text);
				},
				(error) => {
					console.log(error.text);
				}
			);
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
		<Grid container justifyContent="center" sx={{height: 600, pt: 5, px: '13rem'}}>

			<Grid
				container
				display="flex"
				justifyContent="center"
				alignItems="center"
			>
				<Typography
					variant="h4"
				>
					Contact us
				</Typography>
			</Grid>

			<form ref={form}>
			<FormControl>

				<TextField
					type='text'
					label="e-mail"
					name="email"
					onChange={handleChange}
					sx={{mb: 5, width: '20rem'}}
					inputProps={{
						style: {
							fontFamily: '"system-ui", sans-serif'
						}
					}}
					helperText={ error === '' ?
						null :
						<Typography variant='caption' align="center" color="tomato"
							sx={{
								fontFamily: '"system-ui", sans-serif',
								fontSize: [10, '!important']
							}}
						>
							{error}
						</Typography>
					}
				></TextField>

				<TextField
					type='text'
					name="subject"
					label="subject"
					onChange={handleChange}
					sx={{mb: 2, width: '20rem'}}
					inputProps={{
						style: {
							fontFamily: '"system-ui", sans-serif'
						}
					}}
				></TextField>

				<TextField
					type='text'
					name="message"
					label="your request"
					onChange={handleChange}
					sx={{mb: 3, width: '20rem'}}
					multiline
					rows={4}
					inputProps={{
						style: {
							fontFamily: '"system-ui", sans-serif'
						}
					}}
					helperText={ textError === '' ?
						null :
						<Typography variant='caption' align="center" color="tomato"
							sx={{
								fontFamily: '"system-ui", sans-serif',
								fontSize: [10, '!important']
							}}
						>
							{textError}
						</Typography>
					}
				></TextField>


				<Button sx={{color: 'primary.main'}} onClick={handleSubmit}>
					submit
				</Button>

			</FormControl>
			</form>
		</Grid>	
	</>

}
export default Contact;
