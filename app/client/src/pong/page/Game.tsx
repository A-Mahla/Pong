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
const socket = io.connect(`http://${import.meta.env.VITE_SITE}/gameTrans`, {
})

socket.on("connect", () => {
	console.log("connected to server");
})
/* ---------------- ^^^^ ---------------*/

/* ---------------- type definition for matchmaking fetch informations --------- */
type waitingGame = {
	game_id: string,
	played_at: string,
	status: string
}

type arrWaitingGame = waitingGame[];

interface JoinGameProps {
	joinGameList: arrWaitingGame;
}
/* ---------------- ^^^^ ---------------*/


function JoinGame({joinGameList}: JoinGameProps): JSX.Element {

	const JoinGame = (game_id: string) => {
		socket.emit("joinGame", { roomId: game_id });
	}

	return (
	<div style={{display: "flex", flexDirection: "column"}}>
		{joinGameList.map((game) => (
			<button onClick={() => JoinGame(game.game_id)} key={game.game_id} >
				Join game {game.game_id}
			</button>
		))}
	</div>
  )
}

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
			input: `http://${import.meta.env.VITE_SITE}/api/game/gamewatinglist`,
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

		socket.on("roomsUpdate", () => {
			setIsFetched(false);
		})

		socket.on("lockAndLoaded", () => {
			onClick();
		})

		return () => {/* Don't know what to return for a clean exit */}
	}, [gameIscreated, isFetched])


	return (
		<>
		<div style={{display: "flex", justifyContent: "space-between"}}>

			{gameIscreated ?
				(
					<>
					<div>
						<h2>CREATE GAME</h2>
						<>game is created, now you wait for a competitor</>
					</div>
					</>
				) : (

					<>
					<div style={{textAlign: "right"}}>
						<h2>CREATE GAME</h2>
						<button onClick={handleCreateGame}>
							NEW GAME
						</button>
					</div>
					</>
				)
			}
			<div>
				<h2>JOIN GAME</h2>
				{joinGameList? (<JoinGame joinGameList={joinGameList} />) : (<>PROBLEM</>) }
			</div>
		</div>
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
			  <Canvas socket={socket} height={640} width={1200} style={canvasStyle} />
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
