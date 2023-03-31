import './App.css';
import './index.css';
import { Pong } from './pong/Pong'
import Particles from 'particlesjs'

function App() {

	return (
		<>
			<Pong />
			<canvas className="background"/>
		</>
	);
}

//			<script src="/node_modules/particlesjs/dist/particles.min.js"></script>

export default App;
