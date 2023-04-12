import React, { useState, useRef, useEffect, useContext, useCallback, HtmlHTMLAttributes } from 'react';
import { Avatar, Box, Paper, TextField, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/system';
import { ChatContext } from './Chat';
import useAuth from '../context/useAuth';
import { socket } from './Socket';
import { MessageData } from './Chat.types';
import FetchAvatar from '../component/FetchAvatar';


const ChatInputField = styled(TextField)(({ theme }) => ({
	width: '100%',
}));

function ChatInput() {

	const [inputValue, setInputValue] = useState('');

	const { id } = useAuth()

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setInputValue(event.target.value);
	};

	const {
		current,
		target,
	} = useContext(ChatContext)

	const handleSubmit = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		if (target.id !== 0) {
			console.log(inputValue);

			const payload: MessageData = {
				content: inputValue,
				sender_id: id,
				recipient_id: target.id
			}

			setInputValue('')

			socket.emit('directMessage', payload)
		}
		else if (current.id !== 0) {
			const messageData: MessageData = {
				content: inputValue,
				sender_id: id,
				room: {
					id: current.id,
					name: current.name
				}
			}

			setInputValue('')

			socket.emit('roomMessage', messageData)
		}
	}, [socket, target, current, inputValue])

	//multiline #I delete it from ChatInputField because when my imput is too long the behavior is horrible
	return (
		<ChatInputField
			fullWidth
			placeholder="Type your message here..."
			value={inputValue}
			onChange={handleInputChange}
			onKeyDown={(e) => {
				//console.log(e)
				if (e.key === 'Enter'/*  && onSubmit */) {
					handleSubmit(e);
					setInputValue('');
					e.preventDefault();
				}
			}}

			InputProps={{
				autoComplete: 'off',
				autoCorrect: 'off',
			}}
		/>
	);
}

const ChatBox = styled(Paper)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	borderRadius: 0,
	overflow: 'hidden',
	boxShadow: 'none',
	border: `1px solid ${theme.palette.grey[300]}`,
	position: 'relative', /* add position relative */
	height: '600px',
	width: '100%',
	maxWidth: '100%'
}));

const ChatHeader = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	height: 32,
	backgroundColor: theme.palette.background.paper,
	borderBottom: `1px solid ${theme.palette.grey[300]}`,
	padding: theme.spacing(2),
}));

const ChatBody = styled(Box)({
	flex: 1,
	overflow: 'auto',
	padding: '16px',
	paddingBottom: 64,
	flexDirection: 'column-reverse', /* add this CSS property to reverse the order of child elements */

});

const ChatFooter = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	height: 64,
	backgroundColor: theme.palette.background.paper,
	position: 'absolute', /* add position absolute */
	bottom: 0, /* position it at the bottom */
	left: 0, /* align it to the left */
	right: 0, /* align it to the right */
}));

export const MessagesBox = () => {
	const chatBodyRef = useRef<HTMLDivElement>(null)

	const { id } = useAuth()

	const {
		rooms, directMessages,
		current,
		target,
	} = useContext(ChatContext)

	const [messageList, setMessageList] = useState<React.ReactNode[]>([])

	useEffect(() => {
		if (target.id !== 0) {
			console.log('directMessages: ', directMessages)
			setMessageList(directMessages.map((message, index) => {
				//(target.id === message.recipient_id ) ?
				if (message.sender_id === id || message.recipient_id === id) {

					return (<Box key={index} style={{ display: 'flex', justifyContent: message.sender_id === id ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
						<Box style={{ maxWidth: '80%', backgroundColor: message.sender_id === id ? '#DCF8C6' : 'lightgrey', padding: '8px 12px', borderRadius: '12px', wordWrap: 'break-word' }}>{message.content}</Box>
					</Box>)
				}
				return null
				//<ListItem key={message.id}>
				//	<ListItemText  className='messageSent'>{message.sender_id} {message.content} {message.createdAt}</ListItemText>
				//</ListItem>
				//:
				//<ListItem key={message.id}>
				//	<ListItemText  className='messageReceived'>{message.sender_id} {message.content} {message.createdAt}</ListItemText>
				//</ListItem>)
			}))

		}
		else if (current.id !== 0) {
			const room = rooms.find((room) => {
				return room.room_id === current.id
			})

			if (room === undefined) {
				setMessageList([])
			}
			else {
				setMessageList(room.messages.map((message, index) => {
					return (
						<Box key={index} style={{ display: 'flex', justifyContent: message.sender_id === id ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
							<Box style={{ maxWidth: '80%', backgroundColor: message.sender_id === id ? '#DCF8C6' : '#fff', padding: '8px 12px', borderRadius: '12px', wordWrap: 'break-word' }}>{message.content}</Box>
						</Box>
					)
				}))
			}
		}
	}, [target, current, directMessages, rooms])

	useEffect(() => {
		if (chatBodyRef.current) {
			chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
		}
	}, [messageList]);

	return (
		<ChatBox>
			<ChatHeader>
				<FetchAvatar avatar={target.id !== 0 ? target.avatar : ''} sx={null} />
			</ChatHeader>
			<ChatBody ref={chatBodyRef}>
				{messageList}
			</ChatBody>
			<ChatFooter>
				<ChatInput />
			</ChatFooter>
		</ChatBox>
	);
};
