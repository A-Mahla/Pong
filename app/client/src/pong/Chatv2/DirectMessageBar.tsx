import { Box, List, ListItem, ListItemButton, ListItemText, Dialog } from "@mui/material" 
import { useCallback, useContext, useEffect, useState } from "react"
import { ChatContext } from "./Chat"
import useAuth, { useFetchAuth } from "../context/useAuth"
import { Api, FetchApi } from "../component/FetchApi"
import { User } from "./Chat.types"

export function DirectMessageBar() {

	const auth = useFetchAuth()

	const {id} = useAuth()

	const [users, setUsers] = useState<User[]>([])

	const {target, setTarget, setCurrent} = useContext(ChatContext)

	const getUsersRequest: Api = {
		api: {
			input: `http://${import.meta.env.VITE_SITE}/api/users`,
			option: {
			},
		},
		auth: auth,
	}

	useEffect(() => {
		async function getUsers() {
			const {data} = await FetchApi(getUsersRequest)
			console.log('users data: ', data)
			return data
		} 
		getUsers().then(data => setUsers(data))
	}, [])

	const handleChangeTarget = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		const value = JSON.parse(e.currentTarget.getAttribute('value'))

		setTarget(value)
		setCurrent({name: '', id: 0})
	}, [])

	const userList = users.map((user) => {

		if (user.id === id)
			return null

		if (user.id === target.id) {

			return (
				<ListItem
					disablePadding	
					key={user.id}
					sx={{borderRadius: 20,bgcolor: 'lightSkyBlue'}}
					>
					<ListItemButton
						sx={{borderRadius: 10}}
						onClick={handleChangeTarget}
						value={JSON.stringify(user)}
						>
						<ListItemText
							sx={{textAlign: 'center'}}	
							>
							{user.login}
							</ListItemText>

					</ListItemButton>

				</ListItem>

			)

		} else {

			return (
				<ListItem
					disablePadding	
					key={user.id}
					sx={{borderRadius: 20,bgcolor: 'lightgrey'}}
					>
					<ListItemButton
						sx={{borderRadius: 10}}
						onClick={handleChangeTarget}
						value={JSON.stringify(user)}
						>
						<ListItemText
							sx={{textAlign: 'center'}}	
							>
							{user.login}
							</ListItemText>

					</ListItemButton>

				</ListItem>
			)
		}
	})

	return (
			<List sx={{borderRadius:2, p:0,m:2,border: 1,maxHeight:800, maxWidth:200, overflow:'auto'}}>
				{userList}
			</List>
	)
}