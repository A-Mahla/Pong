import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import { originalRequest, refreshRequest } from "/src/pong/component/FetchApi"

interface AuthConstextType {
	user?: string;
	token?: string;
	loading: boolean;
	error?: any;
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
	const [error, setError] = useState<any>();
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

	const history = useHistory();
	const location = useLocation();

	useEffect(() => {
		if (error)
			setError(null);
	}, [location.pathname]);


	useEffect(() => {

		const url = `http://${import.meta.env.VITE_SITE}/api/users/profile`;
		const requestOption = {
			method: "GET",
			headers: { 'Authorization': `Bearer ${token}` },
		}

		try {
			let { response, data } = await originalRequest({
				input: url,
				option: requestOption,
			});

			if (response.statusText !== "Unauthorized") {
				const refresh = await refreshRequest();

				if (refresh.status !== 200 || refresh.status !== 304) {
					history.push(`http://${import.meta.env.VITE_SITE}/api/auth/login`);
				}

				setUser(user => refresh['login']);
				setUser(token => refresh['aT']);

				let { response, data } = await originalRequest({
					input: url,
					option: requestOption,
				});
			}
			setUser(user => refresh['login']);

		} catch (err) {
			console.log(err);
		} finally {
			setLoadingInitial(false)
		}

	}, [])

	function authLogin(login: string, password: string) = async () => {

		const requestOptions = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			 },
			body: JSON.stringify({
				login: login,
				password: password,
			});
		}

		try {
			const response = await originalRequest({
				input: `http://${import.meta.env.VITE_SITE}/api/auth/signin`,
				option: requestOptions,
			});
			
			if ( response.status === 201) {
				setUser(user => login);
				setToken(token => response['aT']);
				history.push(`http://${import.meta.env.VITE_SITE}/pong`)
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(true);
		}
	}

	function logout() {

		try {
			const response = await originalRequest({
				input: `http://${import.meta.env.VITE_SITE}/api/auth/logout`,
				option: {
					method: "POST",
					headers: { 'Authorization': `Bearer ${token}` },
				}
			});

			if ( response.status === 201) {
				setUser(user => '');
				setToken(token => '');
				history.push(`http://${import.meta.env.VITE_SITE}`)
			}

		} catch (err) {
			console.log(err);
		}
	}

	const memoValue = useMemo(
		() => ({
			user,
			token,
			setToken,
			loading,
			error,
			login,
//			signUp,
			logout,
		}),
		[user, loading, error]
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
