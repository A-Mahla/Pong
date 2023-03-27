import { ReactNode } from "react"
import React from 'react';
import { useFetchAuth } from '/src/pong/context/useAuth'
import { FetchApi, Api, responseApi } from '/src/pong/component/FetchApi'
import io from "socket.io-client";

export const UserContext = React.createContext();


export const GameSocketProvider = ({children}: {children: ReactNode}) => {

	/* --- connecting to the socket.IO server --- */

	const getTok = useFetchAuth();

	const socket = io(`http://${import.meta.env.VITE_SITE}/gameTransaction`, {
		auth: {
			token: getTok.token
		}
	})

	socket.on("connect", () => {
		console.log("connected to server");
	})

	return (
		<>
		<UserContext.Provider value={socket}>
			{children}
		</UserContext.Provider>
		</>
	)
}
