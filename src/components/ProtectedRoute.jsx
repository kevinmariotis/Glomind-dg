import {Navigate} from 'react-router-dom';

function ProtectedRoute ({permiso, redirectTo="/", children}) {
	if(!permiso){
		return <Navigate to={redirectTo} />
        }
	return children;
}
export default ProtectedRoute;