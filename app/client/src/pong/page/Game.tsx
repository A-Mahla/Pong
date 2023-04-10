import * as React from 'react'
import { Typography, Box, Paper } from '@mui/material'
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
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
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

function JoinQueuButton({socket, joinQueu, openMatchmaking, setOpenMatchmaking, setJoinQueu}: any) {

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
						minHeight: '10rem'
					}
				}}
			>
				<DialogTitle>Configure your game</DialogTitle>
				<DialogContent>
					<FormGroup style={{ display: 'flex'}}>
						<div>
							<DialogTitle>ball speed</DialogTitle>
								<FormControlLabel
									control={
										<Checkbox
											checked={speed === 'easy'}
											onChange={handleBallSpeedLevel}
											value="easy"
											sx={{
												justifyContent: 'right'
											}}
										/>
									}
									label="Easy"
									style={{ marginRight: '16px' }}
							/>
							<FormControlLabel
							control={
									<Checkbox
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
									<Checkbox
										checked={speed === 'hard'}
										onChange={handleBallSpeedLevel}
										value="hard"
									/>
								}
								label="Hard"
							/>
						</div>
						<div>
							<DialogTitle>paddle size</DialogTitle>
							<FormControlLabel
								control={
									<Checkbox
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
									<Checkbox
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
									<Checkbox
										checked={paddle === 'hard'}
										onChange={handlePaddleSizeLevel}
										value="hard"
									/>
								}
								label="Hard"
							/>
						</div>
						<div>
							<DialogTitle>Duration</DialogTitle>
							<FormControlLabel
								control={
									<Checkbox
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
									<Checkbox
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
									<Checkbox
										checked={duration === 'hard'}
										onChange={handleDuration}
										value="hard"
									/>
								}
								label="2:00m"
							/>
						</div>
					</FormGroup>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>
						Cancel
					</Button>
					<Button onClick={handleJoinClick}>
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
	launchCanvas: any,
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
	mx: '32px',
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
			name: 'Invite friends',
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
		if (selectedRow && selectedRow.id === 0)
			setOpenMatchmaking(true)
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

//	<Spectator socket={socket} thereIsMatch={thereIsMatch} handleThereIsMatch={handleClick}/>

	return (<>
		{
			thereIsMatch ?
			(<>
				<Grid container justifyContent="space-between" alignItems="flex-start">
					<Typography sx={pongTitle} variant='h2'>Game</Typography>
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
