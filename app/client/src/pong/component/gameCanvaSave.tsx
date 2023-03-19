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
// import '../page/game.css'
import { render } from 'react-dom'



const CANVAS_HEIGHT = 640;
const CANVAS_WIDTH = 1200;


const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

type GameData = {
	roomInfo: {
		//roomId: string,
		countDownRequired: boolean,
		canvasHeight: number,
		canvasWidth: number,
		playerHeight: number
		playerWidth: number

	}
	player1: {
		login?: string
		y: number,
		score: number
	},
	player2: {
		login?: string
		y: number,
		score: number
	},
	ball: {
		x: number,
		y: number,
		r: number,
		speed: {
			x: number,
			y: number
		}
	}
}


const drawCountDown = (canvas: any, countdown: number) => {
	const context = canvas.getContext('2d');

	// Set font to futuristic style and increase size by 50%
	context.font = "112.5px 'Tr2n', sans-serif";

	// Set color and thickness for countdown text
	context.strokeStyle = '#2f8ca3';

	// Draw countdown text
	context.strokeText(countdown.toString(), canvas.width / 2, canvas.height / 2);
	context.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);
}

const drawScore = (canvas: any , scorePlayer1: number, scorePlayer2: number) => {
	const context = canvas.getContext('2d');

	// Set font to futuristic style
	context.font = "75px 'Tr2n', sans-serif";

	// Draw player 1 score
	context.fillStyle = '#2f8ca3';
	context.fillText(scorePlayer1, canvas.width / 2 - 62, 85);

	// Draw player 2 score
	context.fillStyle = '#2f8ca3';
	context.fillText(scorePlayer2, canvas.width / 2 + 20, 85);
}

const drawLogin = (canvas: any, loginPlayer1: string, loginPlayer2: string) => {
	const context = canvas.getContext('2d');

	// Set font to futuristic style
	context.font = "37px 'Tr2n', sans-serif";

	// Measure the width of the player 1 login text
	//const player1LoginWidth = context.measureText(loginPlayer1).width;

	// Draw player1 login at the top left of the canvas
	context.fillStyle = '#2f8ca3';
	context.fillText(loginPlayer1, 10, 30);

	// Measure the width of the player 2 login text
	const player2LoginWidth = context.measureText(loginPlayer2).width;

	// Draw player2 login at the top right of the canvas, aligned with player1 login
	context.fillStyle = '#2f8ca3';
	context.fillText(loginPlayer2, canvas.width - player2LoginWidth - 10, 30);
}

export const draw = (canvas: any, game: any) => {
	const context = canvas.getContext('2d')
	// background
	context.fillStyle = '#15232f';
	context.fillRect(0, 0, canvas.width, canvas.height);

	// draw login
	drawLogin(canvas, game.player1.login, game.player2.login);
	//draw score
	drawScore(canvas, game.player1.score, game.player2.score);

	// draw playerLogin

	// dram middle line
	context.strokeStyle = 'white';
	context.beginPath();
	context.moveTo(canvas.width / 2, 0);
	context.lineTo(canvas.width / 2, canvas.height);
	context.stroke();

	// draw players
	context.fillStyle = 'white';
	context.fillRect(5, game.player1.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	context.fillRect(canvas.width - (PLAYER_WIDTH + 5), game.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);

	// draw ball
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false)
	context.fill();
};


const Canvas = ({socket, height, width}: any) => {

	const sendMove = (moveData: GameData) => {
		socket.volatile.emit("move", moveData);
	}

	const catchMove = () => {

		socket.on("gameUpdate", (gameDataServer: GameData) => {
			setGame({...game,
				player1: {
					...game.player1,
					score: gameDataServer.player2.score
				},
				player2: {
					...game.player2,
					y: gameDataServer.player1.y,
					score: gameDataServer.player1.score
				},
				ball: {...game.ball,
					x: gameDataServer.ball.x + gameDataServer.ball.speed.x,
					y: gameDataServer.ball.y + gameDataServer.ball.speed.y,
					speed: {
						x: gameDataServer.ball.speed.x,
						y: gameDataServer.ball.speed.y
					}
				}
			})
		});

	}

	const setupGame = (initData: GameData) => {
		socket.volatile.emit("setupGame", initData);
	}
	const catchSetup = () => {
		socket.on("gameIsSet", (gameData: GameData) => {
			setGame({...gameData,
				player1: {
					...gameData.player1,
					login: game.player1.login
				},
				player2: {
					...gameData.player2,
					login: gameData.player1.login
				}
			})
			setGameIsInit(true);
		})
	}

	const {user} = useAuth() // automatic fetch for profile information

	const canvas = React.useRef<HTMLCanvasElement>(); // reference/pointer on html5 canvas element, so you can draw on it

	const [countdown, setCountDown] = React.useState(10);

	const [gameIsInit, setGameIsInit] = React.useState(false);

	// we only init the parameter that the server cannot have (room info) the rest is set to 0
	const [game, setGame] = React.useState<GameData>({
		roomInfo: {
			countDownRequired: true,
			canvasHeight: CANVAS_HEIGHT,
			canvasWidth: CANVAS_WIDTH,
			playerHeight: PLAYER_HEIGHT,
			playerWidth: PLAYER_WIDTH
		},
		player1: {
			login: user,
			y: 0,
			score: 0
		},
		player2: {
			login: '',
			y: 0,
			score: 0
		},
		ball: {
			x: 0,
			y: 0,
			r: 0,
			speed: {
				x: 0,
				y: 0
			}
		}
	})

	// useEffect re-render all side effect of component when watched variable (game) state is modified
	React.useEffect(() => {
	const canvasHandler = canvas.current

	// to make sure we init the game only once
	if (!gameIsInit)
	{
		/* here we receive the other player gameData set,
		 * it should be the same for both because set by the server except for the login
		 * that have been set separatly just upstair
		 * */
		setupGame(game);
		catchSetup();
	}

	// handling Mouse position for moving the paddle
	const handleMouseMove = (event: any) => {
		const canvasLocation = canvasHandler?.getBoundingClientRect();
		const mouseLocation = event.clientY - canvasLocation?.y
		if (mouseLocation < PLAYER_HEIGHT / 2) {
			game.player1.y = 0;
		} else if (mouseLocation > canvasHandler.height - PLAYER_HEIGHT / 2) {
			game.player1.y = canvasHandler.height - PLAYER_HEIGHT;
		} else {
			game.player1.y = mouseLocation - PLAYER_HEIGHT / 2;
		}
	}

	if (!countdown){
		// changing state of game every 20ms, wich provoque useEffect re-render
		const timer = setTimeout(() => {
			window.addEventListener('mousemove', handleMouseMove);
			sendMove(game);
			catchMove()
		}, 10)
		// re-drawing the canva
		draw(canvasHandler, game);

		return () => {
			window.removeEventListener(
				'mousemove',
				handleMouseMove
				);
				clearTimeout(timer);
			};
		} else {
			const timer = setTimeout(() => {
				setCountDown(countdown - 1)
				draw(canvasHandler, game);
				drawCountDown(canvasHandler, countdown);
			}, 1000)
			return () => { clearTimeout(timer) }
		}
	}, [game, countdown]);


	return (
		<main role="main">
				<canvas ref={canvas} height={height} width={width} />
		</main>
	);
};

Canvas.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default Canvas;
