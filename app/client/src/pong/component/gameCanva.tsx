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
import LinearProgress from '@mui/material/LinearProgress';



const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 640;
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;
const BALLRADIUS = 5;

const WAITING_FONT = 100;
const LOGIN_FONT = 30;
const SCORE_FONT = 75;
const TIMER_FONT = 70;
const ENDGAMEFONT = 180;

type GameData = {
	roomInfo: {
		//roomId: string,
		duration: number
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
const drawWaitingScreen = (canvas: any, animationId: any) => {
	const context = canvas.getContext('2d');

	// Clear canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Draw background
	context.fillStyle = '#15232f';
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Draw text
	const scaledFont = Math.floor((WAITING_FONT * canvas.height) / CANVAS_HEIGHT);
	context.font = `${scaledFont}px 'Tr2n', sans-serif`;
	context.textAlign = 'center';
	context.fillStyle = '#2f8ca3';
	context.fillText('Waiting for opponent...', canvas.width / 2, canvas.height / 2);

	// Draw paddle animation
	const paddleWidth = Math.floor((PLAYER_HEIGHT * canvas.width) / CANVAS_WIDTH);
	const paddleHeight = Math.floor((PLAYER_WIDTH * canvas.height) / CANVAS_HEIGHT);
	const paddleY = Math.floor((260 * canvas.height) / CANVAS_HEIGHT);
	const paddleSpeed = 1; // Adjust to change paddle speed
	let paddleX = -paddleWidth; // Start off-screen
	let direction = 1; // Move to the right initially

	const animatePaddle = () => {
	  // Clear previous paddle position
	  context.clearRect(paddleX - paddleSpeed, paddleY, paddleWidth, paddleHeight);

	  // Draw new paddle position
	  context.fillStyle = '#2f8ca3';
	  context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

	  // Update paddle position
	  paddleX += paddleSpeed * direction;

	  // Reverse direction if paddle reaches edge of canvas
	  if (paddleX + paddleWidth >= canvas.width || paddleX <= 0) {
		direction *= -1;
	  }
	};

	// Start animation loop
	animationId = setInterval(() => {
	  animatePaddle();
	}, 10);

}

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

const scaleGame = (game: GameData, width : number, height: number): GameData => {
	return {
		roomInfo:{
			duration:  game.roomInfo.duration,
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

const drawTimer = (canvas: any, timer: any) => {
	const context = canvas.getContext('2d');

	// scaling the print
	const scaledFont = Math.floor((TIMER_FONT * canvas.height) / CANVAS_HEIGHT);
	const widthMargin = Math.floor( (350 * canvas.width) / CANVAS_WIDTH );
	const heightMargin = Math.floor((20 * canvas.height) / CANVAS_HEIGHT);


	const minute = Math.floor((((timer.duration - timer.timer) * 16) / 1000) / 60);
	const seconde = Math.floor((((timer.duration - timer.timer) * 16) / 1000) % 60);

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
	drawTimer(canvas, scaled.roomInfo);

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

const Canvas = ({ socket, handleThereIsMatch, handleThereIsError }: {socket: Socket, handleThereIsMatch: () => void, handleThereIsError: (errorstr: string) => void}) => {
	// ref to the html5 canvas on wich we will draw
	const canvas = React.useRef<HTMLCanvasElement | null>(null); // reference/pointer on html5 canvas element, so you can draw on it

	const [game, setGame] = React.useState<boolean>(false);
	const [fetched, setFetched] = React.useState<boolean>(false);
	let animationId: any;


	const quitGame = async () => {
		socket.emit('quitGame')
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
			canvas.current = node; //fait en sorte que ton canvas soit gere dans un useState
			setGame(true)
		}
	}, []);

	React.useEffect(() => {

	//	drawWaitingScreen(canvas.current, animationId);

		socket.on('disconnection', (errorMessage: string) => {
			handleThereIsError(errorMessage)
		})

		socket.on("updateClient", (gameData: GameData) => {
			setFetched(true)
			draw(canvas.current, gameData);
		})

		socket.on("initSetup", (gameData: GameData) => {
			console.log("---------------------> ON initSetup");
			clearInterval(animationId)
			setFetched(true)
			draw(canvas.current, gameData);
		})

		socket.on("pause", (gameData: GameData) => {
			console.log("---------------------> ON gameOver");
			setFetched(true)
			drawEndGame(canvas.current, gameData);
		})

		socket.on("gameOver", (gameData: GameData) => {
			console.log("---------------------> ON gameOver");
			setFetched(true)
			drawEndGame(canvas.current, gameData);
		})

		socket.on("gameOverWatcher", (gameData: GameData) => {
			console.log("---------------------> ON gameOverWatchers");
			setFetched(true)
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
		<>
		{!fetched ?
			(<>
				<Grid container
					direction="column"
					justifyContent="center"
					alignItems="center"
					sx={{height: "95%"}}
				>
					<Grid  sx={{height: "20%"}}>
					<Typography variant="h3"
						style={{color: '#919090'}}
					>
						Game Matching...
					</Typography>
					</Grid>
					<Grid sx={{height: '10%', width: '75%', color: "#919090" }}>
						 <LinearProgress color="inherit" />
					</Grid>
				</Grid>
			</>) : (<>
				<Typography variant='h4'>Game</Typography>
				<canvas
					onMouseMove={handleMouseMove}
					ref={gameCanvas}
					height={Math.floor((document.documentElement.clientWidth * 0.50) * 0.533)}
					width={Math.floor(document.documentElement.clientWidth * 0.50)}
				/>
				<Button onClick={quitGame}>
						QUIT GAME
				</Button>
			</>)
		}
		</>
	);
};

/*Canvas.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	};*/

export default Canvas;
