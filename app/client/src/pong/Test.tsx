import { useState, useCallback, useEffect} from 'react'
import Cookies from "js-cookie"

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

	const [cookies, setCookies] = useState('')

	useEffect(() => {
		setTimeout(() => {fetchData()}, 2000)
	}, [])


	const clearCookies = useCallback(() => {
		setCookies('')
		Cookies.remove('name')
		Cookies.remove('login')
	}, [document.cookie])
	
	const getCookies = useCallback(() => {
		setCookies(document.cookie)
		console.log('name', Cookies.get('name'));
		console.log('login', Cookies.get('login'));
		console.log('age', Cookies.get('age'));
		
	}, [document.cookie])

	const addCookies = useCallback(() => {
		Cookies.set('name', 'augustin')
		Cookies.set('login', 'alorain', {expires: 7})
	}, [])


	return (
		<div>
			{ fetched ?  <div>users</div> : <div>fetching</div>}
			<button onClick={addCookies}>set Cookies</button>
			<button onClick={clearCookies}>clear Cookies</button>
			<button onClick={getCookies}>get Cookies</button>
			<p>{cookies}</p>

		</div>
	)
}