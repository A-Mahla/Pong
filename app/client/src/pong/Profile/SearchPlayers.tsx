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
import useAuth, { useFetchAuth } from '/src/pong/context/useAuth'
import { FetchApi, Api } from '/src/pong/component/FetchApi'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import * as React from 'react';

type matchHistoryPayload = {
	index: number,
	l1: string;
	s1 : number;
	l2 : string;
	s2: number;
}

function timeout(delay: number) {
	return new Promise( res => setTimeout(res, delay) );
}

function isNumberOrString(str) {
	return /^([0-9a-zA-Z_]){3,20}$/.test(str);
}


const GridPlayers = ({rows}: {rows: matchHistoryPayload[]}) => {

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		await timeout(1000)
		if (e.target.value && isNumberOrString(e.target.value)) {
			console.log('goood')
		}
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


				</Grid>

				<Divider orientation="vertical" flexItem />

				<Grid item xs={7}
					display="flex"
					justifyContent="center"
					alignItems="center"
				>

					<Typography
						align="center"
						style={{color: '#aab7b8'}}
					>
						no profile selected
					</Typography>

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

	useEffect(() => {

		async function fetching() {
			console.log('test')
		}
		fetching()

	}, [user])

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
