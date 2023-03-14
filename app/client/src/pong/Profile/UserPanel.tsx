import {
	Grid,
	Switch,
	FormControlLabel,
	Accordion,
	AccordionSummary,
	AccordionDetails
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from 'react'

const UserPanelGrid = () => {

	const [check, setCheck] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCheck(e.target.checked)
	}

	return <>

		<Grid item xl={4} md={4} xs={4}
			sx={{
				p: '1vw;',
				border: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		
		>
			<Accordion elevation={0}>
				 <AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<FormControlLabel
						disable typography
						control={<Switch checked={check} onChange={handleChange}/>}
						label="Activate 2FA"
					/>
				</AccordionSummary>
			</Accordion>
		</Grid>

		<Grid item xl={4} md={4} xs={4}
			sx={{
				p: '1vw;',
				border: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>

		</Grid>

		<Grid item xl={4} md={4} xs={4}
			sx={{
				p: '1vw;',
				border: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			
		</Grid>
	</>

}

export default UserPanelGrid;
