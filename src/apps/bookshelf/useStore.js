import { useState, useEffect, useCallback } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp, setDoc, getDoc, getDocs, where
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from './firebase';

// ── localStorage helpers ───────────────────────────────────────────────────────
const lsLoad = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const lsSave = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const lsDel  = (k)    => { try { localStorage.removeItem(k); } catch {} };
const uid    = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ── Photo helpers ─────────────────────────────────────────────────────────────
export function resizePhoto(base64DataUrl, maxPx = 600, quality = 0.80) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width: w, height: h } = img;
      if (w > maxPx || h > maxPx) {
        if (w >= h) { h = Math.round(h * maxPx / w); w = maxPx; }
        else        { w = Math.round(w * maxPx / h); h = maxPx; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = base64DataUrl;
  });
}

export async function saveProductPhoto(productId, base64DataUrl) {
  const resized = await resizePhoto(base64DataUrl);
  const photoRef = doc(db, 'productPhotos', productId);
  await setDoc(photoRef, { productId, photoUrl: resized, updatedAt: serverTimestamp() });
  lsSave(`bs2_photo_${productId}`, resized);
  return resized;
}

export async function deleteProductPhoto(productId) {
  try { await deleteDoc(doc(db, 'productPhotos', productId)); } catch {}
  lsDel(`bs2_photo_${productId}`);
}

export async function loadProductPhoto(productId) {
  const cached = lsLoad(`bs2_photo_${productId}`, null);
  if (cached) return cached;
  try {
    const snap = await getDoc(doc(db, 'productPhotos', productId));
    if (snap.exists()) {
      const url = snap.data().photoUrl;
      lsSave(`bs2_photo_${productId}`, url);
      return url;
    }
  } catch {}
  return null;
}

// ── Seed products ─────────────────────────────────────────────────────────────
const SEED_PRODUCTS = [
  { id:'p1', name:'The Great Gatsby',   company:'Scribner', size:'Paperback', category:'Books',     price:14.99, cost:7.00, stock:12, minStock:3,  unit:'ea',   barcode:'9780743273565' },
  { id:'p2', name:'Atomic Habits',      company:'Penguin',  size:'Hardcover', category:'Books',     price:18.99, cost:8.50, stock:4,  minStock:3,  unit:'ea',   barcode:'9780735211292' },
  { id:'p3', name:'White Rice 5kg',     company:'SunRice',  size:'5kg',       category:'Groceries', price:12.50, cost:7.00, stock:20, minStock:5,  unit:'bag',  barcode:'' },
  { id:'p4', name:'Cooking Oil 2L',     company:'Allowrie', size:'2L',        category:'Groceries', price:8.99,  cost:5.00, stock:15, minStock:5,  unit:'btl',  barcode:'' },
  { id:'p5', name:'A4 Paper Ream',      company:'Reflex',   size:'A4 500 sh', category:'Supplies',  price:9.99,  cost:5.50, stock:8,  minStock:3,  unit:'ream', barcode:'' },
  { id:'p6', name:'Ballpoint Pens x10', company:'Bic',      size:'Medium',    category:'Supplies',  price:4.99,  cost:2.00, stock:25, minStock:10, unit:'pack', barcode:'' },
];

// ── Receipt counter ───────────────────────────────────────────────────────────
const getNextReceiptNum = async (prefix = 'UN', startNum = 100) => {
  try {
    const ref = doc(db, 'meta', 'receiptCounter');
    const snap = await getDoc(ref);
    const current = snap.exists() ? (snap.data().value || (startNum - 1)) : (startNum - 1);
    const next = current + 1;
    await setDoc(ref, { value: next });
    return `${prefix}${next}`;
  } catch {
    const local = lsLoad('bs2_receiptCounter', startNum - 1);
    const next = local + 1;
    lsSave('bs2_receiptCounter', next);
    return `${prefix}${next}`;
  }
};

// ── Default settings ──────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  businessName: 'Unity Book Shop',
  companyName:  'Unity Enterprises',
  currency: 'AUD',
  currencySymbol: '$',
  gstEnabled: true,
  gstRate: 10,
  receiptFooter: 'Thank you for shopping with us!',
  receiptFooter2: '',
  receiptPrefix: 'UN',
  receiptStartNum: 100,
  dashFont: 'syne',
  customCategories: [],
  theme: 'dark',
  fontSize: 'md',
};

export function useStore() {
  const [user,            setUser]           = useState(null);
  const [profile,         setProfile]        = useState(null);
  const [products,        setProducts]       = useState(() => lsLoad('bs2_products', SEED_PRODUCTS));
  const [photos,          setPhotos]         = useState(() => lsLoad('bs2_photosIndex', {}));
  const [sales,           setSales]          = useState(() => lsLoad('bs2_sales',    []));
  const [workers,         setWorkers]        = useState(() => lsLoad('bs2_workers',  []));
  const [settings,        setSettings]       = useState(() => lsLoad('bs2_settings', DEFAULT_SETTINGS));
  const [suppliers,       setSuppliers]      = useState(() => lsLoad('bs2_suppliers', []));
  const [stockReceipts,   setStockReceipts]  = useState(() => lsLoad('bs2_stockReceipts', []));
  const [creditCustomers, setCreditCustomers]= useState(() => lsLoad('bs2_creditCustomers', []));
  const [activityLog,     setActivityLog]    = useState(() => lsLoad('bs2_activityLog', []));
  const [loading,         setLoading]        = useState(true);
  const [fbActive,        setFbActive]       = useState(false);
  // Exposed so LoginPage can show exactly what went wrong
  const [authError,       setAuthError]      = useState('');

  // ── Auth boot ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          const snap = await getDoc(doc(db, 'workers', u.uid));
          if (snap.exists()) {
            const p = { id: u.uid, ...snap.data() };
            setProfile(p);
            lsSave('bs2_session', p);
            setFbActive(true);
            setAuthError('');
          } else {
            // Authenticated but no worker document — show clear message
            const msg = `Logged in OK, but no worker record found in Firestore for UID: ${u.uid}. Add a document at workers/${u.uid} with name, email, role fields.`;
            console.error('[useStore]', msg);
            setAuthError(msg);
            await signOut(auth);
            setUser(null);
            setProfile(null);
          }
        } catch (err) {
          // Firestore read failed — almost always a security rules problem
          const msg = `Firebase error [${err.code}]: ${err.message}`;
          console.error('[useStore] getDoc(workers/' + u.uid + ') threw:', msg);
          setAuthError(msg);
          // Don't sign out — auth itself worked fine
          // Try cached session as fallback
          const cached = lsLoad('bs2_session', null);
          if (cached && cached.id === u.uid) {
            console.warn('[useStore] Using cached profile as offline fallback.');
            setProfile(cached);
            setAuthError(msg + ' — using cached session (offline mode).');
          }
          setFbActive(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        lsSave('bs2_session', null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── Firestore listeners ────────────────────────────────────────────────────
  useEffect(() => {
    if (!fbActive) return;
    const unsubs = [];

    unsubs.push(onSnapshot(collection(db, 'products'), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(data); lsSave('bs2_products', data);
    }));

    unsubs.push(onSnapshot(collection(db, 'productPhotos'), snap => {
      const index = {};
      snap.docs.forEach(d => {
        const { productId, photoUrl } = d.data();
        if (productId && photoUrl) {
          index[productId] = photoUrl;
          lsSave(`bs2_photo_${productId}`, photoUrl);
        }
      });
      setPhotos(index);
      lsSave('bs2_photosIndex', index);
    }));

    unsubs.push(onSnapshot(query(collection(db, 'sales'), orderBy('createdAt', 'desc')), snap => {
      const data = snap.docs.map(d => {
        const raw = d.data();
        return { ...raw, id: d.id, date: raw.createdAt?.toDate?.()?.toISOString() || raw.date || new Date().toISOString() };
      });
      setSales(data); lsSave('bs2_sales', data);
    }));

    unsubs.push(onSnapshot(collection(db, 'workers'), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setWorkers(data); lsSave('bs2_workers', data);
    }));

    unsubs.push(onSnapshot(collection(db, 'suppliers'), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSuppliers(data); lsSave('bs2_suppliers', data);
    }));

    unsubs.push(onSnapshot(collection(db, 'creditCustomers'), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCreditCustomers(data); lsSave('bs2_creditCustomers', data);
    }));

    unsubs.push(onSnapshot(query(collection(db, 'stockReceipts'), orderBy('createdAt', 'desc')), snap => {
      const data = snap.docs.map(d => ({
        id: d.id, ...d.data(),
        date: d.data().createdAt?.toDate?.()?.toISOString() || d.data().date,
      }));
      setStockReceipts(data); lsSave('bs2_stockReceipts', data);
    }));

    unsubs.push(onSnapshot(doc(db, 'meta', 'settings'), snap => {
      if (snap.exists()) {
        const s = { ...DEFAULT_SETTINGS, ...snap.data() };
        setSettings(s); lsSave('bs2_settings', s);
      }
    }));

    return () => unsubs.forEach(u => u());
  }, [fbActive]);

  // ── Auth actions ───────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (err) {
      const msg = `Sign-in failed [${err.code}]: ${err.message}`;
      console.error('[useStore]', msg);
      setAuthError(msg);
      return { ok: false, error: msg };
    }
  }, []);

  const logout = useCallback(async () => {
    try { await signOut(auth); } catch {}
    lsSave('bs2_session', null);
    setUser(null); setProfile(null); setFbActive(false); setAuthError('');
  }, []);

  // ── Activity Log ───────────────────────────────────────────────────────────
  const logActivity = useCallback((action, details, extra = {}) => {
    const entry = {
      id: uid(), action, details,
      workerName: profile?.name || 'System',
      workerRole: profile?.role || 'unknown',
      timestamp: new Date().toISOString(),
      ...extra,
    };
    setActivityLog(prev => {
      const updated = [entry, ...prev].slice(0, 500);
      lsSave('bs2_activityLog', updated);
      if (fbActive) {
        addDoc(collection(db, 'activityLog'), { ...entry, createdAt: serverTimestamp() }).catch(() => {});
      }
      return updated;
    });
  }, [profile, fbActive]);

  // ── Products ───────────────────────────────────────────────────────────────
  const addProduct = useCallback(async (data) => {
    const { photoUrl: rawPhoto, ...rest } = data;
    const docRef = await addDoc(collection(db, 'products'), { ...rest, createdAt: serverTimestamp() });
    if (rawPhoto && rawPhoto.startsWith('data:')) {
      const resized = await resizePhoto(rawPhoto);
      await setDoc(doc(db, 'productPhotos', docRef.id), { productId: docRef.id, photoUrl: resized, updatedAt: serverTimestamp() });
      lsSave(`bs2_photo_${docRef.id}`, resized);
      setPhotos(prev => { const next = { ...prev, [docRef.id]: resized }; lsSave('bs2_photosIndex', next); return next; });
    }
    logActivity('ADD_PRODUCT', `Added product: ${data.name}`, { productName: data.name, category: data.category });
  }, [logActivity]);

  const updateProduct = useCallback(async (id, data) => {
    const { createdAt, id: _id, photoUrl: rawPhoto, ...clean } = data;
    if (rawPhoto && rawPhoto.startsWith('data:')) {
      const resized = await resizePhoto(rawPhoto);
      await setDoc(doc(db, 'productPhotos', id), { productId: id, photoUrl: resized, updatedAt: serverTimestamp() });
      lsSave(`bs2_photo_${id}`, resized);
      setPhotos(prev => { const next = { ...prev, [id]: resized }; lsSave('bs2_photosIndex', next); return next; });
    } else if (rawPhoto === '') {
      await deleteProductPhoto(id);
      setPhotos(prev => { const next = { ...prev }; delete next[id]; lsSave('bs2_photosIndex', next); return next; });
    }
    await updateDoc(doc(db, 'products', id), clean);
    logActivity('UPDATE_PRODUCT', `Updated product: ${data.name || id}`, { productId: id, productName: data.name });
  }, [logActivity]);

  const deleteProduct = useCallback(async (id) => {
    await Promise.all([deleteDoc(doc(db, 'products', id)), deleteProductPhoto(id)]);
    setPhotos(prev => { const next = { ...prev }; delete next[id]; lsSave('bs2_photosIndex', next); return next; });
    logActivity('DELETE_PRODUCT', `Deleted product ID: ${id}`, { productId: id });
  }, [logActivity]);

  // ── Sales ──────────────────────────────────────────────────────────────────
  const recordSale = useCallback(async (saleData) => {
    const prefix   = settings?.receiptPrefix   || 'UN';
    const startNum = settings?.receiptStartNum || 100;
    const receiptId = await getNextReceiptNum(prefix, startNum);
    const sale = {
      ...saleData, receiptId,
      workerId:   profile?.id   || 'unknown',
      workerName: profile?.name || 'Unknown',
      date:       new Date().toISOString(),
      createdAt:  serverTimestamp(),
    };
    await addDoc(collection(db, 'sales'), sale);
    for (const item of saleData.items) {
      const prod = products.find(p => p.id === item.id);
      if (prod) await updateDoc(doc(db, 'products', item.id), { stock: Math.max(0, prod.stock - item.qty) });
    }
    return receiptId;
  }, [profile, products, settings]);

  // ── Workers ────────────────────────────────────────────────────────────────
  const addWorker = useCallback(async (data) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await setDoc(doc(db, 'workers', cred.user.uid), {
        name: data.name, email: data.email, role: data.role, phone: data.phone || '',
        createdAt: serverTimestamp(),
      });
    } catch {
      await addDoc(collection(db, 'workers'), { ...data, createdAt: serverTimestamp() });
    }
  }, []);

  const updateWorker = useCallback(async (id, data) => {
    const { createdAt, id: _id, password, ...clean } = data;
    await updateDoc(doc(db, 'workers', id), clean);
    if (id === profile?.id) {
      const refreshed = { ...profile, ...clean };
      lsSave('bs2_session', refreshed); setProfile(refreshed);
    }
  }, [profile]);

  const deleteWorker = useCallback(async (id) => {
    await deleteDoc(doc(db, 'workers', id));
  }, []);

  // ── Suppliers ──────────────────────────────────────────────────────────────
  const addSupplier = useCallback(async (data) => {
    if (fbActive) await addDoc(collection(db, 'suppliers'), { ...data, createdAt: serverTimestamp() });
    else setSuppliers(prev => { const u=[...prev,{...data,id:'sup'+uid()}]; lsSave('bs2_suppliers',u); return u; });
  }, [fbActive]);

  const updateSupplier = useCallback(async (id, data) => {
    if (fbActive) { const { id:_id, createdAt, ...clean }=data; await updateDoc(doc(db,'suppliers',id), clean); }
    else setSuppliers(prev => { const u=prev.map(s=>s.id===id?{...s,...data}:s); lsSave('bs2_suppliers',u); return u; });
  }, [fbActive]);

  const deleteSupplier = useCallback(async (id) => {
    if (fbActive) await deleteDoc(doc(db, 'suppliers', id));
    else setSuppliers(prev => { const u=prev.filter(s=>s.id!==id); lsSave('bs2_suppliers',u); return u; });
  }, [fbActive]);

  // ── Stock Receipts ─────────────────────────────────────────────────────────
  const receiveStock = useCallback(async (receiptData) => {
    const receipt = { ...receiptData, createdAt: serverTimestamp(), date: new Date().toISOString(), receivedBy: profile?.name || 'Unknown' };
    if (fbActive) {
      await addDoc(collection(db, 'stockReceipts'), receipt);
      for (const item of receiptData.items) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          await updateDoc(doc(db, 'products', item.productId), {
            stock: prod.stock + item.qty,
            cost:  item.newCost  || prod.cost,
            price: item.newPrice || prod.price,
            lastTopup: receiptData.date || new Date().toISOString().slice(0,10),
            lastMemo:  receiptData.invoiceNo,
          });
        }
      }
    } else {
      setStockReceipts(prev => { const u=[{...receipt,id:'sr'+uid(),createdAt:new Date().toISOString()},...prev]; lsSave('bs2_stockReceipts',u); return u; });
      setProducts(prev => prev.map(p => {
        const item = receiptData.items.find(i => i.productId === p.id);
        if (!item) return p;
        return { ...p, stock: p.stock+item.qty, cost: item.newCost||p.cost, price: item.newPrice||p.price, lastTopup: receiptData.date, lastMemo: receiptData.invoiceNo };
      }));
    }
    logActivity('RECEIVE_STOCK', `Received stock: invoice ${receiptData.invoiceNo||'—'} · ${receiptData.items.length} item(s) · $${receiptData.totalCost?.toFixed?.(2)||'0.00'}`, { invoiceNo: receiptData.invoiceNo, supplierName: receiptData.supplierName });
  }, [fbActive, profile, products, logActivity]);

  // ── Credit Customers ───────────────────────────────────────────────────────
  const addCreditCustomer = useCallback(async (data) => {
    if (fbActive) await addDoc(collection(db, 'creditCustomers'), { ...data, createdAt: serverTimestamp(), balance: 0 });
    else setCreditCustomers(prev => { const u=[...prev,{...data,id:'cc'+uid(),balance:0,createdAt:new Date().toISOString()}]; lsSave('bs2_creditCustomers',u); return u; });
    logActivity('ADD_CUSTOMER', `Added credit customer: ${data.name}`, { customerName: data.name });
  }, [fbActive, logActivity]);

  const updateCreditCustomer = useCallback(async (id, data) => {
    if (fbActive) { const { id:_id, createdAt, ...clean }=data; await updateDoc(doc(db,'creditCustomers',id), clean); }
    else setCreditCustomers(prev => { const u=prev.map(c=>c.id===id?{...c,...data}:c); lsSave('bs2_creditCustomers',u); return u; });
  }, [fbActive]);

  const deleteCreditCustomer = useCallback(async (id) => {
    const cust = creditCustomers.find(c => c.id === id);
    if (fbActive) await deleteDoc(doc(db, 'creditCustomers', id));
    else setCreditCustomers(prev => { const u=prev.filter(c=>c.id!==id); lsSave('bs2_creditCustomers',u); return u; });
    logActivity('DELETE_CUSTOMER', `Removed credit customer: ${cust?.name||id}`, { customerName: cust?.name });
  }, [fbActive, creditCustomers, logActivity]);

  // ── Settings ───────────────────────────────────────────────────────────────
  const saveSettings = useCallback(async (data) => {
    await setDoc(doc(db, 'meta', 'settings'), data, { merge: true });
    setSettings(prev => ({ ...prev, ...data }));
    lsSave('bs2_settings', { ...settings, ...data });
    logActivity('SAVE_SETTINGS', 'Settings updated', {});
  }, [settings, logActivity]);

  return {
    user, profile, loading, fbActive, authError,
    products, photos,
    sales, workers, settings,
    login, logout,
    addProduct, updateProduct, deleteProduct,
    recordSale,
    addWorker, updateWorker, deleteWorker,
    saveSettings,
    suppliers, addSupplier, updateSupplier, deleteSupplier,
    stockReceipts, receiveStock,
    creditCustomers, addCreditCustomer, updateCreditCustomer, deleteCreditCustomer,
    activityLog,
  };
}
