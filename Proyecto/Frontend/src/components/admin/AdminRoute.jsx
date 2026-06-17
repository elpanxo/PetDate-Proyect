import { Navigate } from 'react-router-dom';
import { token } from '../../api/petdate-api';

const AdminRoute = ({ children }) => {
  const claims = token.payload();
  if (!claims || claims.rol !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default AdminRoute;
