import * as React from 'react'
import { Typography, Box, Paper } from '@mui/material'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Button from "@mui/material/Button";
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

					<Button onClick={handleClick}>
						JOIN QUEU
					</Button>

			</>) : (
			<>
					<Button>
							QUEU IS JOINED
					</Button>
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
		<Grid container spacing={2}>
			<Grid item xs={12}>
				AUTOMATIK MATCHMAKING
			</Grid>
			<Grid item xs={12} sm={6}>
				<JoinQueuButton  socket={socket} setJoinQueu={setJoinQueu} joinQueu={joinQueu} />
			</Grid>
		</Grid>
		</>
	)
}


// Main Game page, rendering either matchmaking page or Canvas if therIsMatch == true
export const Game = ({ height, width }: any) => {

	const socket = React.useContext(UserContext);
	const [thereIsMatch, setThereIsMatch] = React.useState(false);

	const handleClick = () => {
		if (!thereIsMatch)
			setThereIsMatch(true)
		else
			setThereIsMatch(false)
	}
	console.log(`IN GAME COMPONENT --> height = ${height} | width = ${width}`);
	return (<>
		{
			thereIsMatch ?
			(<>
				<Typography variant='h1'>Game</Typography>
				<div style={{ clear: 'both' }}>
					<Canvas socket={socket} height={height} width={width} style={canvasStyle} />
				</div>
			</>)
			:
			(<>
			<Grid>

				<Grid item xs={12}>
					<Typography variant='h1'>Matchmaking</Typography>
				</Grid>
					<div style={{ display: 'inline-block', marginLeft: '20px' }}>
						<MatchMaker socket={socket} thereIsMatch={thereIsMatch} sendCanvas={handleClick} />
					</div>
				<Grid>

				</Grid>
			</Grid>
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

	export const GamePage = ({height, width}: any) => {
		console.log(`-------> ${height} ${width} `)
		return (
			<GameSocketProvider>
				<Game height={height} width={width}/>
			</GameSocketProvider>
		)
	}
	export default GamePage;
