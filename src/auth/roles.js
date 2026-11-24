export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
};

export const PERMS = {
  ADMIN_PANEL: 'admin_panel',
  TRAIN: 'train',
  COMPARE: 'compare',
  MUTATE_DATASETS: 'mutate_datasets',
  MUTATE_SOURCES: 'mutate_sources',
  ACTIVATE_MODEL: 'activate_model',
  PATCH_SETTINGS: 'patch_settings',
};

const ADMIN = [ROLES.ADMIN];
const AUTH = [ROLES.ADMIN, ROLES.USER];

const PERM_ROLES = {
  [PERMS.ADMIN_PANEL]: ADMIN,
  [PERMS.TRAIN]: ADMIN,
  [PERMS.COMPARE]: ADMIN,
  [PERMS.MUTATE_DATASETS]: ADMIN,
  [PERMS.MUTATE_SOURCES]: ADMIN,
  [PERMS.ACTIVATE_MODEL]: ADMIN,
  [PERMS.PATCH_SETTINGS]: ADMIN,
};

export function roleOf(user) {
  return user?.role || null;
}

export function hasRole(user, roles = AUTH) {
  const r = roleOf(user);
  return !!r && roles.includes(r);
}

export function can(user, perm) {
  return hasRole(user, PERM_ROLES[perm] || AUTH);
}

/** Path prefixes that require admin. Checked after /me is loaded. */
export const ADMIN_PREFIXES = ['/admin', '/training', '/model-comparison'];

export function pathRequiresAdmin(pathname) {
  return ADMIN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export const NAV = [
  { path: '/dashboard', label: 'Панель', roles: AUTH },
  { path: '/analysis', label: 'Аналіз', roles: AUTH },
  { path: '/batch-analysis', label: 'Пакетний аналіз', roles: AUTH },
  { path: '/history', label: 'Історія', roles: AUTH },
  { path: '/statistics', label: 'Статистика', roles: AUTH },
  { path: '/datasets', label: 'Датасети', roles: AUTH },
  { path: '/models', label: 'AI-моделі', roles: AUTH },
  { path: '/training', label: 'Навчання', roles: ADMIN },
  { path: '/model-comparison', label: 'Порівняння', roles: ADMIN },
  { path: '/news-sources', label: 'Джерела новин', roles: AUTH },
  { path: '/profile', label: 'Профіль', roles: AUTH },
  { path: '/settings', label: 'Налаштування', roles: AUTH },
];

export const ADMIN_NAV = [
  { path: '/admin/users', label: 'Користувачі', roles: ADMIN },
  { path: '/admin/statistics', label: 'Системна статистика', roles: ADMIN },
  { path: '/admin/logs', label: 'Журнали', roles: ADMIN },
];

export function visibleNav(user) {
  return NAV.filter((i) => hasRole(user, i.roles));
}

export function visibleAdminNav(user) {
  return ADMIN_NAV.filter((i) => hasRole(user, i.roles));
}
