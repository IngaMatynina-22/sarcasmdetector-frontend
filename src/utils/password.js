const COMMON = new Set([
  'password', 'password1', 'password123', 'qwerty123', 'qwertyui', '11111111',
  '12345678', '123456789', '1234567890', 'iloveyou', 'admin123', 'welcome1',
  'letmein1', 'monkey12', 'dragon12', 'passw0rd', 'abc12345', '00000000',
  'sarcasm1', 'sarcasm123',
]);

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

export function passwordScore(password) {
  if (!password) return 0;
  let s = 0;
  if (password.length >= PASSWORD_MIN) s += 1;
  if (password.length >= 12) s += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s += 1;
  if (/\d/.test(password)) s += 1;
  if (/[^A-Za-z0-9]/.test(password)) s += 1;
  return Math.min(s, 4);
}

export function analyzePassword(password, { email = '', name = '' } = {}) {
  const issues = [];
  if (!password) {
    return { score: 0, issues: ['Введіть пароль'], ok: false, label: 'слабка' };
  }
  if (password.length < PASSWORD_MIN) issues.push(`Щонайменше ${PASSWORD_MIN} символів`);
  if (password.length > PASSWORD_MAX) issues.push(`Не більше ${PASSWORD_MAX} символів`);
  if (/\s/.test(password)) issues.push('Без пробілів');
  if (!/[a-z]/.test(password)) issues.push('Мала літера');
  if (!/[A-Z]/.test(password)) issues.push('Велика літера');
  if (!/\d/.test(password)) issues.push('Цифра');
  if (!/[^A-Za-z0-9]/.test(password)) issues.push('Спецсимвол (!@#$…)');

  const lower = password.toLowerCase();
  if (COMMON.has(lower)) issues.push('Занадто поширений пароль');
  if (/^(.)\1+$/.test(password)) issues.push('Не використовуйте один символ');
  if (/^(012345|123456|234567|345678|456789|abcdef|qwerty)/i.test(password)) {
    issues.push('Уникайте простих послідовностей');
  }

  const local = email.split('@')[0]?.toLowerCase();
  if (local && local.length >= 4 && lower.includes(local)) issues.push('Не включайте email');
  const namePart = name.trim().toLowerCase().split(/\s+/)[0];
  if (namePart && namePart.length >= 4 && lower.includes(namePart)) issues.push('Не включайте імʼя');

  const score = passwordScore(password);
  const labels = ['слабка', 'слабка', 'середня', 'добра', 'сильна'];
  const ok = issues.length === 0 && score >= 3;
  return { score, issues, ok, label: labels[score] };
}

export function passwordsMatch(a, b) {
  return Boolean(a) && a === b;
}
