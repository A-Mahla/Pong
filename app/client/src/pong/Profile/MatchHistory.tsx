
interface Data {
	calories: number;
	carbs: number;
	dessert: string;
	fat: number;
	id: number;
	protein: number;
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
