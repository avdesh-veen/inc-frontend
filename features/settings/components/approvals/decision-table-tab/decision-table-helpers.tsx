export function getApprovalPathColor(path: string): string {
  if (!path) {
    return 'text-foreground';
  }
  
  const pathLower = path.toLowerCase();
  
  if (pathLower.includes('self')) {
    return 'text-emerald-400';
  }
  
  if (pathLower.includes('team lead') && pathLower.includes('manager')) {
    return 'text-violet-400';
  }
  
  if (pathLower.includes('team lead')) {
    return 'text-cyan-400';
  }
  
  if (pathLower.includes('manager')) {
    return 'text-violet-400';
  }
  
  return 'text-foreground';
}

export function formatCellValue(value: string | null | undefined): string {
  if (!value || value === '' || value === 'ANY' || value === 'any') {
    return '*';
  }
  return value;
}

export function isWildcardValue(value: string): boolean {
  return value === '*';
}
