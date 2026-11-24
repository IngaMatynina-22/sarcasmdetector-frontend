import { useAuth } from '../hooks/useAuth';
import { can } from './roles';

export default function Can({ perm, children, fallback = null }) {
  const { user } = useAuth();
  if (!can(user, perm)) return fallback;
  return children;
}
