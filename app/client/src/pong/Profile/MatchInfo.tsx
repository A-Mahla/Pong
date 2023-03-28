import {
	Box,
	Grid,
	Typography,
	Button,
} from '@mui/material'
import useMediaQuery from "/src/pong/hooks/useMediaQuery"
import { useState } from 'react'
import * as React from 'react';
import { FetchApi, Api } from '/src/pong/component/FetchApi'
import useAuth, { useFetchAuth } from '/src/pong/context/useAuth'
import GppGoodIcon from '@mui/icons-material/GppGood'
import GppBadIcon from '@mui/icons-material/GppBad';
import TFAComponent from '/src/pong/Profile/TFAComponent'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

type MatchInfoProps = {
	defeat: number,
	victory: number,
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 10,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: theme.palette.mode === 'light' ? '#1d5fa9' : '#308fe8',
		},
	})
);

const MatchInfo = (props: MatchInfoProps) => {


	return <>
			<Grid item display="grid" justifyContent="center" xs={4}
				sx={{
					position: 'relative',
					top: '3rem',
					height: '20rem',
					py: '1vw;',
					px: '2vw;',
					border: 1
				}
			}>
				<Grid item xs={12}>
					<GppGoodIcon style={{color: '#213547'}} sx={{height: '10rem', width: '10rem'}}/>
				</Grid>
				<Grid item xs={12}>
					<Typography align="center" variant='h2'>
						{props.victory}
					</Typography>
				</Grid>
			</Grid>

			<Grid item xs={4}
				sx={{
					position: 'relative',
					top: '3rem',
					height: '20rem',
					py: '1vw;',
					px: '2vw;',
					border: 1
				}
			}>
				<Grid item xs={12} sx={{height: "50%"}}>
					<Grid xs={12} sx={{height: "60%"}}>
						<Typography align="center" variant='h2'>
						</Typography>
					</Grid>
					<Grid xs={12}>
						<BorderLinearProgress variant="determinate" value={50} />
					</Grid>
				</Grid>
				<Grid item xs={12}>
				</Grid>
			</Grid>
			<Grid item display="grid" justifyContent="center" xs={4}
				sx={{
					position: 'relative',
					top: '3rem',
					height: '20rem',
					py: '1vw;',
					px: '2vw;',
					border: 1
				}
			}>
				<Grid item xs={12}>
					<GppBadIcon style={{color: '#cd384a'}} sx={{height: '10rem', width: '10rem'}}/>
				</Grid>
				<Grid item xs={12}>
					<Typography align="center" variant='h2'>
						{props.defeat}
					</Typography>
				</Grid>
			</Grid>
		
	</>

}
export default MatchInfo
