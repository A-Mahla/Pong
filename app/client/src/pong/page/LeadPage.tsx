import * as React from 'react'
import { useEffect } from 'react'
import { Typography, Box, Paper } from '@mui/material'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import Swipeable from '/src/pong/component/Swipeable'
import Profile from '/src/pong/Profile/Profile'
import './LeadPage.css'
import useAuth, {useFetchAuth} from '/src/pong/context/useAuth'
import { FetchApi, Api } from '/src/pong/component/FetchApi'
import  GamePage  from './Game';

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

const centralProfileBoxReduce550 = {
	height: '45rem',
	p: 1,
	borderRadius: '32px',
	'&.MuiPaper-root': {
		backgroundColor: 'primary'
	},
	'@media (max-width: 550px)': {
		height: '60rem',
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
			(<Paper elevation={24}
				style={{background: "rgb(240,240,240, 0.80)"}}
				sx={
					props.index === 0 ?
					centralProfileBoxReduce550 :
					centralBoxStyle
				}
			>
				<Grid container
					className='test'
					sx={props.index === 0 ?
						{
							all: 'initial',
							ml: '3rem',
							mr: '3rem',
							mt: '1rem',
							mb: '1rem',
							height: '43rem',
							widht:  '30rem',
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							alignItems: 'center',
							justifyContent: 'center',
							'@media (max-width: 550px)': {
								height: '58rem',
							}
						} :
						{
							all: 'initial',
							ml: '3rem',
							mr: '3rem',
							mt: '1rem',
							mb: '1rem',
							height: '43rem',
							widht:  '30rem',
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							alignItems: 'center',
							justifyContent: 'center'
						}
					}>
					{props.children}
				</Grid>
			</Paper>)
		}
	</>;
}

const LeadPage = () => {

	const [value, setValue] = React.useState(1);
	const {user, id, navigate} = useAuth();
	const auth = useFetchAuth()

	useEffect(() => {
		FetchApi({
			api: {
				input: `http://${import.meta.env.VITE_SITE}/api/users/profile/pong`,
				dataType: 'null'
			},
			auth: auth,
		})
	}, [])

	const handleHome = (event: React.SyntheticEvent) => {
		event.preventDefault()
		navigate('/')
	};

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		event.preventDefault()
		setValue(newValue);
	};

	return <>
	<Box sx={{height: '7rem'}}>
			<Grid container display='flex' sx={header} columns={17}>
				<Grid item xs={4} sx={{my: 'auto'}}>
					<Grid item md={7} xs={8}>
					<Typography
						variant='h1'
						sx={pongTitle}
						onClick={handleHome}
						className="homeButton"
					>
						Pong
					</Typography>
					</Grid>
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
				{/* <Typography variant='h1'>{user}</Typography>
				<br/>
				<Typography variant='h1'>{id}</Typography> */}
						<GamePage />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<Typography variant='h1'>Chat</Typography>
			</TabPanel>
		</Box>
	</>
}
export default LeadPage;
//	<Divider variant="middle" />
