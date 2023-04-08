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
import { render } from 'react-dom'
import Canvas from '../component/gameCanva'
import { draw } from '../component/gameCanva'
import { GameSocketProvider, UserContext } from '../services/GameSocketProvider'


export const Spectator = ({socket, thereIsMatch, handleThereIsMatch}: any) => {
	const [gameList, setGameList] = React.useState<string[]>();

	function handleJoinGame(gameId: string) {
		// Implémentez cette fonction selon ce que vous voulez faire lorsque l'utilisateur clique sur un bouton.
		socket.emit('watchGame', gameId);
		console.log(`Joining game ${gameId}`);
		if (!thereIsMatch)
			handleThereIsMatch()
	}

	socket.on('updateRuningGames', (runningGameList: any) => {
		setGameList(runningGameList);
	})

	React.useEffect(() => {
		socket.emit("getRuningGames");
	}, [])

	if (gameList !== undefined) {
		return (
			<div>
				{gameList.map((gameId) => (
					<Button key={gameId} onClick={() => handleJoinGame(gameId)}>
						Join game {gameId}
					</Button>
				))}
			</div>
		);
		} else {
			return <Grid> Loading...</Grid>
		}
}
// export default Spectator;
