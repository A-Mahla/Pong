import './App.css';
import './index.css';
import { Pong } from './pong/Pong'
import Particles from 'particlesjs'

function App() {

	window.onload = function() {
		Particles.init({
			selector: '.background',
			maxParticles: 150,
			connectParticles: true,
			sizeVariations: 1
			
		});
	};

	return (
		<>
			<Pong />
			<canvas className="background"></canvas>
		</>
	);
}

//			<script src="/node_modules/particlesjs/dist/particles.min.js"></script>

export default App;
