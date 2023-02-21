import { Button, TextField, FormControl, Paper, Box} from "@mui/material"
import { useRef, useCallback, useState, useEffect} from "react"
import io from "socket.io-client"
import Cookies from 'js-cookie'
import './Chat.css'

const socket = io.connect("http://localhost:5500")

type MessageData = {
	content: string,
	sender: string,
	time?: string
}

export function Chat() {

	Cookies.set('login', 'alorain')

	const message = useRef('')

	const [messages, setMessages] = useState<MessageData[]>([])

	const handleClick = useCallback(() => {

		const messageData = {
			content: message.current.value,
			sender: Cookies.get('login'),
		} 

		socket.emit('message', messageData, function(response) {
			console.log('RESPONSE',response);
			
		})
		console.log(message.current.value)
	}, [message])

	const messageListener = (...args) => {

			const newMessage = {
				...args[0],
				time: 
					new Date(Date.now()).getHours() + 
					':' + 
					new Date(Date.now()).getMinutes(),
			}

			setMessages([...messages, newMessage]);
			console.log(messages);
			console.log("args: ", args);
	}

	useEffect(() => {
		socket.on('message', messageListener)
		return () => {
			socket.off("message", messageListener)
		}
	})


	return (
		<FormControl>
			<Paper>
				<Paper>
					{messages.map((message, index) => (<Box key={index} className='messageSent'>{message.content} + {message.time}</Box>))}

				</Paper>
				<TextField type='text' placeholder='write a message...' inputRef={message}/>
				<Button onClick={handleClick}>send message</Button>

			</Paper>
		</FormControl>
		)
}