import { 
	Box,
	Grid,
	Dialog,
	DialogTitle,
	FormControl,
	DialogContent,
	Typography,
	TextField,
	Paper,
	Divider,
	Stack,
	InputAdornment,
} from '@mui/material'
import { styled } from '@mui/system';
import useAuth, { useFetchAuth } from '/src/pong/context/useAuth'
import { FetchApi, Api } from '/src/pong/component/FetchApi'
import GppGoodIcon from '@mui/icons-material/GppGood'
import GppBadIcon from '@mui/icons-material/GppBad';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import * as React from 'react';


function timeout(delay: number) {
	return new Promise( res => setTimeout(res, delay) );
}

function isNumberOrString(str) {
	return /^([0-9a-zA-Z_]){1,20}$/.test(str);
}

type Players = {
	id: number,
	login: string,
	avatar: string,
}

const GridProfile = (props: {player: Players}) => {

	const auth = useFetchAuth()
	const [win, setWin] = useState<number>(0)
	const [loss, setLoss] = useState<number>(0)
	const [fetched, setFetched] = useState(false)

	useEffect(() => {
		async function fetching() {

			const response = await FetchApi({
				api: {
					input: `http://${import.meta.env.VITE_SITE}/api/users/profile/info/${props.player.id}`,
				},
				auth: auth,
			})
			console.log(response.data)
			setWin(response.data['nbWin'])
			setLoss(response.data['nbLoss'])
			setFetched(true)
		}
		fetching()

	}, [])

	return <>
		{ fetched ?
			<Grid sx={{width: '100%', height: '100%', border: 1}}>
				<Grid display="flex" sx={{width: '100%', height: '50%', border: 1}}>
					<Grid item xs={6} sx={{height: '100%', border: 1}}>
					</Grid>
					<Grid display='flex' item xs={6} sx={{
						height: '100%',
						border: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
						<Typography align="center" variant="h5">
							{props.player.login}
						</Typography>
					</Grid>
				</Grid>
				<Grid display="flex" sx={{width: '100%', height: '50%', border: 1}}>
					<Grid item xs={4} sx={{height: '100%', border: 1}}>

						<Grid item xs={12}
							display="flex"
							sx={{
								justifyContent: 'center',
								alignItems: 'center',
								height: '70%'
							}}
						>
							<GppGoodIcon style={{color: '#293241'}} sx={{height: '5rem', width: '5rem'}}/>
						</Grid>

						<Grid item xs={12}
							display="flex"
							sx={{
								justifyContent: 'center',
								height: '30%'
							}}
						>
							<Typography align="center">
								{win}
							</Typography>
						</Grid>
			
					</Grid>
					<Grid item xs={4} sx={{height: '100%', border: 1}}>
					</Grid>
					<Grid item xs={4} sx={{height: '100%', border: 1}}>

						<Grid item xs={12}
							display="flex"
							sx={{
								justifyContent: 'center',
								alignItems: 'center',
								height: '70%'
							}}
						>
							<GppBadIcon style={{color: '#cd384a'}} sx={{height: '5rem', width: '5rem'}}/>
						</Grid>

						<Grid item xs={12}
							display="flex"
							sx={{
								justifyContent: 'center',
								height: '30%'
							}}
						>
							<Typography align="center">
								{loss}
							</Typography>
						</Grid>
			
					</Grid>
				</Grid>
			</Grid>
			:
			<Grid
				display="flex"
				sx={{
					height: '100%',
					width: '100%',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<CircularProgress sx={{mt: 3, color:"#aab7b8"}}/>
			</Grid>
		}

	</>

}


const PlayersListWrapper = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	padding: '8px',
	boxSizing: 'border-box',
	height: '100%',
	overflowY: 'auto',
});


const PlayersListItem = styled('div')(({ isActive }) => ({
	display: 'flex',
	alignItems: 'center',
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

const PlayersListItemAvatar = styled('div')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '40px',
	width: '40px',
	borderRadius: '50%',
	marginRight: '16px',
	backgroundColor: '#ffffff',
	flexShrink: 0
});

const PlayersListItemText = styled('div')({
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	fontSize: '16px',
	fontWeight: '600',
});


const GridPlayers = () => {

	const auth = useFetchAuth()
	const [rows, setRows] = useState<Players[]>([] as Players[])
	const [selectedRow, setSelectedRow] = useState(null)
	const [selectedRowId, setSelectedRowId] = useState(null)

	useEffect(() => {
		setRows([] as Players[])
		setSelectedRow(null)
	}, [])

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		const timer = await timeout(1000)
		if (isNumberOrString(e.target.value)) {
			const response = await FetchApi({
				api: {
					input: `http://${import.meta.env.VITE_SITE}/api/users/search/${e.target.value}`,
				},
				auth: auth,
			})
			setRows(response.data)
		} else if (!e.target.value) {
			setRows([] as Players[])
		}
		return () => clearTimeout(timer)
	}

	return (
		<>
			<Divider variant="middle"/>
			<Grid
				display="flex"
				sx={{ height: '95%' }}
			>
				<Grid item xs={5} sx={{mt: 1.5, mr: 1}}>
					
					<FormControl>
						<TextField
							type='text'
							size="small"
							label="search"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon />
									</InputAdornment>
								)
							}}
							onChange={handleChange}
						></TextField>
					</FormControl>
					{rows.length ?
						<PlayersListWrapper>
						  {rows.map((row) => (
							<PlayersListItem
							  key={row.id}
							  isActive={row.id === selectedRowId}
							  onClick={() => setSelectedRow(row)}
							>
							  <PlayersListItemAvatar>
								<span>{row.login.charAt(0)}</span>
							  </PlayersListItemAvatar>
							  <PlayersListItemText>{row.login}</PlayersListItemText>
							</PlayersListItem>
						  ))}
						</PlayersListWrapper>
						:
						<Box sx={{height: "80%"}}
							display="flex"
							justifyContent="center"
							alignItems="center"
						>
							<Typography
								align="center"
								style={{color: '#aab7b8'}}
							>
								no player listed
							</Typography>
						</Box>
					}


				</Grid>

				<Divider orientation="vertical" flexItem />

				<Grid item xs={7}
					display="flex"
					justifyContent="center"
					alignItems="center"
				>
					{selectedRow ?
						<GridProfile player={selectedRow}/>
						:
						<Typography
							align="center"
							style={{color: '#aab7b8'}}
						>
							no profile selected
						</Typography>
					}

				</Grid>
			</Grid>
		</>
	);
}


type MatchHistoryProps = {
	open: boolean,
	setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}



const SearchPlayers = (props: MatchInfoProps) => {

	const [user, setUser] = useState('')
	const [rows, setRows] = useState<matchHistoryPayload[]>({} as matchHistoryPayload[])
	const auth = useFetchAuth();

	const handleClose = () => {
		props.setOpen(false);
	}

	return (
		<>
			<Dialog open={props.open} onClose={handleClose}
				 PaperProps={{
					style: {
						borderRadius: '32px',
						height: '30rem',
						width: '35rem'
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
							Search Players
						</Typography>
					</Box>
				</DialogTitle>
				<DialogContent>
					<GridPlayers rows={rows} />
				</DialogContent>
			</Dialog>
		</>
	)

}
export default SearchPlayers;
