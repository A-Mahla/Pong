import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '/src/pong/context/useAuth';

const LoggedRoute = () => {

	const {token} = useAuth();

	return !token ? <Outlet /> : <Navigate to='/pong' exact />
}

export default LoggedRoute;
