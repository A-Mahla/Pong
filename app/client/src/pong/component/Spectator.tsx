import * as React from 'react'
import {useState} from 'react'
import { Typography, Box, Paper } from '@mui/material'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Button from "@mui/material/Button";
import Tab from '@mui/material/Tab'
import Swipeable from '../component/Swipeable'
import Profile from '../Profile/Profile'
import PropTypes from 'prop-types';
import { useFetchAuth } from '../context/useAuth'
import { FetchApi, Api, responseApi } from '../component/FetchApi'
import useAuth from '../context/useAuth'
import io, {Socket} from "socket.io-client";
import { render } from 'react-dom'
import Canvas from '../component/gameCanva'
import { draw } from '../component/gameCanva'
import { GameSocketProvider, UserContext } from '../services/GameSocketProvider'
import { styled } from '@mui/system';
import {
	Dialog,
	DialogTitle,
	FormControl,
	DialogContent,
	TextField,
	Divider,
	InputAdornment,
} from '@mui/material'
import {
	PlayersListWrapper,
	PlayersListItemAvatar,
} from '../Profile/SearchPlayers'

interface PlayersListItemProps {
	isActive: boolean;
}

export const PlayersListItem = styled('div')<PlayersListItemProps>(({ isActive }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '56px',
	margin: '4px',
	padding: '0 16px',
	borderRadius: '8px',
	cursor: 'pointer',
	backgroundColor: isActive ? '#EDEDED' : 'transparent',
	'&:hover': {
		backgroundColor: '#EDEDED',
	},
}));

const PlayersListItemText = styled('div')({
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	fontSize: '16px',
	fontWeight: '600',
	textAlign: 'center'
});


type WatchProps = {
	socket: Socket,
	thereIsMatch: boolean,
	openWatch: boolean,
	setOpenWatch: React.Dispatch<React.SetStateAction<boolean>>,
	handleThereIsMatch: () => void,
}

export const Spectator = ({socket, thereIsMatch, handleThereIsMatch, openWatch, setOpenWatch}: WatchProps) => {
	const [gameList, setGameList] = React.useState<{game_id: string, p1:string, p2: string}[]>();
	const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

	function handleJoinGame(gameId: string) {
		// Implémentez cette fonction selon ce que vous voulez faire lorsque l'utilisateur clique sur un bouton.
		socket.emit('watchGame', gameId);
		console.log(`LLLLLLAAAAAAAAAAAAAAA Joining game ${gameId}`);
		if (!thereIsMatch)
			handleThereIsMatch()
	}

	socket.on('updateRuningGames', (runningGameList: any) => {
		console.log('jai du passer par la' + runningGameList);
		setGameList(runningGameList);
	})

	React.useEffect(() => {
		console.log('jai du passer par la +++++++++' );
		setGameList([])
		socket.emit("getRuningGames");
	}, [])

	const handleClose = () => {
		setOpenWatch(false)
	}

	return (
		<>
			<Dialog open={openWatch} onClose={handleClose}
				fullWidth
				maxWidth="md"
				PaperProps={{
					style: {
						borderRadius: '32px',
						height: '30rem',
					}
				}}
			>
				<DialogTitle>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						sx={{mt: 4, mb: 1}}
					>
						<Typography
							component={'span'}
							variant='h6'
							align="center"
							style={{color: '#213547'}}
						>
							Watch Game
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent>
					<Divider variant="middle"/>
					{ !gameList?.length ?
						(<>
						<Grid container
							display="flex"
							direction="column"
							justifyContent="center"
							alignItems="center"
							sx={{ width: '100%', height: '95%' }}
						>
							<Typography
								align="center"
								style={{color: '#aab7b8'}}
							>
								No Match Found
							</Typography>
						</Grid>
						</>) :
						(<>
							<Grid container sx={{height: '100%'}} >
								<PlayersListWrapper>
									{gameList.map((gameId) => (
										<PlayersListItem
											key={+gameId.game_id}
											isActive={+gameId.game_id === selectedRowId}
											onClick={() => handleJoinGame(gameId.game_id)}
										>
											<PlayersListItemText>
												Watch {gameId.game_id}: {gameId.p1} vs {gameId.p2}
											</PlayersListItemText>
										</PlayersListItem>
									))}
								</PlayersListWrapper>
							</Grid>
						</>)
					}
				</DialogContent>
			</Dialog>
		</>
	);
}
// export default Spectator;
