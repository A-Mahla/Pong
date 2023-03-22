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
import { FetchApi, Api } from '/src/pong/component/FetchApi'

interface AuthContextType {
	user: string;
	id: number;
	intraLogin?: string;
	token: string;
	setUser: React.Dispatch<React.SetStateAction<string>>,
	setToken: React.Dispatch<React.SetStateAction<string>>,
	setIntraLogin: React.Dispatch<React.SetStateAction<string>>,
	setId: React.Dispatch<React.SetStateAction<number>>,
	loading: boolean;
	error?: Error;
	authLogin: (login: string, password: string) => Promise<string | undefined>;
	authLogout: () => void;
	authSignup: (login: string, password: string) => Promise<string | undefined>;
	authLogIntra: (url: URL) => void;
	authSignupIntra: (url: URL) => void;
	twoFA: (url: URL) => void;
	navigate: () => "POP" | "PUSH" | "REPLACE",
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
	const [id, setId] = useState<number>(0);
	const [intraLogin, setIntraLogin] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const [error, setError] = useState<Error>();
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (error)
			setError(undefined);
	}, [location.pathname]);

	useEffect( () => {

		async function auth()  {

			try {


				if ( location.pathname === '/redirect' && location.search ) {
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
						setId(0);
						setToken('');
						setIntraLogin('')
						if ( location.pathname === '/login'
							|| location.pathname === '/pong' || location.pathname === '/gameTest' )
							navigate('/login')
						else
							navigate('/');
						return ;
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
						setId(response2.data['id'])

					}
				} else {
					setUser(response1.data['login']);
					setId(response1.data['id'])
				}

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
			if (response.status == 200) {
				if (data['signedIn']) {
					if (data['token'] === '2faActivate') {
						setUser(data['login'])
						setId(data['id'])
						return '2FA'
					} else {
						setUser(data['login'])
						setId(data['id'])
						setToken(data['token'])
						navigate('/pong')
					}
				}
				setIntraLogin(data['intraLogin'])
				return 'else'
			} else {
				navigate('/login')
			}
		} catch(err) {
			console.log(err);
		}
	}

	async function authSignupIntra(url: URL) {


		const requestOptions = {
			method: "POST",
			headers: {
      			"Content-Type": "application/json",
			},
			body: JSON.stringify({
				intraLogin: intraLogin,
			}),
		}

		try {
			const response = await fetch(url, requestOptions)
			const data = await response.json()
			if ( response.status === 201) {
				setUser(data['login'])
				setId(data['id'])
				setToken(data['aT']);
				navigate('/pong')
				return ''
			} else if ( data['message'] === 'login unavailable'){
				return data['message']
			} else {
				setUser('');
				setId(0);
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
				setId(data['id'])
				setToken(data['aT']);
				navigate('/pong')
				return ''
			}
			return data['message']
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
				if (data['aT'] === '2faActivate') {
					setUser(login);
					setId(data['id']);
					await setError('2FA');
				} else {
					setUser(login);
					setId(data['id']);
					setToken(data['aT']);
					navigate('/pong');
				}
			} else {
				await setError('invalid login or password');
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
				setId(0);
				setIntraLogin('')
				navigate('/')
			}

		} catch (err) {
			console.log(err);
		}
	}

	async function twoFA(url: URL) {

		try {
			const response = await fetch( url, { method: 'POST'} )
			const data = await response.json()
			if (response.status == 200) {
				setToken(data['aT']);
				navigate('/pong')
			} else {
				await setError('Error Authentification Code')
			}
		} catch (err) {
			console.log(err)
		}
	}

	const memoValue = useMemo(
		() => ({
			user,
			intraLogin,
			id,
			token,
			setUser,
			setId,
			setToken,
			setError,
			setIntraLogin,
			loading,
			error,
			authLogin,
			authLogout,
			authSignup,
			authLogIntra,
			authSignupIntra,
			twoFA,
			navigate,
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
	const {token, setToken, setId, setUser, setIntraLogin, navigate } = useContext(AuthContext);
	return {token, setToken, setId, setUser, setIntraLogin, navigate};
}

export default function useAuth() {
	return useContext(AuthContext);
}
