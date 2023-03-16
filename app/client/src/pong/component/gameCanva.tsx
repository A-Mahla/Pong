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
	roomInfo?: {
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
		speed?: {
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
	// ref to the html5 canvas on wich we will draw
	const canvas = React.useRef<HTMLCanvasElement>(); // reference/pointer on html5 canvas element, so you can draw on it

	// getting the user login to print it on canva and transmit it to the other player
	const {user} = useAuth();

	const [game, setGame] = React.useState<GameData>();

	const [connected, setConnected] = React.useState(false)

	const updateGame = () => {
		socket.on("updateClient", (gameData: GameData) => {
			setGame(gameData);
		})
	}

	const sendLogin = () => {
		console.log("IIIIIIIIIIIIIIIIIIIIIIII");
		socket.emit("login", user);
	}

	const initGame = () => {
		socket.on("initSetup", (gameData: GameData) => {
			setGame(gameData);
			setConnected(true)
		})

	}

	const sendPos = (y: number) => {
		socket.emit("paddlePos", y)
	}


	// useEffect re-render all side effect of component when watched variable (game) state is modified
	React.useEffect(() => {
		const canvasHandler = canvas.current
		if (canvasHandler === undefined)
			return /* will have to throw somthing or display an errorComponent */;


		const handleMouseMove = (event: any) => {
			const canvasLocation = canvasHandler.getBoundingClientRect();
			const mouseLocation = event.clientY - canvasLocation?.y
			let y: number;

			if (mouseLocation < PLAYER_HEIGHT / 2) {
				y = 0;
			} else if (mouseLocation > canvasHandler.height - PLAYER_HEIGHT / 2) {
				y = canvasHandler.height - PLAYER_HEIGHT;
			} else {
				y = mouseLocation - PLAYER_HEIGHT / 2;
			}
			sendPos(y);
		}

		const time = setTimeout(() => {
		console.log("YOOOOOOOOOOOOOOOOOOOOOOOO");
		// sendLogin();
		// initGame();
		socket.emit("login", user);
		socket.on("initSetup", (gameData: GameData) => {
			console.log("iiiiiiiiiiiiiiiiiiiiiinit setup")
			setGame(gameData);
			setConnected(true)
		})

		console.log('game: ', game)

			window.addEventListener('mousemove', handleMouseMove);
			// updateGame();
			socket.on("updateClient", (gameData: GameData) => {

				setGame(gameData);
			})
			draw(canvasHandler, game)
			
			}, 20);
			return () => {
				window.removeEventListener('mousemove', handleMouseMove);
				clearTimeout(time)
			}

		});



	return (
		<main role="main">
			<div>
			{connected? <div>connddected</div>: <div>not connected</div> }

			<canvas ref={canvas} height={height} width={width}/>

			</div>
		</main>
	);
};

Canvas.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default Canvas;
