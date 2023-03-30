import { 
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	Typography,
} from '@mui/material'
import useAuth, { useFetchAuth } from '/src/pong/context/useAuth'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';

interface Data {
	you: string;
	score : number;
	rival: number;
}

function createData(
	you: string;
	score : number;
	rival: number;
): Data {
	return { you, score, rival };
}


type MatchHistoryProps = {
	open: boolean,
	setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const MatchHistory = (props: MatchInfoProps) => {

	const handleClose = () => {
		props.setOpen(false);
	}

	return (
		<>
		{!fetched ?
				null
			: (
				<>
					<Dialog open={props.open} onClose={handleClose}
						 PaperProps={{
							style: {
								borderRadius: '32px',
								height: '28rem',
							}
						}}
					>
						<DialogTitle>
							<Box
								display="flex"
								justifyContent="center"
								alignItems="center"
								sx={{mt: 4}}
							>
								<Typography
									component={'span'}
									variant='subtitle2'
									align="center"
									style={{color: '#213547'}}
								>
									Two-Factor Authentication
								</Typography>
							</Box>
							<Divider variant='middle'/>
						</DialogTitle>
						<DialogContent>
						</DialogContent>
					</Dialog>
				</>
			)}
			</>

}
