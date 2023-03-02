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
	context.fillRect(0, game.player1.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	context.fillRect(canvas.width - PLAYER_WIDTH, game.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);

	// draw ball
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false)
	context.fill();


	// context.fillStyle = "rgba(0, 0, 200, 0.5)";
	// context.fillRect(30, 30, 50, 50);
};


const Canvas = ({draw, height, width}) => {
	const canvas = React.useRef<HTMLCanvasElement>();
	const [game, setGame] = React.useState({
		player1: {
			y: 640 / 2 - PLAYER_HEIGHT / 2
		},
		player2: {
			y: 640 / 2 - PLAYER_HEIGHT / 2
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
		const canvas_test = canvas.current
		// setTimeout(() => {setGame({...game, ball: {...game.ball, x: game.ball.x + 2, y: game.ball.y + 2}})}, 20)
		const playerMove = (event) => {
			const canvasLocation = canvas.getBoundingClientRect();
			const mouseLocation = event.clientY - canvasLocation.y;
			setGame({...game, player1: {y: mouseLocation - PLAYER_HEIGHT / 2}})
		}
		canvas_test?.addEventListener('mousemove', playerMove);
		draw(canvas_test, game);
	}, [game]);

	return (
		<canvas ref={canvas} height={height} width={width} />
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
