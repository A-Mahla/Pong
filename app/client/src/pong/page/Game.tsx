import * as React from 'react'
import { Typography, Box, Paper } from '@mui/material'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import PropTypes from 'prop-types';
import useAuth from '../context/useAuth'
import io from "socket.io-client";
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

function JoinQueuButton({socket, setJoinQueu, joinQueu}: any) {
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
		if (paddle === 'easy')
			playerPayload.config.paddleSize = '100';
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
			playerPayload.config.ballSpeed = '10';
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
			playerPayload.config.duration = '7500';
	}
  };



  const matchMaking = () => {
    socket.emit("automatikMatchMaking", playerPayload);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleJoinClick = () => {
    matchMaking();
    setJoinQueu(true);
    handleClose();
  }

  return (
    <>
      {!joinQueu ? (
        <Button onClick={handleOpen}>
          JOIN QUEU
        </Button>
      ) : (
        <Button>
          WAITING FOR A MATCH
        </Button>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Configure your game</DialogTitle>
        <DialogContent>
  <FormGroup style={{ display: 'flex' }}>
    <div>
      <DialogTitle>ball speed</DialogTitle>
      <FormControlLabel
        control={<Checkbox checked={speed === 'easy'} onChange={handleBallSpeedLevel} value="easy" />}
        label="Easy"
        style={{ marginRight: '16px' }}
      />
      <FormControlLabel
        control={<Checkbox checked={speed === 'medium'} onChange={handleBallSpeedLevel} value="medium" />}
        label="Medium"
        style={{ marginRight: '16px' }}
      />
      <FormControlLabel
        control={<Checkbox checked={speed === 'hard'} onChange={handleBallSpeedLevel} value="hard" />}
        label="Hard"
      />
    </div>
    <div>
      <DialogTitle>paddle size</DialogTitle>
      <FormControlLabel
        control={<Checkbox checked={paddle === 'easy'} onChange={handlePaddleSizeLevel} value="easy" />}
        label="Easy"
        style={{ marginRight: '16px' }}
      />
      <FormControlLabel
        control={<Checkbox checked={paddle === 'medium'} onChange={handlePaddleSizeLevel} value="medium" />}
        label="Medium"
        style={{ marginRight: '16px' }}
      />
      <FormControlLabel
        control={<Checkbox checked={paddle === 'hard'} onChange={handlePaddleSizeLevel} value="hard" />}
        label="Hard"
      />
    </div>
    <div>
      <DialogTitle>Duration</DialogTitle>
      <FormControlLabel
        control={<Checkbox checked={duration === 'easy'} onChange={handleDuration} value="easy" />}
        label="0:30m"
        style={{ marginRight: '16px' }}
      />
      <FormControlLabel
        control={<Checkbox checked={duration === 'medium'} onChange={handleDuration} value="medium" />}
        label="1:00m"
        style={{ marginRight: '16px' }}
      />
      <FormControlLabel
        control={<Checkbox checked={duration === 'hard'} onChange={handleDuration} value="hard" />}
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


// function JoinQueuButton({socket, setJoinQueu, joinQueu}: any): any {
// 	const {user, id} = useAuth();

// 	const playerPayload: PlayerPayload = {
// 		id: id,
// 		login: user
// 	}

// 	const matchMaking = () => {
// 		socket.emit("automatikMatchMaking", playerPayload);
// 	}
// 	const handleClick = () => {
// 		if (!joinQueu)
// 		{
// 			matchMaking();
// 			setJoinQueu(true);
// 		}
// 	}
// 	return (<>
// 		{
// 			!joinQueu ? (<>

// 					<Button onClick={handleClick}>
// 							JOIN QUEU
// 					</Button>

// 			</>) : (
// 			<>
// 					<Button>
// 							WAITING FOR A MATCH
// 					</Button>
// 			</>
// 			)
// 		}
// 	</>)
// }


function MatchMaker ({socket, thereIsMatch, launchCanvas} : any){

	const [joinQueu, setJoinQueu] = React.useState(false);

	socket.on("lockAndLoaded", () => {
	  launchCanvas();
	})

	return (
	  <>
		<Grid container spacing={2}>
		  <Grid item xs={12} sm={6}>
			<JoinQueuButton socket={socket} setJoinQueu={setJoinQueu} joinQueu={joinQueu} />
		  </Grid>
		</Grid>
	  </>
	);
  }

// Main Game page, rendering either matchmaking page or Canvas if therIsMatch == true
export const Game = ({ height, width }: any) => {

	const socket = React.useContext(UserContext);
	const [thereIsMatch, setThereIsMatch] = React.useState(false);
	const [errorPopoverOpen, setErrorPopoverOpen] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState('');
	const errorButtonRef = React.useRef(null);

	const handleClick = () => {
		if (!thereIsMatch)
			setThereIsMatch(true)
		else
			setThereIsMatch(false)
	}

	const handleOpenErrorPop = (errorMessage: string) => {
		handleClick();
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
				<Grid container justifyContent="space-between" alignItems="flex-start">
					<Typography sx={pongTitle} variant='h2'>Game</Typography>
						<Canvas socket={socket} handleThereIsMatch={handleClick} handleThereIsError={(errorStr: string) => { handleOpenErrorPop(errorStr) }}/>
				</Grid>
			</>)
			:
			(<>
				<Grid container justifyContent="space-between" alignItems="flex-start">
					<Grid item xs={12} sm={4}>
						<Grid container justifyContent="flex-start" alignItems="center">
							<Grid item>
								<Typography sx={pongTitle} variant='h2'>Matchmaking</Typography>
							</Grid>
							<MatchMaker socket={socket} thereIsMatch={thereIsMatch} launchCanvas={handleClick} />
						</Grid>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Typography sx={pongTitle} variant='h2'>Invite friend</Typography>
						{/* Ajoutez ici le contenu pour "Invite friend" */}
					</Grid>
					<Grid item xs={12} sm={4}>
						<Typography sx={pongTitle} variant='h2'>Watch game</Typography>
							<Spectator socket={socket} thereIsMatch={thereIsMatch} handleThereIsMatch={handleClick}/>
						{/* Ajoutez ici le contenu pour "Watch game" */}
					</Grid>
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
