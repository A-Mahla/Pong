import * as React from 'react'
import { Typography, Box, Paper } from '@mui/material'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import Swipeable from '/src/pong/component/Swipeable'
import Profile from '/src/pong/Profile/Profile'
import PropTypes from 'prop-types';
import { useFetchAuth } from '/src/pong/context/useAuth'
import { FetchApi, Api, responseApi } from '/src/pong/component/FetchApi'
import useAuth from '/src/pong/context/useAuth'
import io from "socket.io-client";
import './game.css'
import { render } from 'react-dom'
import Canvas from '../component/gameCanva'
import { draw } from '../component/gameCanva'
import { GameSocketProvider, UserContext } from '../services/GameSocketProvider'



/* ---------------- ^^^^ ---------------*/

/* ---------------- type definition for matchmaking fetch informations --------- */

type PlayerPayload = {
	id: string,
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

				<div style={{textAlign: "right"}}>
					<button onClick={handleClick}>
						JOIN QUEU
					</button>
				</div>

			</>) : (
			<>
				<div style={{textAlign: "right"}}>
					QUEU IS JOINED
				</div>
			</>
			)
		}
	</>)

}

function MatchMaker ({socket, thereIsMatch, sendCanvas} : any){

	const [joinQueu, setJoinQueu] = React.useState(false);
	socket.on("lockAndLoaded", () => {
		sendCanvas();
	})

	return (
		<>
		<div style={{display: "flex", justifyContent: "space-between"}}>
		<h2>|  AUTOMATIK MATCHMAKING  |</h2>
			<JoinQueuButton  socket={socket} setJoinQueu={setJoinQueu} joinQueu={joinQueu} />
		</div>
		</>
	)
}

export const GamePage = () => {
	return (
		<GameSocketProvider>
			<Game />
		</GameSocketProvider>
	)
}

// Main Game page, rendering either matchmaking page or Canvas if therIsMatch == true
const Game = () => {

	const socket = React.useContext(UserContext);
	const [thereIsMatch, setThereIsMatch] = React.useState(false);

	const handleClick = () => {
		if (!thereIsMatch)
			setThereIsMatch(true)
		else
			setThereIsMatch(false)
	}

	return (<>
		{
			thereIsMatch ?
			(<>
				<h1 style={{ fontSize: "3em" }}>Game</h1>
				<div style={{ clear: 'both' }}>
					<Canvas socket={socket} height={640} width={1200} style={canvasStyle} />
				</div>
			</>)
			:
			(<>
				<h1 style={{ fontSize: "3em" }}>Game Matchmaking</h1>
				<div style={{ display: 'inline-block', marginLeft: '20px' }}>
					<MatchMaker socket={socket} thereIsMatch={thereIsMatch} sendCanvas={handleClick} />
				</div>
			</>)
		}</>)
  };

  const canvasStyle = {
	display: 'inline-block',
	verticalAlign: 'top',
  };

  const buttonStyle = {
	backgroundColor: '#15232F',
	color: 'white',
	border: 'none',
	padding: '15px 30px',
	borderRadius: '5px',
	marginLeft: '20px',
  };

export default Game
