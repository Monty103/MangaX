export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return 'Yesterday';
  if (day < 30) return `${day} d ago`;
  const mo = Math.floor(day / 30);
  return `${mo} mo ago`;
}
