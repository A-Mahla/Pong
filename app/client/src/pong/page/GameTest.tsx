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

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

const socket = io.connect("http://localhost:8080/gameTrans", {
})

socket.on("connect", () => {
	console.log("connected to server");
})


//  const fetchType: Api = {
//  				api: {
//  					input: `http://localhost:8080/api/users/sacha`,
//  					option?: {
//  						method: "GET",
//  					},
//   			},
//  				auth: useFetchAuth(),
// }
// const {response, data} = FetchApi(fetchType)

// const socket = io("http://localhost:8080/api/gameTrans");


const drawScore = (canvas, scorePlayer1, scorePlayer2) => {
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

const drawLogin = (canvas, loginPlayer1: string, loginPlayer2: string) => {
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

const draw = (canvas, game) => {
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
const ballMove = (game, canvas, handleClick) => {
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

const Canvas = ({draw, height, width}) => {
	const sendMove = (moveData) => {
		socket.emit("move", moveData);
	}

	const {user} = useAuth() // automatic fetch for profile information

	const canvas = React.useRef<HTMLCanvasElement>(); // reference/pointer on html5 canvas element, so you can draw on it

	const [isPlaying, setIsPlaying] = React.useState(false);

	// game data var watched with useState api
	const [game, setGame] = React.useState({
		player1: {
			login: user,
			y: 640 / 2 - PLAYER_HEIGHT / 2,
			score: 0
		},
		player2: {
			login: 'testLogin2',
			y: 640 / 2 - PLAYER_HEIGHT / 2,
			score: 0
		},
		ball: {
			x: 1200 / 2,
			y: 640 / 2,
			r: 5,
			speed: {
				x: 4,
				y: 4
			}
		}

	})

	// button handling play/pause status of the game
	const handleClick = () => {
		if (!isPlaying)
			setIsPlaying(true)
		else
			setIsPlaying(false)
	}

	// useEffect re-render all side effect of component when watched variable (game) state is modified
	React.useEffect(() => {

	const canvasHandler = canvas.current
	if (isPlaying){
		let paddle = game.player1.y;

		// handling Mouse position for moving the paddle
		const handleMouseMove = (event) => {
			const canvasLocation = canvasHandler?.getBoundingClientRect();
			const mouseLocation = event.clientY - canvasLocation?.y
			if (mouseLocation < PLAYER_HEIGHT / 2) {
				paddle = 0;
			} else if (mouseLocation > canvasHandler.height - PLAYER_HEIGHT / 2) {
				paddle = canvasHandler.height - PLAYER_HEIGHT;
			} else {
				paddle = mouseLocation - PLAYER_HEIGHT / 2;
			}
		}
		window.addEventListener('mousemove', handleMouseMove);

		ballMove(game, canvasHandler, handleClick)

		// changing state of game every 20ms, wich provoque useEffect re-render
		const timer = setTimeout(() => {
			setGame({...game,
			player1: {
				...game.player1,
				y: paddle
			},
			ball: {...game.ball,
				x: game.ball.x + game.ball.speed.x,
				y: game.ball.y + game.ball.speed.y
			}})
		}, 20)

		// re-drawing the canva
		draw(canvasHandler, game);

		sendMove(game);

		socket.on("gameUpdate", (gameData) => {
			game.player2.y = gameData.player1.y;
			game.player1.score = gameData.player1.score;
		});

		return () => {
			window.removeEventListener(
				'mousemove',
				handleMouseMove
				);
				clearTimeout(timer);
			};
		} else {
			draw(canvasHandler, game);
		}

	}, [game, isPlaying]);


	return (
		<main role="main">
				< Mybutt isPlaying={isPlaying} onClick={handleClick} />
				<canvas ref={canvas} height={height} width={width} />
		</main>
	);
};

function Mybutt ({isPlaying, onClick} : any) {
	let content;
	// event handler :
	if (isPlaying)
	  content = <button onClick={onClick}>--- PAUSE ---</button>
	else
	  content = <button onClick={onClick}>--- PLAY ---</button>
	return (
	  <div>
		{content}
	  </div>
	)
}

function MatchRender ({thereIsMatch, onClick} : any){

	const [gameIscreated, setGameIscreated] = React.useState(false);
	const [isFetched, setIsFetched] = React.useState(false);
	const [joinGameList, setJoinGameList] = React.useState({});

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

	// const sendMove = (moveData) => {
		// socket.emit("move", moveData);
	// }


	// socket.on("gameUpdate", (gameData) => {
		// game.player2.y = gameData.player1.y;
		// game.player1.score = gameData.player1.score;
	// });

	React.useEffect(() => {

		async function fetchingGameList() {
			const gameList: responseApi = await FetchApi(fetchGameList);
			setIsFetched(true);
			setJoinGameList(gameList.data);
		}

		fetchingGameList();
		console.log("-------------->   LALALALA " + joinGameList);
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
				<> -- this button will create a new game and make you wait for a competitor</>
				</div>
				</>
			)
		}
		<div>

		</div>
		</>
	)
}

Canvas.propTypes = {
	draw: PropTypes.func.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

const GameTest = () => {

	const [thereIsMatch, setThereIsMatch] = React.useState(false);

	const handleClick = () => {
		if (!thereIsMatch)
			setThereIsMatch(true)
		else
			setThereIsMatch(false)
	}

	if (thereIsMatch) {
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
		return (
			<>
			  <h1 style={{ fontSize: "3em" }}>Game Matchmaking</h1>
			  <div style={{ display: 'inline-block', marginLeft: '20px' }}>
				<MatchRender thereIsMatch={thereIsMatch} onClick={handleClick} />
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

export default GameTest
