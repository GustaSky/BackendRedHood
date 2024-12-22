import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth';

function PrivateRoute({ children }) {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default PrivateRoute; 