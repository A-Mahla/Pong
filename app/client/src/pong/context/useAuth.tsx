import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useLocation, createSearchParams } from "react-router-dom";
import { originalRequest, refreshRequest, responseApi } from "/src/pong/component/FetchApi"

interface AuthContextType {
	user: string;
	intraLogin?: string;
	token: string;
	setUser: React.Dispatch<React.SetStateAction<string>>,
	setToken: React.Dispatch<React.SetStateAction<string>>,
	loading: boolean;
	error?: Error;
	authLogin: (login: string, password: string) => void;
	authLogout: () => void;
	authSignup: (login: string, password: string) => void;
	authLogIntra: (url: URL) => void;
	authSignIntra: (url: URL) => void;
}

export type fetchContext = {
	token: string,
	setUser: React.Dispatch<React.SetStateAction<string>>,
	setToken: React.Dispatch<React.SetStateAction<string>>,
}

const AuthContext = createContext<AuthContextType>(
	{} as AuthContextType
);

export function AuthProvider({children}: {children: ReactNode}): JSX.Element {

	const [user, setUser] = useState<string>('');
	const [intraLogin, setIntraLogin] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const [error, setError] = useState<Error>();
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (error)
			setError(null);
	}, [location.pathname]);

	useEffect( () => {
		async function auth()  {

			try {


				if ( location.pathname === '/redirect' && location.search ) {
					navigate(location)
					return ;
				}
				if ( location.pathname === '/gameTest' ) {
					navigate(location)
					return ;
				}

				const url = `http://${import.meta.env.VITE_SITE}/api/users/profile/auth`;
					const requestOption = {
					method: "GET",
					headers: { 'Authorization': `Bearer ${token}` },
				}

				const response1: responseApi = await originalRequest({
					input: url,
					option: requestOption,
				});

				if (response1.response.statusText === "Unauthorized") {
					const refresh: responseApi = await refreshRequest();

					if (refresh.response.status !== 200 && refresh.response.status !== 304) {
						setUser('');
						setToken('');
						setIntraLogin('')
						if ( location.pathname === '/login'
							|| location.pathname === '/pong' )
							navigate('/login')
						else
							navigate('/');
					}
					else {

						setUser(refresh.data['login']);
						setToken(refresh.data['aT']);

						const response2: responseApi = await originalRequest({
							input: url,
							option: {
								method: "GET",
								headers: { 'Authorization': `Bearer ${refresh.data['aT']}` },
							},
						});
						setUser(response2.data['login']);
					}
				}
				else
					setUser(response1.data['login']);

			} catch (err) {
				console.log(err);
			} finally {
				setLoadingInitial(false)
			}
		}
		auth();
		return undefined

	}, [])

	async function authLogIntra(url: URL) {

		try {
			const response = await fetch(url)
			const data = await response.json()
			console.log(data);
			console.log(response);
			if (response.status == 200) {
				if (data['signedIn']) {
					setUser(data.user['login'])
					setToken(data['token'])
					navigate('/pong')
				}
				setIntraLogin(data['intraLogin'])
			} else {
				navigate('/login')
			}
		} catch(err) {
			console.log(err);
		}
	}

	async function authSignIntra(url: URL) {


		const requestOptions = {
			method: "POST",
		}

		try {
			const response = await fetch(url, requestOptions)
			const data = await response.json()
			if ( response.status === 201) {
				setUser(data['login'])
				setToken(data['aT']);
				navigate('/pong')
			} else {
				setUser('');
				setToken('');
				setIntraLogin('')
				navigate('/login')
			}
		} catch(err) {
			console.log(err);
		} finally {
			setLoading(true);
		}
	}

	async function authSignup(login: string, password: string) {

		const requestOptions = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			 },
			body: JSON.stringify({
				login: login,
				password: password,
			}),
		}

		try {

			const {response, data} = await originalRequest({
				input: `http://${import.meta.env.VITE_SITE}/api/auth/signup`,
				option: requestOptions,
			});
			if ( response.status === 201) {
				setUser(login);
				setToken(data['aT']);
				navigate('/pong')
			}

		} catch (err) {
			console.log(err);
		} finally {
			setLoading(true);
		}

	}


	async function authLogin(login: string, password: string) {

		const requestOptions = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			 },
			body: JSON.stringify({
				login: login,
				password: password,
			}),
		}


		try {
			const {response, data} = await originalRequest({
				input: `http://${import.meta.env.VITE_SITE}/api/auth/signin`,
				option: requestOptions,
			});
			if ( response.status === 201) {
				setUser(login);
				setToken(data['aT']);
				navigate('/pong')
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(true);
		}
	}

	async function authLogout() {

		try {
			const response = await fetch(
				`http://${import.meta.env.VITE_SITE}/api/auth/logout`,
				{
					method: "POST",
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						login: user,
					}),
				}
			);

			if ( response.status === 201) {
				setUser('');
				setToken('');
				setIntraLogin('')
				navigate('/')
			}

		} catch (err) {
			console.log(err);
		}
	}

	const memoValue = useMemo(
		() => ({
			user,
			intraLogin,
			token,
			setUser,
			setToken,
			loading,
			error,
			authLogin,
			authLogout,
			authSignup,
			authLogIntra,
			authSignIntra,
		}),
		[user, intraLogin, token, loading, error]
	);

	return (
		<AuthContext.Provider value={memoValue}>
		  {!loadingInitial && children}
		</AuthContext.Provider>
  );
}

export function useFetchAuth() {
	const {token, setToken, setUser } = useContext(AuthContext);
	return {token, setToken, setUser};
}

export default function useAuth() {
	return useContext(AuthContext);
}
