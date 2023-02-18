import { Button, TextField, FormControl} from "@mui/material"
import { useRef, useCallback } from "react"
import io from "socket.io-client"

const socket = io.connect("http://localhost:5500")

export function Chat() {

	const message = useRef('')

	const handleClick = useCallback(() => {
		socket.emit('message', message.current.value)
		console.log(message.current.value)
	}, [message])

	return (
		<FormControl>
			<TextField type='text' label='message' inputRef={message}/>
			<Button onClick={handleClick}>send message</Button>
		</FormControl>
		)
}