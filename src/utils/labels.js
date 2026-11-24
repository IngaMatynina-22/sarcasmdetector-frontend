export const LABEL_UA = {
  SARCASM: 'Сарказм',
  NOT_SARCASM: 'Без сарказму',
  UNCERTAIN: 'Невизначено',
};

export function labelUa(label) {
  return LABEL_UA[label] || label || '—';
}

export function pct(v) {
  if (v == null || Number.isNaN(Number(v))) return '—';
  const n = Number(v);
  return `${(n <= 1 ? n * 100 : n).toFixed(1)}%`;
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadText(text, name, type = 'text/plain') {
  downloadBlob(new Blob([text], { type }), name);
}

export function copyText(text) {
  return navigator.clipboard.writeText(text);
}

export { passwordScore } from './password';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export async function downloadAuth(path, filename, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Export failed');
  downloadBlob(await res.blob(), filename);
}
