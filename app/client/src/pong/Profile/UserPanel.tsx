import {
	Grid,
} from '@mui/material'
import { useState } from 'react'
import TFAComponent from '/src/pong/Profile/TFAComponent'
import ChangeInfo from '/src/pong/Profile/ChangeInfo'

const UserPanelGrid = () => {

	const [isAccordion, setIsAccordion] = useState<boolean>(false)

	return <>

		<Grid item xl={4} md={5} xs={12}
			sx={{
				mx: 0,
				border: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				'@media (max-width: 950px)': {
					display: 'block'
				}
			}}
		
		>
			<TFAComponent isAccordion={isAccordion} setIsAccordion={setIsAccordion}/>
		</Grid>
		<Grid item xl={8} md={7} xs={12}
			sx={{
				p: '1vw;',
				border: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<ChangeInfo isAccordion={isAccordion} setIsAccordion={setIsAccordion}/>
		</Grid>
	</>
}

export default UserPanelGrid;
