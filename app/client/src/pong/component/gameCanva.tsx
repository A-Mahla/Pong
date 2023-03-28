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

const LOGIN_FONT = 30;
const SCORE_FONT = 75;
const TIMER_FONT = 70;
const ENDGAMEFONT = 180;

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
		game.roomInfo.margin = Math.floor((width * 5) / CANVAS_WIDTH);
		game.ball.r = Math.floor((height * BALLRADIUS) / CANVAS_HEIGHT);
		game.roomInfo.playerheight = Math.floor((height * PLAYER_HEIGHT) / CANVAS_HEIGHT);
		game.roomInfo.playerwidth = Math.floor((width * PLAYER_WIDTH) / CANVAS_WIDTH);

		game.ball.x = Math.floor((game.ball.x * width) / CANVAS_WIDTH);
		game.ball.y = Math.floor((game.ball.y * height) / CANVAS_HEIGHT);
		console.log(`IN SCALE GAME --> game.ball.x ${game.ball.x} | game.ball.y ${game.ball.y}`)
		game.player1.y = Math.floor((game.player1.y * height) / CANVAS_HEIGHT);
		game.player2.y = Math.floor((game.player2.y * height) / CANVAS_HEIGHT);
}


function drawEndGame(canvas: any, gameData: GameData) {
	const context = canvas.getContext('2d');

	const scaledFont = Math.floor((ENDGAMEFONT * canvas.height) / CANVAS_HEIGHT);
	// Clear the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	// draw background
	context.fillStyle = '#15232f';
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Set the font and alignment for the text
	context.font = `${scaledFont}px 'Tr2n', sans-serif`;
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

	// scaling the print
	const scaledFont = Math.floor((TIMER_FONT * canvas.height) / CANVAS_HEIGHT);
	const widthMargin = Math.floor( (350 * canvas.width) / CANVAS_WIDTH );
	const heightMargin = Math.floor((20 * canvas.height) / CANVAS_HEIGHT);


	const minute = Math.floor((((3750 - timer) * 16) / 1000) / 60);
	const seconde = Math.floor((((3750 - timer) * 16) / 1000) % 60);

	const toString = minute.toString() + ':' + seconde.toString().padStart(2, '0');

	// Set font to futuristic style and increase size by 50%
	context.font = `${scaledFont}px 'Tr2n', sans-serif`;

	// Set color and thickness for countdown text
	context.strokeStyle = '#2f8ca3';

	// Draw timer text
	context.strokeText(toString, canvas.width / 2 + widthMargin, canvas.height - heightMargin);
}


const drawScore = (canvas: any, scorePlayer1: number, scorePlayer2: number) => {
	const context = canvas.getContext('2d');

	const scorePlayer1str = scorePlayer1.toString()
	const scorePlayer2str = scorePlayer2.toString()
	//scaling
	const scaledFont = Math.floor((SCORE_FONT * canvas.height) / CANVAS_HEIGHT);
	const heightMargin = Math.floor((85 * canvas.height) / CANVAS_HEIGHT);
	const widthMargin = Math.floor( (40 * canvas.width) / CANVAS_WIDTH );

	// Set font to futuristic style
	context.font = `${scaledFont}px 'Tr2n', sans-serif`;


	// Measure the width of players login text
	const player1LoginWidth = context.measureText(scorePlayer1str).width;
	const player2LoginWidth = context.measureText(scorePlayer2str).width;

	// Draw player 1 score
	context.fillStyle = '#2f8ca3';
	context.fillText(scorePlayer1str, canvas.width / 2 - (player1LoginWidth + widthMargin), heightMargin);

	// Draw player 2 score
	context.fillStyle = '#2f8ca3';
	context.fillText(scorePlayer2str, canvas.width / 2 + player2LoginWidth, heightMargin);
}

const drawLogin = (canvas: any, loginPlayer1: string, loginPlayer2: string) => {
	const context = canvas.getContext('2d');

	// some scaling
	const scaleFont = Math.floor( (LOGIN_FONT * canvas.height) / CANVAS_HEIGHT );
	const widthMargin = Math.floor( (10 * canvas.width) / CANVAS_WIDTH );
	const heightMargin = Math.floor( (30 * canvas.height) / CANVAS_HEIGHT );

	// Set font to futuristic style
	context.font = `${scaleFont}px180px 'Tr2n', sans-serif`;

	// Measure the width of the player 1 login text
	//const player1LoginWidth = context.measureText(loginPlayer1).width;

	// Draw player1 login at the top left of the canvas
	context.fillStyle = '#2f8ca3';
	context.fillText(loginPlayer1, widthMargin, heightMargin);

	// Measure the width of the player 2 login text
	const player2LoginWidth = context.measureText(loginPlayer2).width;

	// Draw player2 login at the top right of the canvas, aligned with player1 login
	context.fillStyle = '#2f8ca3';
	context.fillText(loginPlayer2, canvas.width - player2LoginWidth - widthMargin, heightMargin);
}

export const draw = (canvas: any, game: GameData) => {

	// scaling game to current height and width
	scaleGame(game, canvas.width, canvas.height);

	const context = canvas.getContext('2d')

	// background
	context.fillStyle = '#15232f';
	context.fillRect(0, 0, canvas.width, canvas.height);

	if (game.player1.login && game.player2.login)
		drawLogin(canvas, game.player1.login, game.player2.login);
	drawScore(canvas, game.player1.score, game.player2.score);
	drawTimer(canvas, game.roomInfo.timer);

	// dram middle line
	context.strokeStyle = 'white';
	context.beginPath();
	context.moveTo(canvas.width / 2, 0);
	context.lineTo(canvas.width / 2, canvas.height);
	context.stroke();

	// draw players
	context.fillStyle = 'white';
	if (game.roomInfo.playerwidth && game.roomInfo.margin && game.roomInfo.playerheight) {
		context.fillRect(game.roomInfo.margin, game.player1.y - (game.roomInfo.playerheight / 2), game.roomInfo.playerwidth, game.roomInfo.playerheight);
		context.fillRect(canvas.width - (game.roomInfo.playerwidth + game.roomInfo.margin), game.player2.y - (game.roomInfo.playerheight / 2), game.roomInfo.playerwidth, game.roomInfo.playerheight);
	}

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
			canvas.current = node;
			setGame(true)
		}
	  }, []);

	React.useEffect(() => {

		socket.on("updateClient", (gameData: GameData) => {
			console.log("---------------------> ON updateClient");
			draw(canvas.current, gameData)
		})

		socket.on("initSetup", (gameData: GameData) => {
			console.log("---------------------> ON initSetup");
			console.log(`game.ball.x ${gameData.ball.x} | game.ball.y ${gameData.ball.y}`)

			draw(canvas.current, gameData);
			// setWaiting(false);
		})

		socket.on("gameOver", (gameData: GameData) => {
			console.log("---------------------> ON gameOver");
			drawEndGame(canvas.current, gameData);
		})
	}, [])

	const handleMouseMove = React.useMemo(() => {
		const canvasElement = canvas.current
		if (game && canvasElement) {
			const sendPos = (y: number) => {
				socket.emit("paddlePos", y);
			}
			const playerHeight = Math.floor((canvasElement.height * PLAYER_HEIGHT) / CANVAS_HEIGHT);

			return (event: any) => {
				const canvasLocation = canvasElement.getBoundingClientRect();
				const mouseLocation = event.clientY - canvasLocation?.y
				let y: number;

				if (mouseLocation < playerHeight / 2) {
					y = playerHeight / 2;
				} else if (mouseLocation > canvasElement.height - playerHeight / 2) {
					y = canvasElement.height - playerHeight / 2;
				} else {
					y = mouseLocation;
				}
				sendPos(Math.floor((y * CANVAS_HEIGHT) / canvasElement.height));
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
