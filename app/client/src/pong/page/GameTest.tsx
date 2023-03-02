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
	context.fillRect(5, game.player1.y, PLAYER_WIDTH, PLAYER_HEIGHT);
	context.fillRect(canvas.width - (PLAYER_WIDTH + 5), game.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);

	// draw ball
	context.beginPath();
	context.fillStyle = 'white';
	context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false)
	context.fill();


	// context.fillStyle = "rgba(0, 0, 200, 0.5)";
	// context.fillRect(30, 30, 50, 50);
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
		{
			game.ball.speed.x *= -1;
			if (game.ball.y < game.player1.y || game.ball.y > game.player1.y)
				game.ball.speed.y *= 2;
		}
		//else
			// you lost !!
	}

}

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
				x: -2,
				y: -2
			}
		}
	})

	React.useEffect(() => {
		const canvas_test = canvas.current
		let raquette = game.player1.y;

		const handleMouseMove = (event) => {
			const canvasLocation = canvas_test?.getBoundingClientRect();
			const mouseLocation = event.clientY - canvasLocation?.y
			if (mouseLocation < PLAYER_HEIGHT / 2) {
				raquette = 0;
			} else if (mouseLocation > canvas_test.height - PLAYER_HEIGHT / 2) {
				raquette = canvas_test.height - PLAYER_HEIGHT;
			} else {
				raquette = mouseLocation - PLAYER_HEIGHT / 2;
			}
		}
		window.addEventListener('mousemove', handleMouseMove);
		ballMove(game, canvas_test)

		const timer = setTimeout(() => {
			setGame({...game,
			player1: {
				y: raquette
			},
			ball: {...game.ball,
				x: game.ball.x + game.ball.speed.x,
				y: game.ball.y + game.ball.speed.y
			}})
		}, 20)
		draw(canvas_test, game);
		return () => {
			window.removeEventListener(
			  'mousemove',
			  handleMouseMove
			);
			clearTimeout(timer);
		};

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
