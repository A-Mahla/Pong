import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '/src/pong/context/useAuth';

const PrivateRoute = ({children, ...rest}) => {

	const {token} = useAuth();
	return token !== '' ? <Outlet /> : <Navigate to='/login' exact />

}

export default PrivateRoute;
