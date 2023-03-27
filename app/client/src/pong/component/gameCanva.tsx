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



const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 640;
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;
const BALLRADIUS = 5;


type GameData = {
	roomInfo: {
		//roomId: string,
		timer: number
		margin?:number
		playerheight?: number
		playerwidth?: number
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



// the idea would be to print a GIF while waiting
const WaitingScreen = () => {
	//<iframe src="https://giphy.com/embed/6uGhT1O4sxpi8" width="480" height="240" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/awkward-pulp-fiction-john-travolta-6uGhT1O4sxpi8">via GIPHY</a></p>
	return (
	  <div>
		<img src="https://giphy.com/embed/6uGhT1O4sxpi8" width="480" height="240" alt="Chargement en cours" />
	  </div>
	);
  };

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

const scaleGame = (game: GameData, width : number, height: number) => {
	game.roomInfo.margin = (width * 5) / CANVAS_WIDTH;
	game.ball.r = (height * BALLRADIUS) / CANVAS_HEIGHT;
	game.roomInfo.playerheight = (height * PLAYER_HEIGHT) / CANVAS_HEIGHT;
	game.roomInfo.playerwidth = (width * PLAYER_WIDTH) / CANVAS_WIDTH;

	game.ball.x = (game.ball.x * width) / CANVAS_WIDTH;
	game.ball.y = (game.ball.y * height) / CANVAS_HEIGHT;

	game.player1.y = (game.player1.y * height) / CANVAS_HEIGHT;
	game.player2.y = (game.player2.y * height) / CANVAS_HEIGHT;
}


function drawEndGame(canvas: any, gameData: GameData) {
	const context = canvas.getContext('2d');
	// Clear the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	// draw background
	context.fillStyle = '#15232f';
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Set the font and alignment for the text
	context.font = "180px 'Tr2n', sans-serif";
	context.textAlign = "center";
	context.fillStyle = '#2f8ca3';

	// Determine the text to display based on the outcome of the game
	let text = undefined;
	if (gameData.player1.score > gameData.player2.score) {
	  text = "YOU WIN!";
	} else if (gameData.player1.score < gameData.player2.score) {
	  text = "YOU SUCK!";
	} else if (gameData.player1.score === gameData.player2.score) {
		text = "EQUALITY"
	}

	// Draw the text in the center of the canvas
	context.fillText(text, canvas.width / 2, canvas.height / 2);
  }

const drawTimer = (canvas: any, timer: number) => {
	const context = canvas.getContext('2d');

	const minute = Math.floor((((3750 - timer) * 16) / 1000) / 60);
	const seconde = Math.floor((((3750 - timer) * 16) / 1000) % 60);

	const toString = minute.toString() + ':' + seconde.toString().padStart(2, '0');
	// if (minute != 0)

	// else
		// toString = seconde.toString().padStart(2, '0');

	// Set font to futuristic style and increase size by 50%
	context.font = "70px 'Tr2n', sans-serif";

	// Set color and thickness for countdown text
	context.strokeStyle = '#2f8ca3';

	// Draw timer text
	context.strokeText(toString, canvas.width / 2 + 350, canvas.height - 20);
}


const drawScore = (canvas: any, scorePlayer1: number, scorePlayer2: number) => {
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

export const draw = (canvas: any, game: GameData) => {

	const context = canvas.getContext('2d')
	// scaling game to current height and width
	scaleGame(game, canvas.width, canvas.height);
	// background
	context.fillStyle = '#15232f';
	context.fillRect(0, 0, canvas.width, canvas.height);

	// draw login
	//drawLogin(canvas, game.player1.login, game.player2.login);
	//draw score
	//drawScore(canvas, game.player1.score, game.player2.score);

	// draw timer
	//drawTimer(canvas, game.roomInfo.timer);

	// dram middle line
	context.strokeStyle = 'white';
	context.beginPath();
	context.moveTo(canvas.width / 2, 0);
	context.lineTo(canvas.width / 2, canvas.height);
	context.stroke();

	// draw players
	context.fillStyle = 'white';
	context.fillRect(game.roomInfo.margin, game.player1.y, game.roomInfo.playerwidth, game.roomInfo.playerheight);
	context.fillRect(canvas.width - (game.roomInfo.playerwidth + game.roomInfo.margin), game.player2.y, game.roomInfo.playerwidth, game.roomInfo.playerheight);

	// draw ball
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false)
	context.fill();
};


const Canvas = ({ socket, height, width }: any) => {
	// ref to the html5 canvas on wich we will draw
	const canvas = React.useRef<HTMLCanvasElement>(null); // reference/pointer on html5 canvas element, so you can draw on it
	// getting the user login to print it on canva and transmit it to the other player
	const { user } = useAuth();

	const [game, setGame] = React.useState<boolean>(false);

	const gameCanvas = React.useCallback((node: null | HTMLCanvasElement) => {
		if (node !== null) {
			setGame(true);
			canvas.current = node;
		}
	  }, []);

	socket.on("updateClient", (gameData: GameData) => {
		console.log("---------------------> ON updateClient");
		draw(canvas.current, gameData)
	})

	socket.on("initSetup", (gameData: GameData) => {
		console.log("---------------------> ON initSetup");
		draw(canvas.current, gameData);
		// setWaiting(false);
	})

	socket.on("gameOver", (gameData: GameData) => {
		console.log("---------------------> ON gameOver");
		drawEndGame(canvas.current, gameData);
	})

	const handleMouseMove = React.useMemo(() => {
		const canvasElement = canvas.current
		if (game && canvasElement) {
			const sendPos = (y: number) => {
				socket.emit("paddlePos", y);
			}
			const playerHeight = (canvasElement.height * PLAYER_HEIGHT) / CANVAS_HEIGHT;

			return (event: any) => {
				const canvasLocation = canvasElement.getBoundingClientRect();
				const mouseLocation = event.clientY - canvasLocation?.y
				let y: number;

				if (mouseLocation < playerHeight / 2) {
					y = 0;
				} else if (mouseLocation > canvasElement.height - playerHeight / 2) {
					y = canvasElement.height - playerHeight;
				} else {
					y = mouseLocation - playerHeight / 2;
				}
				sendPos((y * CANVAS_HEIGHT) / canvasElement.height);
			}
		}
		return undefined
	}, [game])

	return (
		<main role="main">
			<canvas onMouseMove={handleMouseMove} ref={gameCanvas} height={height} width={width} />
		</main>
	);
};

Canvas.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default Canvas;
