import { Button, TextField, FormControl, Paper} from "@mui/material"
import { useRef, useCallback, useState, useEffect} from "react"
import io from "socket.io-client"

const socket = io.connect("http://localhost:5500")

type message = {
	content: string,
	id?: number,
	sender: string,
}

export function Chat() {

	const message = useRef('')

	const [messages, setMessages] = useState<string[]>([])

	const handleClick = useCallback(() => {

		socket.emit('message', message.current.value, function(response) {
			console.log('RESPONSE',response);
			
		})
		console.log(message.current.value)
	}, [message])

	const messageListener = (...args) => {

			const newMessage = {
				content: args[0],
				sender: "alorain" 
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
					{<ul>
						{messages.map((message) => <li key={message.content}>{message.content}</li>)}
					</ul>}

				</Paper>
				<TextField type='text' label='message' inputRef={message}/>
				<Button onClick={handleClick}>send message</Button>

			</Paper>
		</FormControl>
		)
}