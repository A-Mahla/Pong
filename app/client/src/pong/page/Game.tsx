import * as React from 'react'
import { Typography, Box, Paper } from '@mui/material'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Button from "@mui/material/Button";
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

const pongTitle = {
	fontSize: '2vw;',
}

/* ---------------- ^^^^ ---------------*/

/* ---------------- type definition for matchmaking fetch informations --------- */

type PlayerPayload = {
	id: number,
	login: string
}

/* ---------------- ^^^^ ---------------*/

function JoinQueuButton({socket, setJoinQueu, joinQueu}: any): any {
	const {user, id} = useAuth();

	const playerPayload: PlayerPayload = {
		id: id,
		login: user
	}

	const matchMaking = () => {
		socket.emit("automatikMatchMaking", playerPayload);
	}
	const handleClick = () => {
		if (!joinQueu)
		{
			matchMaking();
			setJoinQueu(true);
		}
	}
	return (<>
		{
			!joinQueu ? (<>

					<Button onClick={handleClick}>
							JOIN QUEU
					</Button>

			</>) : (
			<>
					<Button>
							WAITING FOR A MATCH
					</Button>
			</>
			)
		}
	</>)

}


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
						anchorPosition={{ top: '50%', left: '50%' }}
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
