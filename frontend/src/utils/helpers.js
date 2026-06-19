export function getCutiBadgeClass(jenisCuti) {
  const lower = (jenisCuti || '').toLowerCase();
  if (lower.includes('tahunan')) return 'badge-cuti badge-cuti-tahunan';
  if (lower.includes('melahirkan')) return 'badge-cuti badge-cuti-melahirkan';
  if (lower.includes('bersama')) return 'badge-cuti badge-cuti-bersama';
  if (lower.includes('pengganti')) return 'badge-cuti badge-cuti-pengganti';
  if (lower.includes('panjang')) return 'badge-cuti badge-cuti-panjang';
  return 'badge-cuti badge-cuti-tahunan';
}

export function getStatusBadgeClass(status) {
  switch (status) {
    case 'Approved': return 'badge badge-approved';
    case 'Rejected': return 'badge badge-rejected';
    case 'Pending': return 'badge badge-pending';
    default: return 'badge';
  }
}

export function getRecBadgeClass(rec) {
  if (rec === 'Approve dulu') return 'badge-rec badge-rec-approve';
  if (rec === 'Review prioritas') return 'badge-rec badge-rec-priority';
  if (rec === 'Review normal') return 'badge-rec badge-rec-normal';
  if (rec === 'Tahan dulu') return 'badge-rec badge-rec-hold';
  return 'badge-rec badge-rec-priority';
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateRange(start, end) {
  return `${formatDate(start)} s/d ${formatDate(end)}`;
}
