export const ROLES = {
  OWNER:   'owner',
  MANAGER: 'manager',
  CASHIER: 'cashier',
};

export const ROLE_LABELS = {
  owner:   '👑 Owner',
  manager: '🔧 Manager',
  cashier: '🛒 Cashier',
};

export const ROLE_PERMISSIONS = {
  owner: {
    canViewDashboard:  true,
    canManageWorkers:  true,
    canManageInventory:true,
    canViewReports:    true,
    canDeleteSales:    true,
    canDeleteInventory:true,
    canAdjustPrices:   true,
    canViewAllSales:   true,
    canDoPOS:          true,
    canManageSuppliers:true,
    canChangeAppearance:true,
  },
  manager: {
    canViewDashboard:  true,
    canManageWorkers:  false,
    canManageInventory:true,
    canViewReports:    true,
    canDeleteSales:    false,
    canDeleteInventory:false,
    canAdjustPrices:   true,
    canViewAllSales:   true,
    canDoPOS:          true,
    canManageSuppliers:true,
    canChangeAppearance:true,
  },
  cashier: {
    canViewDashboard:  false,
    canManageWorkers:  false,
    canManageInventory:false,
    canViewReports:    false,
    canDeleteSales:    false,
    canAdjustPrices:   false,
    canViewAllSales:   false,
    canDoPOS:          true,
    canManageSuppliers:false,
    canChangeAppearance:true,
  },
};

export const CATEGORIES = {
  Books:     { icon:'📚', color:'#38bdf8' },
  Groceries: { icon:'🛒', color:'#34d399' },
  Supplies:  { icon:'🗂️',  color:'#818cf8' },
  Other:     { icon:'📦', color:'#fb923c' },
};

// Format number with commas and space between symbol and amount
// e.g. makeFmt('Rs.')(1253) → 'Rs. 1,253.00'
export const makeFmt = sym => n => {
  const num = Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return sym + ' ' + num;
};

export const fmt = (n, sym = '$') => {
  const num = Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return sym + ' ' + num;
};

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const PAYMENT_TERMS = [
  '7 days', '14 days', '30 days', '45 days', '60 days', '90 days', 'COD', 'Prepaid', 'Custom'
];

// Merge built-in categories with custom ones from settings
// customCategories: [{ name, icon, color }]
export function buildCategories(customCategories) {
  const merged = { ...CATEGORIES };
  (customCategories || []).forEach(c => {
    if (c.name && !merged[c.name]) {
      merged[c.name] = { icon: c.icon || '📦', color: c.color || '#64748b' };
    }
  });
  return merged;
}
