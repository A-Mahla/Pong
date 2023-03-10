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
		login?: string,
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
	context.fillStyle = '#2f8ca3';
	context.lineWidth = 4;
	context.strokeStyle = '#2f8ca3';

	// Center countdown text horizontally and vertically
	context.textAlign = 'center';
	context.textBaseline = 'middle';

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

// controlling the ball position regarding the paddle and the frame
const ballMove = (game: GameData, canvas: any, handleClick: any) => {
	if (game.ball.y > canvas.height || game.ball.y < 0) {
        game.ball.speed.y *= -1;
    }
	if (game.ball.x > canvas.width){
		game.ball.speed.x *= -1;
		if (game.ball.speed.x < 0)
		{
			game.ball.speed.x -= 1;
			game.ball.speed.y -= 1;
		} else {
			game.ball.speed.x += 1;
			game.ball.speed.y += 1;
		}
	}
	else if (game.ball.x < 15) {
		const bornInf = (game.player1.y - PLAYER_HEIGHT)
		const bornSup = (game.player1.y + PLAYER_HEIGHT)
		if (game.ball.y > bornInf && game.ball.y < bornSup)
			game.ball.speed.x *= -1,2;
		else {
			// player1 loose, we reset the ball at the center of the field
			game.player2.score += 1;
			game.ball.x = canvas.width / 2
			game.ball.y = canvas.height / 2
			game.ball.speed.x = 4;
			game.ball.speed.y = 4;
			handleClick();
		}
	}

}

function Mybutt ({countdown, onClick} : any) {
	let content;
	// event handler :
	if (countdown)
	  content = <button onClick={onClick}>--- PAUSE ---</button>
	else
	  content = <button onClick={onClick}>--- PLAY ---</button>
	return (
	  <div>
		{content}
	  </div>
	)
}

const Canvas = ({socket, height, width}: any) => {

	const sendMove = (moveData: GameData) => {
		socket.emit("move", moveData);
	}

	const setupGame = (initData: GameData) => {
		socket.emit("setupGame", initData);
	}

	const {user} = useAuth() // automatic fetch for profile information

	const canvas = React.useRef<HTMLCanvasElement>(); // reference/pointer on html5 canvas element, so you can draw on it

	const [countdown, setCountDown] = React.useState(10);

	const [gameIsInit, setGameIsInit] = React.useState(false);

	// game data var watched with useState api
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

	// button handling play/pause status of the game
	const handleClick = () => {
		if (!countdown)
			setCountDown(10);
		else
			setCountDown(0);
	}

	// useEffect re-render all side effect of component when watched variable (game) state is modified
	React.useEffect(() => {

	const canvasHandler = canvas.current

	if (!gameIsInit)
	{
		setupGame(game);
		/* here we receive the other player gameData set,
		 * it should be the same for both because set by the server except for the login
		 * that have been set separatly just upstair
		 * */
		socket.on("gameUpdate", (gameData: GameData) => {
			console.log("YOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
			setGame({...gameData,
				player2: {
					...gameData.player2,
					login: gameData.player1.login
				}
			})
		})
		setGameIsInit(true);
	}
	if (!countdown){
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
		window.addEventListener('mousemove', handleMouseMove);

		//ballMove(game, canvasHandler, handleClick)
		// after capturing the
		sendMove(game);
		socket.on("gameUpdate", (gameData: GameData) => {
			game.player2.y = gameData.player1.y;
			game.player2.login = gameData.player1.login;
			game.ball.speed.x = gameData.ball.speed.x;
			game.ball.speed.y = gameData.ball.speed.y;
			game.ball.x = gameData.ball.x;
			game.ball.y = gameData.ball.y;
		});

		// changing state of game every 20ms, wich provoque useEffect re-render
		const timer = setTimeout(() => {
			setGame({...game,
			ball: {...game.ball,
				x: game.ball.x + game.ball.speed.x,
				y: game.ball.y + game.ball.speed.y
			}})
		}, 20)
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
			}, 1000)
			drawCountDown(canvasHandler, countdown);
			draw(canvasHandler, game);
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
