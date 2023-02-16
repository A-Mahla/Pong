import * as React from 'react'
import { Typography, Button, Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Swipeable from './utils/Swipeable'

interface LinkTabProps {
  label?: string;
  href?: string;
}

const header = {
	height: '4.5vw;',
}

const pongTitle = {
	fontSize: '3vw;',
}

const tabStyle = {
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

export const TabMenu = () => {
	const [value, setValue] = React.useState(1);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Tabs
			value={value}
			onChange={handleChange}
			aria-label="nav tabs example"
			variant='fullWidth'
		>
			<LinkTab label="Profile" href="/drafts" sx={tabStyle} />
			<LinkTab label="Play" href="/trash" sx={tabStyle} />
			<LinkTab label="Chat" href="/spam" sx={tabStyle} />
		</Tabs>
	)
}

const LeadPage = () => {
	return <>
		<Grid container display='flex' spacing={0} sx={header}>
			<Grid item xs={2} sx={{my: 'auto'}}>
				<Typography variant='h1' sx={pongTitle}>Pong</Typography>
			</Grid>
			<Grid item xs={8} sx={{my: 'auto'}}>
				<TabMenu />
			</Grid>
			<Grid item xs={2}>
				<Swipeable
					login={true}
					sx={{justifyContent: 'center', pl: '6vw;', mt: '0.6vw;'}}
				/>
			</Grid>
		</Grid>
	</>
}
export default LeadPage;
//		<Divider variant="middle" />
