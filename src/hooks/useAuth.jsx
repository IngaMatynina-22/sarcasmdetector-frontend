import { useSelector } from 'react-redux';
import { can, roleOf, ROLES } from '../auth/roles';
import { selectIsAuthenticated, selectUser } from '../features/auth/authSlice';

export function useAuth() {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = roleOf(user);
  return {
    user,
    role,
    isAuthenticated,
    isAdmin: role === ROLES.ADMIN,
    can: (perm) => can(user, perm),
  };
}

export default useAuth;
