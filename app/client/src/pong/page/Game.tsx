import * as React from 'react'
import { Typography, Box, Paper, Divider } from '@mui/material'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import PropTypes from 'prop-types';
import useAuth from '../context/useAuth'
import io, {Socket} from "socket.io-client";
import './game.css'
import { render } from 'react-dom'
import Canvas from '../component/gameCanva'
import { draw } from '../component/gameCanva'
import { GameSocketProvider, UserContext } from '../services/GameSocketProvider'
import { Spectator } from '../component/Spectator'
import Popover from '@mui/material/Popover';
import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Checkbox, Radio, FormControlLabel, FormGroup } from '@mui/material';
import { styled } from '@mui/system';
import {useEffect} from 'react'

const pongTitle = {
	fontSize: '2vw;',
}

/* ---------------- ^^^^ ---------------*/

/* ---------------- type definition for matchmaking fetch informations --------- */

type PlayerPayload = {
	id: number,
	login: string
	config?:{
		ballSpeed: '5' | '7' | '10',
		paddleSize: '100' | '70' | '50',
		duration: '1875' | '3750' | '7500'

	}
}

/* ---------------- ^^^^ ---------------*/

type JoinProps = {
	socket: Socket,
	joinQueu: boolean,
	openMatchmaking: boolean,
	setJoinQueu: React.Dispatch<React.SetStateAction<boolean>>,
	setOpenMatchmaking: React.Dispatch<React.SetStateAction<boolean>>,
}

const checkedSx = {
	fontSize: '0.8rem',
}

function JoinQueuButton({socket, joinQueu, openMatchmaking, setOpenMatchmaking, setJoinQueu}: JoinProps) {

  const {user, id} = useAuth();

  const playerPayload: PlayerPayload = {
    id: id,
    login: user,
	config: {
		ballSpeed: "7",
		paddleSize: "100",
		duration:"3750"
	}
  }

  const [open, setOpen] = useState(false);
  const [paddle, setPaddle] = useState<string>('easy');
  const [duration, setDuration] = useState<string>('medium');
  const [speed, setSpeed] = useState<string>('medium');

  const handlePaddleSizeLevel = (event: any) => {
    setPaddle(event.target.value);
	if (playerPayload.config) {
		if (paddle === 'easy'){
			playerPayload.config.paddleSize = '100';
		}
		if (paddle === 'medium')
			playerPayload.config.paddleSize = '70';
		if (paddle === 'hard')
			playerPayload.config.paddleSize = '50';
	}
  };


  const handleBallSpeedLevel = (event: any) => {
    setSpeed(event.target.value);
	if (playerPayload.config) {
		if (speed === 'easy')
			playerPayload.config.ballSpeed = '5';
		if (speed === 'medium')
			playerPayload.config.ballSpeed = '7';
		if (speed === 'hard')
		{
			playerPayload.config.ballSpeed = '10';
		}
	}


  };
  const handleDuration = (event: any) => {
    setDuration(event.target.value);
	if (playerPayload.config) {
		if (speed === 'easy')
			playerPayload.config.duration = '1875';
		if (speed === 'medium')
			playerPayload.config.duration = '3750';
		if (speed === 'hard')
		{
			playerPayload.config.duration = '7500';
		}
	}
  };



  const matchMaking = () => {
    socket.emit("automatikMatchMaking", playerPayload);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpenMatchmaking(false);
  }

  const handleJoinClick = () => {
    matchMaking();
    setJoinQueu(true);
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
											checked={speed === 'easy'}
											onChange={handleBallSpeedLevel}
											value="easy"
										/>
									}
									label="Easy"
										style={{ marginRight: '16px' }}
								/>
								<FormControlLabel
								control={
										<Radio
											checked={speed === 'medium'}
											onChange={handleBallSpeedLevel}
											value="medium"
										/>
									}
									label="Medium"
									style={{ marginRight: '16px' }}
								/>
								<FormControlLabel
									control={
										<Radio
											checked={speed === 'hard'}
											onChange={handleBallSpeedLevel}
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
											checked={paddle === 'easy'}
											onChange={handlePaddleSizeLevel}
											value="easy"
										/>
									}
									label="Easy"
									style={{ marginRight: '16px' }}
								/>
								<FormControlLabel
									control={
										<Radio
											checked={paddle === 'medium'}
											onChange={handlePaddleSizeLevel}
											value="medium"
										/>
									}
									label="Medium"
									style={{ marginRight: '16px' }}
								/>
								<FormControlLabel
									control={
										<Radio
											checked={paddle === 'hard'}
											onChange={handlePaddleSizeLevel}
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
											checked={duration === 'easy'}
											onChange={handleDuration}
											value="easy"
										/>
									}
									label="0:30m"
									style={{ marginRight: '16px' }}
								/>
								<FormControlLabel
									control={
										<Radio
											checked={duration === 'medium'}
											onChange={handleDuration}
											value="medium"
										/>
									}
									label="1:00m"
									style={{ marginRight: '16px' }}
								/>
								<FormControlLabel
									control={
										<Radio
											checked={duration === 'hard'}
											onChange={handleDuration}
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

type MatchProps = {
	socket: Socket,
	openMatchmaking: boolean,
	thereIsMatch: boolean,
	setOpenMatchmaking: React.Dispatch<React.SetStateAction<boolean>>,
	launchCanvas: () => void,
}

function MatchMaker ({socket, openMatchmaking, thereIsMatch, setOpenMatchmaking, launchCanvas} : MatchProps){

	const [joinQueu, setJoinQueu] = useState(false);

	socket.on("lockAndLoaded", () => {
		launchCanvas();
	})

	return <JoinQueuButton
		socket={socket}
		joinQueu={joinQueu}
		openMatchmaking={openMatchmaking}
		setJoinQueu={setJoinQueu}
		setOpenMatchmaking={setOpenMatchmaking}
	/>
  }


interface PlayersListItemProps {
	isActive: boolean;
	justify: string,
}

const PlayersListWrapper = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	padding: '8px',
	boxSizing: 'border-box',
	height: '100%',
	overflowY: 'auto',
});

const PlayersListItem = styled('div')<PlayersListItemProps>(({ isActive, justify }) => ({
	display: 'flex',
	alignItems: 'center',
	height: '33%',
	margin: '4px',
	padding: '0 16px',
	borderRadius: '8px',
	cursor: 'pointer',
	backgroundColor: isActive ? '#EDEDED' : 'transparent',
	color: isActive ? "#427094" : '#213547',
	'&:hover': {
		backgroundColor: '#EDEDED',
		color: "#427094",
	},
	justifyContent: justify
}));

const PlayersListItemText = styled('div')(() => ({
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	fontFamily: 'pong-policy',
	fontSize: '5rem',
	fontWeight: '600',
}));

type Row = {
	name: string,
	id: number
}

// Main Game page, rendering either matchmaking page or Canvas if therIsMatch == true
export const Game = ({ height, width }: any) => {

	const socket = React.useContext(UserContext);
	const [openMatchmaking, setOpenMatchmaking] = useState(false)
	const [openWatch, setOpenWatch] = useState(false)
	const [thereIsMatch, setThereIsMatch] = React.useState(false);
	const [errorPopoverOpen, setErrorPopoverOpen] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState('');
	const [selectedRow, setSelectedRow] = useState<Row | null>(null)
	const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
	const errorButtonRef = React.useRef(null);
	const rows = [
		{
			name: 'Matchmaking',
			id: 0,
		},
		{
			name: 'WatchGame',
			id: 1,
		},
		{
			name: 'game friends',
			id: 2,
		},
	]
	const justify: string[] = [
		'left',
		'center',
		'right',
	]

	useEffect(() => {
		setSelectedRow(null)
	}, [])

	useEffect(() => {
		console.log('test')
		if (selectedRow && selectedRow.id === 0)
			setOpenMatchmaking(true)
		else if (selectedRow && selectedRow.id === 1)
			setOpenWatch(true)
	}, [selectedRow])

	const handleMatchClick = () => {
		if (!thereIsMatch)
			setThereIsMatch(true)
		else
			setThereIsMatch(false)
	}

	const handleMatchmaking = () => {
		setOpenMatchmaking(true)
	}

	const handleOpenErrorPop = (errorMessage: string) => {
		handleMatchClick();
		setErrorMessage(errorMessage);
		setErrorPopoverOpen(true);
	};

	const handleCloseErrorPop = () => {
		setErrorPopoverOpen(false);
		setErrorMessage("");
	};


	return (<>
		{
			thereIsMatch ?
			(<>
				<Grid container
					direction="column"
					justifyContent="center"
					alignItems="center"
					sx={{height: "95%"}}
				>
						<Canvas
							socket={socket}
							handleThereIsMatch={handleMatchClick}
							handleThereIsError={
								(errorStr: string) => {
									handleOpenErrorPop(errorStr)
								}
							}
						/>
				</Grid>
			</>)
			:
			(<>
				<Grid container sx={{height: '100%'}} >
					<PlayersListWrapper>
						{rows.map((row) => (
							<PlayersListItem
								key={row.id}
								isActive={row.id === selectedRowId}
								justify={justify[row.id]}
								onClick={() => setSelectedRow(row)}
							>
								<PlayersListItemText>
									{row.name}
								</PlayersListItemText>
							</PlayersListItem>
						))}
					</PlayersListWrapper>
					<Popover
						open={errorPopoverOpen}
						onClose={handleCloseErrorPop}
						anchorReference="none"
						anchorPosition={{ top: parseInt('50%'), left: parseInt('50%') }}
						transformOrigin={{
							vertical: 'center',
							horizontal: 'center',
						}}
					>
						<Box sx={{ p: 2 }}>
							<Typography>{errorMessage}</Typography>
						</Box>
					</Popover>
					</Grid>
				<MatchMaker
					socket={socket}
					openMatchmaking={openMatchmaking}
					setOpenMatchmaking={setOpenMatchmaking}
					thereIsMatch={thereIsMatch}
					launchCanvas={handleMatchClick}
				/>
				<Spectator
					socket={socket}
					openWatch={openWatch}
					setOpenWatch={setOpenWatch}
					thereIsMatch={thereIsMatch}
					handleThereIsMatch={handleMatchClick}
				/>
			</>)
		}</>)
	};

	export const GamePage = () => {
		return (
			<GameSocketProvider>
				<Game/>
			</GameSocketProvider>
		)
	}
	export default GamePage;
