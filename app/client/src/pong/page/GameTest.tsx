import * as React from 'react'
import { Typography, Box, Paper } from '@mui/material'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import Swipeable from '/src/pong/component/Swipeable'
import Profile from '/src/pong/Profile/Profile'
import PropTypes from 'prop-types';

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

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

const draw = (canvas, game) => {
	const context = canvas.getContext('2d')
	// background
	context.fillStyle = 'black';
	context.fillRect(0, 0, canvas.width, canvas.height);

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

	// draw score
	drawScore(canvas, game.player1.score, game.player2.score);

};

const ballMove = (game, canvas) => {
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
			game.ball.speed.x = 0;
			game.ball.speed.y = 0;
		}
	}

}

const Canvas = ({draw, height, width}) => {
	const canvas = React.useRef<HTMLCanvasElement>();
	const [isPlaying, setIsPlaying] = React.useState(1);
	const [game, setGame] = React.useState({
		player1: {
			y: 640 / 2 - PLAYER_HEIGHT / 2,
			score: 0
		},
		player2: {
			y: 640 / 2 - PLAYER_HEIGHT / 2,
			score: 0
		},
		ball: {
			x: 1200 / 2,
			y: 640 / 2,
			r: 5,
			speed: {
				x: 2,
				y: 2
			}
		}
	})
	React.useEffect(() => {
		const canvasHandler = canvas.current
	if (isPlaying){
		let raquette = game.player1.y;
		const handleMouseMove = (event) => {
			const canvasLocation = canvasHandler?.getBoundingClientRect();
			const mouseLocation = event.clientY - canvasLocation?.y
			if (mouseLocation < PLAYER_HEIGHT / 2) {
				raquette = 0;
			} else if (mouseLocation > canvasHandler.height - PLAYER_HEIGHT / 2) {
				raquette = canvasHandler.height - PLAYER_HEIGHT;
			} else {
				raquette = mouseLocation - PLAYER_HEIGHT / 2;
			}
		}
		window.addEventListener('mousemove', handleMouseMove);
		ballMove(game, canvasHandler)
		const timer = setTimeout(() => {
			setGame({...game,
			player1: {
				...game.player1,
				y: raquette
			},
			ball: {...game.ball,
				x: game.ball.x + game.ball.speed.x,
				y: game.ball.y + game.ball.speed.y
			}})
		}, 20)
		draw(canvasHandler, game);
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

	}, [game]);
	return (
		<main role="main">
				<canvas ref={canvas} height={height} width={width} />
		</main>
	);
};

Canvas.propTypes = {
  draw: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

const GameTest = () => {
	return (
		<>
		<h1>Game</h1>
			<div>
				<Canvas draw={draw} height={640} width={1200} />
			</div>
		</>
	)

}
export default GameTest
