import * as React from 'react'
import { Typography, Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import Swipeable from './utils/Swipeable'

interface LinkTabProps {
  label?: string;
  href?: string;
}

const header = {
	height: '4vw;',
}

const pongTitle = {
	fontSize: '3vw;',
}

const tabStyle = {
}

const centralBoxStyle = {
	height: '45rem',
	border: 1,
	boxShadow: 10,
	borderRadius: '32px',
}



function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return <>
		{value === index && 
			(<Box sx={centralBoxStyle}>
				<Typography sx={{textAlign: 'center', pt: '21rem'}}>
					{children}
				</Typography>
			</Box>)
		}
	</>;	
}

const LeadPage = () => {

	const [value, setValue] = React.useState(1);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return <>
	<Box sx={{height: '7rem'}}>
			<Grid container display='flex' sx={header} columns={17}>
				<Grid item xs={4} sx={{my: 'auto'}}>
					<Typography variant='h1' sx={pongTitle}>Pong</Typography>
				</Grid>
				<Grid item xs={9} sx={{my: 'auto'}}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="nav tabs example"
					variant='fullWidth'
				>
					<Tab label="Profile" sx={tabStyle} />
					<Tab label="Play" sx={tabStyle} />
					<Tab label="Chat" sx={tabStyle} />
				</Tabs>
				</Grid>
				<Grid item xs={3}>
					<Swipeable
						login={true}
						sx={{
							position: 'absolute',
							right: '3rem',
						}}
					/>
				</Grid>
			</Grid>
		</Box>
			<Box>
				<TabPanel value={value} index={0}>Profile</TabPanel>
				<TabPanel value={value} index={1}>Play</TabPanel>
				<TabPanel value={value} index={2}>Chat</TabPanel>
			</Box>
	</>
}
export default LeadPage;
//	<Divider variant="middle" />
