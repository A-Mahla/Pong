import Avatar from '@mui/material/Avatar';
import useAuth, {useFetchAuth} from '/src/pong/context/useAuth';
import { FetchApi, Api, refreshRequest } from '/src/pong/component/FetchApi'
import React, { createRef, useState, useEffect } from "react";
import { SxProps } from '@material-ui/system';
import axios from 'axios';

type PropsAvatar = {
	avatar?: string,
	sx: SxProps
}


const FetchAvatar = (props: PropsAvatar) => {

	const [fetched, setFetched] = useState<boolean>(false)
	const inputFileRef = createRef(null)
	const [image, setImage] = useState<URL>(null)
	const auth = useAuth()

	useEffect(() => {

		async function fetching() {
		
			try {

				if(props.avatar) {

					const result = await axios.get(

						`http://${import.meta.env.VITE_SITE}/api/users/profile/avatar/download/${props.avatar}`,
						{ 
							withCredentials: true,
							responseType: 'blob',
							headers: {
								Authorization: `Bearer ${response.token}`,
							}
						}
					)

					await setImage(await URL.createObjectURL(result.data))
				}
			} catch(err) {
				try {

					const refresh = await refreshRequest()

					if (refresh.response.status !== 200 && refresh.response.status !== 304) {
						auth.setToken('');
						auth.setUser('');
						auth.setId(0);
						auth.setIntraLogin('');
						auth.navigate('/login');
						return
					}
					
					auth.setToken(refresh.data['aT']);

					const result2 = await axios.get(

						`http://${import.meta.env.VITE_SITE}/api/users/profile/avatar/download/${props.avatar}`,
						{ 
							withCredentials: true,
							responseType: 'blob',
							headers: {
								Authorization: `Bearer ${refresh.data['aT']}`
							}
						}
					)

					await setImage(await URL.createObjectURL(result2.data))
				} catch(err) {
					console.log(err)
				}
			} finally {
				setFetched(true);
			}
		}
		fetching()

	}, [props.avatar])

	return <>
		{!fetched ? null :
			<Avatar
				alt="other_avatar"
				src={image}
				sx={props.sx}
			/>
		}
	</>

}
export default FetchAvatar;
