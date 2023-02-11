import '../App.css';
import { Typography } from '@mui/material'

/**
 * ============ Entrypoint of the project =============
 */

export const Pong = () => {
	return (
		<>
			<Typography variant="h1" align="center" padding="2
			20px">
					Pong
			</Typography>
			<Typography variant="h4" align="center" padding="20px">
					Welcome to your first own full stack project ...
			</Typography>
			<Typography variant="h6" align="justify" padding="50px">
					Yours local volumes for client ( react == localhost:3000 ) are "./app/client/src" and ./app/client/public"	:
					<br/>
					-	you can work on directory "./app/client/src/pong"
					<br/>
					-	the front-end entrypoint is "./app/client/src/pong/pong.tsx"
			</Typography>
			<Typography variant="h6" align="justify" padding="50px">
					Your local volume for server ( nestjs == localhost:5500 ) is "./app/server/src"	:
					<br/>
					-	you can work on directory "./app/server/src"
			</Typography>
			<Typography variant="h6" align="justify" padding="50px">
					Your local volume for postgres database is handle by docker and persitent (like all others volumes)	:
					<br/>
					-	You can remove persitent postgres data volume with command: "docker volume rm postgres"
			</Typography>
		</>
	)
}
