import * as React from 'react'
import { Typography, Box, Divider } from '@mui/material'
import Grid from '@mui/material/Grid'
import useAuth from '../context/useAuth'
import './game.css'
import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Radio, FormControlLabel, FormGroup } from '@mui/material';

type CreateMatchProps = {
	player2: string,
	openMatchmaking: boolean,
	setOpenMatchmaking: React.Dispatch<React.SetStateAction<boolean>>,
}

type PlayerPayload = {
	id: number,
	player1: string,
	player2: string,
	config?:{
		ballSpeed: '7' | '10' | '12',
		paddleSize: '100' | '70' | '50',
		duration: '1875' | '3750' | '7500'

	}
}

function JoinQueuButton({player2, openMatchmaking, setOpenMatchmaking}: CreateMatchProps) {

	const {user, id} = useAuth();
	const [playerPayload, setPlayerPayload] = useState<PlayerPayload>({
		id: id,
		player1: user,
		player2: player2,
		config: {
			ballSpeed: '7',
			paddleSize: '100',
			duration:'3750'
		}
	})

  const handlePaddleSizeLevel = (event: any) => {
	if (playerPayload.config) {
		if (event.target.value === "easy"){
			setPlayerPayload({...playerPayload,
				config: {
					...playerPayload.config,
					paddleSize: '50'
				}})
		}
		else if (event.target.value === 'medium'){
			setPlayerPayload({...playerPayload,
				config: {
					...playerPayload.config,
					paddleSize: '70'
				}})
		}
		else if (event.target.value === 'hard'){
			setPlayerPayload({...playerPayload,
				config: {
					...playerPayload.config,
					paddleSize: '50'
				}})
		}
	}
  };


	const handleBallSpeedLevel = (event: any) => {

		if (playerPayload.config) {
			if (event.target.value === "easy"){
				setPlayerPayload({...playerPayload,
					config: {
						...playerPayload.config,
						ballSpeed: '7'
					}})
			}
			else if (event.target.value === 'medium'){
				setPlayerPayload({...playerPayload,
					config: {
						...playerPayload.config,
						ballSpeed: '10'
					}})
			}
			else if (event.target.value === 'hard'){
				setPlayerPayload({...playerPayload,
					config: {
						...playerPayload.config,
						ballSpeed: '12'
					}})
			}
		}
	};

	const handleDuration = (event: any) => {
		if (playerPayload.config) {
			if (event.target.value === "easy"){
				setPlayerPayload({...playerPayload,
					config: {
						...playerPayload.config,
						duration: '1875'
					}})
			}
			else if (event.target.value === 'medium'){
				setPlayerPayload({...playerPayload,
					config: {
						...playerPayload.config,
						duration: '3750'
					}})
			}
			else if (event.target.value === 'hard'){
				setPlayerPayload({...playerPayload,
					config: {
						...playerPayload.config,
						duration: '7500'
					}})
			}
		}
	};

  const handleClose = () => {
    setOpenMatchmaking(false);
  }

  const handleJoinClick = () => {
    handleClose();
  }

	return (
		<>
			<Dialog
				open={openMatchmaking}
				onClose={handleClose}
				fullWidth
				maxWidth="md"
				PaperProps={{
					style: {
						borderRadius: '32px',
						height: '31rem',
						width: '50rem',
						minHeight: '10rem',
					}
				}}
			>
				<DialogTitle>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						sx={{mt: 4, mb: 1}}
					>
						<Typography
							component={'span'}
							variant='h6'
							align="center"
							style={{color: '#213547'}}
						>
							Configure your game
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent>
				<Divider variant="middle"/>
				<Grid container
					sx={{
						height: '95%',
						minHeight: '10rem',
						pl: 7,
						'@media (max-width: 650px)': {
							pl: 0,
						}
					}}
				>

					<Grid item xs={4} sx={{height: '100%'}}>
						<Grid
							sx={{height: '33%'}}
							display="flex"
							alignItems="center"
						>
							<Typography fontSize="1.3rem">ball speed</Typography>
						</Grid>
						<Grid
							sx={{height: '33%'}}
							display="flex"
							alignItems="center"
						>
							<Typography fontSize="1.3rem">paddle size</Typography>
						</Grid>
						<Grid
							sx={{height: '33%'}}
							display="flex"
							alignItems="center"
						>
							<Typography fontSize="1.3rem">duration</Typography>
						</Grid>
					</Grid>

					<Grid item xs={7} sx={{height: '100%'}}>
						<FormGroup style={{ display: 'flex', height: '100%'}}>
							<Grid
								sx={{height: '33%'}}
								display="flex"
								alignItems="center"
								justifyContent="center"
							>
								<FormControlLabel
									control={
										<Radio
											checked={playerPayload.config?.ballSpeed === '7'}
											onClick={handleBallSpeedLevel}
											value="easy"
										/>
									}
									label="Easy"
										style={{ marginRight: '16px' }}
								/>
								<FormControlLabel
								control={
										<Radio
											checked={playerPayload.config?.ballSpeed === '10'}
											onClick={handleBallSpeedLevel}
											value="medium"
										/>
									}
									label="Medium"
									style={{ marginRight: '16px' }}
								/>
								<FormControlLabel
									control={
										<Radio
											checked={playerPayload.config?.ballSpeed === '12'}
											onClick={handleBallSpeedLevel}
											value="hard"
										/>
									}
									label="Hard"
								/>
							</Grid>
							<Grid
								sx={{height: '33%'}}
								display="flex"
								alignItems="center"
								justifyContent="center"
							>
								<FormControlLabel
									control={
										<Radio
											checked={playerPayload.config?.paddleSize === '100'}
											onClick={handlePaddleSizeLevel}
											value="easy"
										/>
									}
									label="Easy"
									style={{ marginRight: '16px' }}
								/>
								<FormControlLabel
									control={
										<Radio
											checked={playerPayload.config?.paddleSize === '70'}
											onClick={handlePaddleSizeLevel}
											value="medium"
										/>
									}
									label="Medium"
									style={{ marginRight: '16px' }}
								/>
								<FormControlLabel
									control={
										<Radio
											checked={playerPayload.config?.paddleSize === '50'}
											onClick={handlePaddleSizeLevel}
											value="hard"
										/>
									}
									label="Hard"
								/>
							</Grid>
							<Grid
								sx={{height: '33%'}}
								display="flex"
								alignItems="center"
								justifyContent="center"
							>
								<FormControlLabel
									control={
										<Radio
											checked={playerPayload.config?.duration === '1875'}
											onClick={handleDuration}
											value="easy"
										/>
									}
									label="0:30m"
									style={{ marginRight: '16px' }}
								/>
								<FormControlLabel
									control={
										<Radio
											checked={playerPayload.config?.duration === '3750'}
											onClick={handleDuration}
											value="medium"
										/>
									}
									label="1:00m"
									style={{ marginRight: '16px' }}
								/>
								<FormControlLabel
									control={
										<Radio
											checked={playerPayload.config?.duration === '7500'}
											onClick={handleDuration}
											value="hard"
										/>
									}
									label="2:00m"
								/>
							</Grid>
						</FormGroup>
					</Grid>
				</Grid>
				<Divider variant="middle"/>
				</DialogContent>
				<DialogActions sx={{pr: 3, pb: 2}}>
					<Button
						variant="contained"
						onClick={handleClose}
						sx={{
							backgroundColor: 'tomato',
							'&:hover': {
								backgroundColor: '#ff9070',
							}
						}}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={handleJoinClick}
						sx={{
							'&:hover': {
								backgroundColor: '#427094',
							}
						}}
					>
						Join
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
