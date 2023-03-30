import { Box, List, ListItem, ListItemButton, ListItemText, Dialog } from "@mui/material" 
import { useCallback, useContext, useEffect, useState } from "react"
import { ChatContext } from "./Chat"
import useAuth, { useFetchAuth } from "../context/useAuth"
import { Api, FetchApi } from "../component/FetchApi"
import { User } from "./Chat.types"
import { AddFriend } from "./AddFriend"
import { FriendRequests } from "./FriendRequests"

export function DirectMessageBar() {

	const auth = useFetchAuth()

	const {id} = useAuth()


	const {target, setTarget, setCurrent, isSearching, setIsSearching, friends, setFriends} = useContext(ChatContext)

	const handleChangeTarget = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		const value = JSON.parse(e.currentTarget.getAttribute('value'))

		setTarget(value)
		setCurrent({name: '', id: 0})
	}, [])

	const friendList = friends.map((friendRelation) => {
		let friend: {login: string, id: number}

		if (friendRelation.user1Id == id) {
			friend.id = friendRelation.user2Id
			friend.login = friendRelation.user2Login
		} 
		else {
			friend.id = friendRelation.user1Id
			friend.login = friendRelation.user1Login
		}
		if (friendRelation.status === 'accepted') {
			if (target.id === friend.id) {
				return (
					<ListItem
						disablePadding	
						key={friend.id}
						sx={{borderRadius: 20,bgcolor: 'lightSkyBlue'}}
						>
						<ListItemButton
							sx={{borderRadius: 10}}
							onClick={handleChangeTarget}
							value={JSON.stringify(friend)}
							>
							<ListItemText
								sx={{textAlign: 'center'}}	
								>
								{friend.login}
								</ListItemText>

						</ListItemButton>

					</ListItem>
				)
			}
			else {
				return (
					<ListItem
						disablePadding	
						key={friend.id}
						sx={{borderRadius: 20,bgcolor: 'lightgrey'}}
						>
						<ListItemButton
							sx={{borderRadius: 10}}
							onClick={handleChangeTarget}
							value={JSON.stringify(friend)}
							>
							<ListItemText
								sx={{textAlign: 'center'}}	
								>
								{friend.login}
								</ListItemText>

						</ListItemButton>

					</ListItem>
				)

			}
		}
	})

	const handleAddFriend = useCallback(() => {
		isSearching ? setIsSearching(false) : setIsSearching(true)

	}, [isSearching])

	const [isInFriendRequests, setIsInFriendRequests] = useState(false)

	const handleCheckFriendRequests = useCallback(() => {
		isInFriendRequests ? setIsInFriendRequests(false) : setIsInFriendRequests(true)

	}, [isInFriendRequests])

	return (
			<List sx={{borderRadius:2, p:0,m:2,border: 1,maxHeight:800, maxWidth:200, overflow:'auto'}}>
				{friendList}
				<ListItem
					disablePadding	
					sx={{borderRadius: 20,bgcolor: 'lightgrey'}}
					>
					<ListItemButton
						sx={{borderRadius: 10}}
						onClick={handleAddFriend}
						>
						<ListItemText
							sx={{textAlign: 'center'}}	
							>
							addFriend
							</ListItemText>

					</ListItemButton>

				</ListItem>

				<ListItem
					disablePadding	
					sx={{borderRadius: 20,bgcolor: 'lightgrey'}}
					>
					<ListItemButton
						sx={{borderRadius: 10}}
						onClick={handleCheckFriendRequests}
						>
						<ListItemText
							sx={{textAlign: 'center'}}	
							>
							Friend Requests
							</ListItemText>

					</ListItemButton>

				</ListItem>

			<Dialog
				open={isSearching}
				onClose={() => setIsSearching(false) }
				>
					<AddFriend/>
				</Dialog>

			<Dialog
				open={isInFriendRequests}
				onClose={() => setIsInFriendRequests(false) }
				>
					<FriendRequests/>
				</Dialog>
			</List>
	)
}