import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { originalRequest, refreshRequest, responseApi } from "/src/pong/component/FetchApi"

interface AuthConstextType {
	user?: string;
	token?: string;
	loading: boolean;
	error?: Error;
	login: (login: string, password: string) => void;
	logout: () => void;
	signup: (login: string, password: string) => void;
}

const AuthContext = createContext<AuthConstextType>(
	{} as AuthConstextType
);

export function AuthProvider({children}: {children: ReactNode}): JSX.Element {

	const [user, setUser] = useState<string>('');
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


			const url = `http://${import.meta.env.VITE_SITE}/api/users/profile/auth`;
			const requestOption = {
				method: "GET",
				headers: { 'Authorization': `Bearer ${token}` },
			}

			try {
				const response1: responseApi = await originalRequest({
					input: url,
					option: requestOption,
				});

				if (response1.response.statusText === "Unauthorized") {
					const refresh: responseApi = await refreshRequest();

					if (refresh.response.status !== 200 && refresh.response.status !== 304) {
						if ( location.pathname === '/login'
							|| location.pathname === '/pong' )
							navigate('/login')
						else
							navigate('/');
					}

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
				else
					setUser(response1.data['login']);

			} catch (err) {
				console.log(err);
			} finally {
				setLoadingInitial(false)
			}
		}
		auth();

	}, [])

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
				navigate('/')
			}

		} catch (err) {
			console.log(err);
		}
	}

	const memoValue = useMemo(
		() => ({
			token,
			user,
			setUser,
			setToken,
			loading,
			error,
			authLogin,
//			signUp,
			authLogout,
		}),
		[user, token, loading, error]
	);

	return (
		<AuthContext.Provider value={memoValue}>
		  {!loadingInitial && children}
		</AuthContext.Provider>
  );
}

export default function useAuth() {
	return useContext(AuthContext);
}
