import { List, ListItem, ListItemButton, Button, FormControl, TextField} from '@mui/material'
import { Search } from '@mui/icons-material'
import { useContext, useState, useEffect, useCallback } from "react"
import { FetchApi } from "../component/FetchApi"
import useAuth, { useFetchAuth } from "../context/useAuth"
import { ChatContext } from "./Chat"
import { JoinuserData } from "./Chat.types"
import { socket } from "./Socket"

export function AddFriend() {
	const {
		isJoining, setIsSearching
			} = useContext(ChatContext)

	const {user, id} = useAuth()

	const [searchTerm, setSearchTerm] = useState('')

	const [matchingUsers, setMatchingUsers] = useState<any[]>([]) 

	const useContextAuth = useFetchAuth()
 
	useEffect(() => {

		const delayDebounce = setTimeout(async () => {
			if (searchTerm === '')
				return setMatchingUsers([]) 

			const {data} = await FetchApi({
				api: {
					input : `http://${import.meta.env.VITE_SITE}/api/users/search/${searchTerm}`,
					option : {}
				},
				auth : useContextAuth
			})

			console.log('data: ', data)

			setMatchingUsers(data.map((value) => ({
				id: value.id,
				login: value.login
			})))

		}, 800)
		return () => clearTimeout(delayDebounce)
	}, [searchTerm])	

	const handleAdd = useCallback((e) => {

		//const value = JSON.parse(e.target.value)

		//const payload: JoinUserData = {
		//	user_id: id,
		//	user_id: value.id,
		//	user_name: value.name
		//}

		//socket.emit('joinUser',  payload)

		//setIsJoining(false)
	}, [socket])	

	const handleChange = useCallback((e) => {
		setSearchTerm(e.target.value)
	}, [])

	const [userList, setUserList] = useState([])

	useEffect(() => {
		setUserList(
			matchingUsers.map((tmpUser) => {
			//let isIn = false
			const isIn = false
			console.log('matchingUsers: ', matchingUsers)

			if (!isIn) {
				return (<ListItem 
					key={tmpUser.id}
					secondaryAction={
						<Button value={JSON.stringify(tmpUser)} onClick={handleAdd}>ADD</Button>
					}
					>{tmpUser.login}</ListItem>)
			}
			return null
		})
	)

	}, [matchingUsers])

	return (
				<FormControl>
					<Button onClick={() => (setIsSearching(false))}>x</Button>
					<TextField
						size="small"
						variant="outlined"
						onChange={handleChange}
						InputProps={{
							startAdornment: (
								<Search/>
							)}}/>
					<List>
						{userList}
					</List>
				</FormControl>
	) 
}