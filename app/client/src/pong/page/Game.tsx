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


/* --- connecting to the socket.IO server*/
const socket = io.connect("http://localhost:8080/gameTrans", {
})

socket.on("connect", () => {
	console.log("connected to server");
})
/* ---------------- ^^^^ ---------------*/

 type waitingGame = {
	 game_id: string,
	 played_at: string,
	 status: string
 }
 type arrWaitingGame = waitingGame[];

 /*const TOREMOVE = ({joinGameList} : any): any => {

   }*/

function MatchMaker ({thereIsMatch, onClick} : any){

	const [gameIscreated, setGameIscreated] = React.useState(false);
	const [isFetched, setIsFetched] = React.useState(false);
	let model: arrWaitingGame;
	const [joinGameList, setJoinGameList] = React.useState<arrWaitingGame>();

	const createGame = () => {
		console.log(socket.emit("createGame"));
	}

	const handleCreateGame = () => {
		if (!gameIscreated)
		{
			createGame();
			setGameIscreated(true)
		}
	}

	const fetchGameList: Api = {
		api: {
			input: `http://localhost:8080/api/game/gamewatinglist`,
		},
		auth: useFetchAuth(),
	}

	React.useEffect(() => {
		async function fetchingGameList() {
			const gameList: responseApi = await FetchApi(fetchGameList);
			setIsFetched(true);

			model = [...gameList.data].map(e => {return {
				game_id: e.game_id.toString(),
				played_at: e.played_at,
				status: e.status
			}});
		}

		fetchingGameList().then(e => {
			console.log("model.lenght -----------------------> " + model.length)
			setJoinGameList(model);
		});

	}, [])


	return (
		<>
		{gameIscreated ?
			(
				<>
				<div>
					the game is created, know you wait for a competitor
				</div>
				</>
			) : (

				<>
				<div>
				<button onClick={handleCreateGame}>
					CREATE GAME
				</button>
				</div>
				</>
			)
		}

		</>
	)
}


// Main Game page, rendering either matchmaking page or Canvas if therIsMatch == true
const Game = () => {

	const [thereIsMatch, setThereIsMatch] = React.useState(false);

	const handleClick = () => {
		if (!thereIsMatch)
			setThereIsMatch(true)
		else
			setThereIsMatch(false)
	}

	if (thereIsMatch) {
		// able to find a match so start the game
		return (
		  <>
		  <h1 style={{ fontSize: "3em" }}>Game</h1>
			<div style={{ clear: 'both' }}>
			  <Canvas draw={draw} height={640} width={1200} style={canvasStyle} />
			</div>
		  </>
		);
	}
	else
	{
		// no match yet so MatchMaker algo
		return (
			<>
			  <h1 style={{ fontSize: "3em" }}>Game Matchmaking</h1>
			  <div style={{ display: 'inline-block', marginLeft: '20px' }}>
				<MatchMaker thereIsMatch={thereIsMatch} onClick={handleClick} />
			  </div>
			</>
		  );
	}
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
