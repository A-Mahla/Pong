import * as React from 'react'
import { Typography, Box, Paper, Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Swipeable from '../component/Swipeable'
import Profile from '../Profile/Profile'
import PropTypes from 'prop-types';
import { useFetchAuth } from '../context/useAuth'
import { FetchApi, Api, responseApi } from '../component/FetchApi'
import useAuth from '../context/useAuth'
import io, {Socket} from "socket.io-client";
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
		countDown: number
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

	// Set font to futuristic style and increase size by 50%
	const context = canvas.getContext('2d');

	context.beginPath();
	context.fillStyle =  '#15232f';
	context.arc(Math.floor(canvas.width / 2), Math.floor(canvas.heigth / 2), Math.floor(canvas.heigth / 4), 0, Math.PI * 2, false)
	context.fill();


	context.font = "112.5px 'Tr2n', sans-serif";

	// Set color and thickness for countdown text
	context.strokeStyle = '#2f8ca3';
	// context.textAlign = "center";
	// Draw countdown text
	context.strokeText(countdown.toString(), canvas.width / 2, canvas.height / 2);
	context.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);
}


/*
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
*/
const scaleGame = (game: GameData, width : number, height: number): GameData => {
	return {
		roomInfo:{
			timer: game.roomInfo.timer,
			countDown: game.roomInfo.countDown,
			margin: Math.floor((width * 5) / CANVAS_WIDTH),
			playerheight: Math.floor((height * PLAYER_HEIGHT) / CANVAS_HEIGHT),
			playerwidth: Math.floor((width * PLAYER_WIDTH) / CANVAS_WIDTH)
		},
		player1:{
			login: game.player1.login,
			y: Math.floor((game.player1.y * height) / CANVAS_HEIGHT),
			score: game.player1.score
		},
		player2:{
			login: game.player2.login,
			y: Math.floor((game.player2.y * height) / CANVAS_HEIGHT),
			score: game.player2.score
		},
		ball: {
			x: Math.floor((game.ball.x * width) / CANVAS_WIDTH),
			y: Math.floor((game.ball.y * height) / CANVAS_HEIGHT),
			r: Math.floor((height * BALLRADIUS) / CANVAS_HEIGHT)
		}
	}
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
	  text = "YOU WIN !";
	} else if (gameData.player1.score < gameData.player2.score) {
	  text = "YOU SUCK !";
	} else if (gameData.player1.score === gameData.player2.score) {
		text = "EQUALITY"
	}

	// Draw the text in the center of the canvas
	context.fillText(text, canvas.width / 2, canvas.height / 2);
}

function drawEndGameWatchers(canvas: any, gameData: GameData) {
	const context = canvas.getContext('2d');

	const scaledFont = Math.floor((ENDGAMEFONT * canvas.height) / CANVAS_HEIGHT);
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = '#15232f';
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.font = `${scaledFont}px 'Tr2n', sans-serif`;
	context.textAlign = "center";
	context.fillStyle = '#2f8ca3';

	context.fillText(`Game Over\n${gameData.player1.login}: ${gameData.player1.score}\n${gameData.player2.login}: ${gameData.player2.score}`, canvas.width / 2, canvas.height / 2)
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

export const draw = (canvas: any, game: GameData) => {

	// scaling game to current height and width
	const scaled: GameData = scaleGame(game, canvas.width, canvas.height);

	const context = canvas.getContext('2d')

	// background
	context.fillStyle = '#15232f';
	context.fillRect(0, 0, canvas.width, canvas.height);

	drawScore(canvas, scaled.player1.score, scaled.player2.score);
	drawTimer(canvas, scaled.roomInfo.timer);

	if (scaled.roomInfo.countDown > 0)
		drawCountDown(canvas, scaled.roomInfo.countDown);

	// dram middle line
	context.strokeStyle = 'white';
	context.beginPath();
	context.moveTo(canvas.width / 2, 0);
	context.lineTo(canvas.width / 2, canvas.height);
	context.stroke();

	// draw players
	context.fillStyle = 'white';
	if (scaled.roomInfo.playerwidth && scaled.roomInfo.margin && scaled.roomInfo.playerheight) {
		context.fillRect(scaled.roomInfo.margin, scaled.player1.y - (scaled.roomInfo.playerheight / 2), scaled.roomInfo.playerwidth, scaled.roomInfo.playerheight);
		context.fillRect(canvas.width - (scaled.roomInfo.playerwidth + scaled.roomInfo.margin), scaled.player2.y - (scaled.roomInfo.playerheight / 2), scaled.roomInfo.playerwidth, scaled.roomInfo.playerheight);
	}

	// draw ball
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(scaled.ball.x, scaled.ball.y, scaled.ball.r, 0, Math.PI * 2, false)
	context.fill();
};

const Canvas = ({ socket, handleThereIsMatch }: {socket: Socket, handleThereIsMatch: () => void}) => {
	// ref to the html5 canvas on wich we will draw
	const canvas = React.useRef<HTMLCanvasElement>(null); // reference/pointer on html5 canvas element, so you can draw on it

	const [game, setGame] = React.useState<boolean>(false);

	const quitGame = async () => {
		socket.emit('quitGame', )
		handleThereIsMatch()
	}

	const canvaResize = async () => {
		const testTimeout = setTimeout(() => {
			if (canvas.current) {
				canvas.current.width = document.documentElement.clientWidth * 0.70;
				canvas.current.height = canvas.current.width * 0.533333;
			}
		}, 100)
		return () => {
			clearTimeout(testTimeout);
		}
	}

	const gameCanvas = React.useCallback((node: null | HTMLCanvasElement) => {
		if (node !== null) {
//			============= to work on ================
//			canvas.current = node; //fait en sorte que ton canvas soit gerer dans un useState
//			=========================================
			setGame(true)
		}
	  }, []);

	React.useEffect(() => {

		socket.on("updateClient", (gameData: GameData) => {
			console.log("---------------------> ON updateClient");
			draw(canvas.current, gameData);
		})

		socket.on("initSetup", (gameData: GameData) => {
			console.log("---------------------> ON initSetup");
			console.log(`game.ball.x ${gameData.ball.x} | game.ball.y ${gameData.ball.y}`)

			draw(canvas.current, gameData);
			// setWaiting(false);
		})

		socket.on("pause", (gameData: GameData) => {
			console.log("---------------------> ON gameOver");
			drawEndGame(canvas.current, gameData);
		})

		socket.on("gameOver", (gameData: GameData) => {
			console.log("---------------------> ON gameOver");
			drawEndGame(canvas.current, gameData);
		})

		socket.on("gameOverWatcher", (gameData: GameData) => {
			console.log("---------------------> ON gameOverWatchers");
			drawEndGameWatchers(canvas.current, gameData);
		})


		window.addEventListener("resize", canvaResize);

		return (() => {
			window.removeEventListener("resize", canvaResize);
		})
	}, [])

	const handleMouseMove = React.useMemo(() => {
		const canvasElement = canvas.current
		if (game && canvasElement) {
			const sendPos = (y: number) => {
				socket.volatile.emit("paddlePos", y);
			}
			const playerHeight = Math.floor((canvasElement.height * PLAYER_HEIGHT) / CANVAS_HEIGHT);

			return ((event: any) => {
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
			});
		}
		return (undefined);
	}, [game])

	return (
		<main role="main">
			<canvas onMouseMove={handleMouseMove} ref={gameCanvas} height={(document.documentElement.clientWidth * 0.70) * 0.533333} width={document.documentElement.clientWidth * 0.70} />
			<Button onClick={quitGame}>
					QUIT GAME
			</Button>
		</main>
	);
};

/*Canvas.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	};*/

export default Canvas;
