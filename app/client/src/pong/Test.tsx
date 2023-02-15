import { useState, useCallback, useEffect} from 'react'

export function Test () {

	const [fetched, setFetched] = useState(false)

	const [users, setUsers] = useState([])

	const fetchData = () => {
		fetch("http://localhost:5500/api/users")
		.then(response => response.json())
		.then(data => {
			console.log(data)
			 3
			setUsers(data["body"])
			setFetched(true)
		} )
	}

	useEffect(() => {
		setTimeout(() => {fetchData()}, 2000)
	}, [])



	return (
		<div>
			{ fetched ?  <div>users</div> : <div>fetching</div>}
		</div>
	)
}