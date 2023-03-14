import { Grid, Switch, FormControlLabel } from '@mui/material'
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
			<Switch checked={check} onChange={handleChange}/>
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
