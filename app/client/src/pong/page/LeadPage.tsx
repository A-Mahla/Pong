import * as React from 'react'
import { Typography, Box, Paper } from '@mui/material'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import Swipeable from '/src/pong/component/Swipeable'
import Profile from '/src/pong/Profile/Profile'
import './LeadPage.css'

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
	p: 1,
	borderRadius: '32px',
	'&.MuiPaper-root': {
		backgroundColor: 'primary'
	}
}

type TabPanelProps = {
	value: number,
	index: number,
	children: React.ComponentNode
}

function TabPanel(props: TabPanelProps) {


  return <>
		{props.value === props.index && 
			(<Paper elevation={24} sx={centralBoxStyle}>
				<Grid container
					className='test'
					sx={{
						all: 'initial',
						ml: '3rem',
						mt: '3rem',
						mb: '3rem',
						mr: '3rem',
						height: '39rem',
						widht:  '30rem',
						display: 'flex',
						flexDirection: 'row',
						flexWrap: 'wrap'
					}}>
					{props.children}
				</Grid>
			</Paper>)
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
			<TabPanel value={value} index={0}>
				<Profile/>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<Typography variant='h1'>PLAY</Typography>
			</TabPanel>
			<TabPanel value={value} index={2}>
				<Typography variant='h1'>Chat</Typography>
			</TabPanel>
		</Box>
	</>
}
export default LeadPage;
//	<Divider variant="middle" />
