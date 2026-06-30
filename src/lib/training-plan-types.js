export function computeEndDate(startDate, durationWeeks) {
  const [y, m, d] = startDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + durationWeeks * 7);
  return date.toISOString().split('T')[0];
}

export function computeTotal(services) {
  return services.reduce((sum, s) => sum + (s.price || 0), 0);
}

export function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function safeProgramSlug(name) {
  return name.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 40);
}
