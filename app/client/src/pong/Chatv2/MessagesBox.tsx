//import { Box, List, ListItem, ListItemButton, ListItemText, Dialog, TextField, Button, AppBar } from "@mui/material" 
//import { useContext, useState, useEffect, useCallback, useRef } from "react"
//import useAuth from "../context/useAuth"
//import { ChatContext } from "./Chat"
//import './Chat.css'
//import { MessageData } from "./Chat.types"
//import { socket } from "./Socket"
//import { styled } from '@mui/system' 
//
//export function MessagesBox() {
//
//	const {
//		rooms, directMessages,
//		current, setCurrent,
//		target, setTarget,
//			} = useContext(ChatContext)
//
//	const [messageList, setMessageList] = useState([])
//
//	useEffect(() => {
//		if (target.id !== 0) {
//			console.log(directMessages)
//			setMessageList(directMessages.map((message) => 
//							(target.id === message.recipient_id ) ?
//								<ListItem key={message.id}>
//									<ListItemText  className='messageSent'>{message.sender_id} {message.content} {message.createdAt}</ListItemText>
//								</ListItem>
//								:
//								<ListItem key={message.id}>
//									<ListItemText  className='messageReceived'>{message.sender_id} {message.content} {message.createdAt}</ListItemText>
//								</ListItem>)
//									)
//		}
//		else if (current.id !== 0) {
//			const room = rooms.find((room) => {
//				return room.id === current.id
//			})
//
//			if (room === undefined) {
//				setMessageList([])
//			}
//			else {
//				setMessageList(room.messages.map((message) => {
//						return (
//									<ListItem key={message.id}>
//										<ListItemText  className='messageReceived'>{message.sender_id} {message.content} {message.createdAt}</ListItemText>/
//									</ListItem>
//						)
//					}))
//				}	
//		}
//	}, [target, current, directMessages, rooms])
//
//	const message = useRef('')
//
//	const {id} = useAuth()
//
//	const handleSubmit = useCallback(() => {
//		if (target.id !== 0) {
//			console.log(message.current.value);
//
//			const payload: MessageData = {
//				content: message.current.value,
//				sender_id: id,
//				recipient_id: target.id	
//			}
//
//			message.current.value = ''
//
//			socket.emit('directMessage', payload)
//		}
//		else if (current.id !== 0) {
//			const messageData : MessageData = {
//				content: message.current.value,
//				sender_id: id,
//				room: {
//					id: current.id,
//					name: current.name
//				}
//			}
//
//			message.current.value = ''
//
//			socket.emit('roomMessage', messageData)
//		}
//	}, [socket, target, current])
//
//	const ChatBody = styled(Box)({
//		flex: 1,
//		overflow: 'auto',
//		padding: '16px',
//	  });
//	
//	const ChatFooter = styled(Box)(({ theme }) => ({
//		display: 'flex',
//		alignItems: 'center',
//		height: 64,
//		backgroundColor: theme.palette.background.paper,
//		borderTop: `1px solid ${theme.palette.grey[300]}`,
//		padding: theme.spacing(2),
//	  }));
//
//	return (
//		<ChatBody>
//			<List>
//				{messageList}
//			</List>
//			{
//				target.id !== 0 || current.id !== 0 ?
//				(<ChatFooter
//					sx={{position: 'sticky', bottom: 0}}
//					>
//					<TextField inputRef={message} placeholder={target.id !== 0 ? target.login : current.name}/>
//					<Button onClick={handleSubmit}>send</Button>
//				</ChatFooter>) : null
//			}
//
//		</ChatBody>	
//	)
//}
import { useState, useRef, useEffect } from 'react';
import { Avatar, Box, Paper, TextField } from '@mui/material';
import { styled } from '@mui/system';

const ChatBox = styled(Paper)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	height: '50vh',
	borderRadius: 0,
	overflow: 'hidden',
	boxShadow: 'none',
	border: `1px solid ${theme.palette.grey[300]}`,
	position: 'relative', /* add position relative */
	width: '100%' ,
	maxWidth: '100%'
  }));
  
  const ChatHeader = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	height: 64,
	backgroundColor: theme.palette.background.paper,
	borderBottom: `1px solid ${theme.palette.grey[300]}`,
	padding: theme.spacing(2),
  }));
  
  const ChatBody = styled(Box)({
	flex: 1,
	overflow: 'auto',
	padding: '16px',
	paddingBottom: 64,
	//flexDirection: 'column-reverse', /* add this CSS property to reverse the order of child elements */

  });
  
  const ChatFooter = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	height: 64,
	backgroundColor: theme.palette.background.paper,
	borderTop: `1px solid ${theme.palette.grey[300]}`,
	//padding: theme.spacing(2),
	position: 'absolute', /* add position absolute */
	bottom: 0, /* position it at the bottom */
	left: 0, /* align it to the left */
	right: 0, /* align it to the right */
  }));

const ChatInput = styled(TextField)(({ theme }) => ({
  flex: 1,
  marginRight: theme.spacing(2),
  borderRadius: '12px',
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const MessagesBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatBodyRef = useRef()

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue) {
      setMessages((prevMessages) => [...prevMessages, { text: inputValue, sender: 'me' }]);
      setInputValue('');
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ChatBox>
      <ChatHeader>
        <Avatar />
      </ChatHeader>
      <ChatBody ref={chatBodyRef}>
        {messages.map((message, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
            <div style={{ maxWidth: '80%', backgroundColor: message.sender === 'me' ? '#DCF8C6' : '#fff', padding: '8px 12px', borderRadius: '12px' }}>{message.text}</div>
          </div>
        ))}
      </ChatBody>
      <ChatFooter>
        <ChatInput placeholder="Type a message..." value={inputValue} onChange={(event) => setInputValue(event.target.value)} onKeyPress={handleInputKeyPress} variant="outlined" />
      </ChatFooter>
    </ChatBox>
  );
};
