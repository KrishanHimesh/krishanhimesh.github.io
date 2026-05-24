import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from './bookshelf/useStore';
import { ROLE_PERMISSIONS, ROLE_LABELS, buildCategories } from './bookshelf/constants';
import LoginPage     from './bookshelf/LoginPage';
import Dashboard     from './bookshelf/Dashboard';
import POS           from './bookshelf/POS';
import Inventory     from './bookshelf/Inventory';
import Workers       from './bookshelf/Workers';
import Reports       from './bookshelf/Reports';
import Settings      from './bookshelf/Settings';
import Suppliers     from './bookshelf/Suppliers';
import Payables      from './bookshelf/Payables';
import CreditCustomers from './bookshelf/CreditCustomers';
import ActivityLog    from './bookshelf/ActivityLog';
import ReceiveStock  from './bookshelf/ReceiveStock';
import SalesHistory  from './bookshelf/SalesHistory';
import InstallPrompt from './bookshelf/InstallPrompt';
import './BookShelf.css';

const TABS = [
  { id:'dashboard',    label:'📊 Dashboard',    permission:'canViewDashboard'    },
  { id:'pos',          label:'🛒 POS',           permission:'canDoPOS'            },
  { id:'inventory',    label:'📦 Inventory',     permission:'canManageInventory'  },
  { id:'receive',      label:'📥 Receive',       permission:'canManageSuppliers'  },
  { id:'suppliers',    label:'🏭 Suppliers',     permission:'canManageSuppliers'  },
  { id:'payables',     label:'💸 Payables',      permission:'canManageSuppliers'  },
  { id:'customers',    label:'🤝 Customers',     permission:'canViewReports'      },
  { id:'saleshistory', label:'🧾 Receipts',      permission:'canViewReports'      },
  { id:'reports',      label:'📈 Reports',       permission:'canViewReports'      },
  { id:'workers',      label:'👥 Workers',       permission:'canManageWorkers'    },
  { id:'settings',     label:'⚙️ Settings',      permission:'canManageWorkers'    },
  { id:'activitylog',  label:'🔍 Activity Log',  permission:'canManageWorkers'    },
  { id:'appearance',   label:'🎨 Appearance',    permission:'canChangeAppearance' },
];

export default function BookShelf() {
  const store = useStore();
  const { user, profile, loading, fbActive, authError,
          products, photos, sales, workers, settings,
          suppliers, stockReceipts,
          creditCustomers, addCreditCustomer, updateCreditCustomer, deleteCreditCustomer,
          activityLog,
          login, logout,
          addProduct, updateProduct, deleteProduct,
          recordSale,
          addWorker, updateWorker, deleteWorker,
          saveSettings,
          addSupplier, updateSupplier, deleteSupplier,
          receiveStock } = store;

  const [tab,      setTab]      = useState('pos');
  const [toast,    setToast]    = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const categories = buildCategories(settings?.customCategories);

  // Apply font size globally — set on :root so all em values inherit from it
  React.useEffect(() => {
    const sizes = { sm: '13px', md: '15px', lg: '17px', xl: '19px' };
    document.documentElement.style.setProperty('--bs-font-size', sizes[settings?.fontSize || 'md']);
  }, [settings?.fontSize]);

  const notify = (msg, type='ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const perms = profile ? (ROLE_PERMISSIONS[profile.role] || {}) : {};
  const visibleTabs = TABS.filter(t => perms[t.permission]);

  React.useEffect(() => {
    if (visibleTabs.length && !visibleTabs.find(t=>t.id===tab)) {
      setTab(visibleTabs[0].id);
    }
  }, [profile]); // eslint-disable-line

  const switchTab = id => { setTab(id); setMenuOpen(false); };

  const handleSale        = async d    => { try { const r=await recordSale(d);      notify('Sale recorded! ✅'); return r; } catch(e){ notify(e.message,'err'); } };
  const handleAddProd     = async d    => { try { await addProduct(d);              notify('Product added!');   } catch(e){ notify(e.message,'err'); } };
  const handleUpdateProd  = async(id,d)=> { try { await updateProduct(id,d);        notify('Product updated!'); } catch(e){ notify(e.message,'err'); } };
  const handleDelProd     = async id   => { try { await deleteProduct(id);          notify('Deleted','info');   } catch(e){ notify(e.message,'err'); } };
  const handleAddWorker   = async d    => { try { await addWorker(d);               notify('Worker added!');    } catch(e){ notify(e.message,'err'); } };
  const handleUpdWorker   = async(id,d)=> { try { await updateWorker(id,d);         notify('Worker updated!'); } catch(e){ notify(e.message,'err'); } };
  const handleDelWorker   = async id   => { try { await deleteWorker(id);           notify('Worker removed','info'); } catch(e){ notify(e.message,'err'); } };
  const handleSettings    = async d    => { try { await saveSettings(d);            notify('Settings saved! ✅'); } catch(e){ notify(e.message,'err'); } };
  const handleAddSupplier = async d    => { try { await addSupplier(d);             notify('Supplier added!'); } catch(e){ notify(e.message,'err'); } };
  const handleUpdSupplier = async(id,d)=> { try { await updateSupplier(id,d);       notify('Supplier updated!'); } catch(e){ notify(e.message,'err'); } };
  const handleDelSupplier = async id   => { try { await deleteSupplier(id);         notify('Supplier removed','info'); } catch(e){ notify(e.message,'err'); } };
  const handleReceive     = async d    => { try { await receiveStock(d);            notify('Stock received! ✅'); } catch(e){ notify(e.message,'err'); } };
  const handleAddCust    = async d    => { try { await addCreditCustomer(d);    notify('Customer added!');   } catch(e){ notify(e.message,'err'); } };
  const handleUpdCust    = async(id,d)=> { try { await updateCreditCustomer(id,d); notify('Customer updated!'); } catch(e){ notify(e.message,'err'); } };
  const handleDelCust    = async id   => { try { await deleteCreditCustomer(id); notify('Customer removed','info'); } catch(e){ notify(e.message,'err'); } };

  if (loading) return (
    <div className="bs bs-loading"><div className="bs-spinner"/><p>Loading Unity Book Shop…</p></div>
  );
  if (!user || !profile) return <LoginPage onLogin={login} loading={loading} authError={authError} />;

  const currentTab = visibleTabs.find(t=>t.id===tab);

  return (
    <div className="bs">
      <header className="bs-hdr">
        <Link to="/apps" className="bs-back">←</Link>
        <div className="bs-brand">🏪 <strong>{settings?.businessName || 'Unity Book Shop'}</strong></div>

        <nav className="bs-nav bs-nav-desktop">
          {visibleTabs.map(t => (
            <button key={t.id} className={'bs-nb'+(tab===t.id?' active':'')} onClick={()=>switchTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="bs-hdr-right">
          {!fbActive && <span className="bs-offline-badge">📴</span>}
          <div className="bs-user-av">{(profile.name||'?')[0].toUpperCase()}</div>
          <button className="bs-logout" onClick={logout} title="Sign out">⏻</button>
          <button className="bs-hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu">
            <span className={menuOpen?'open':''}/><span className={menuOpen?'open':''}/><span className={menuOpen?'open':''}/>
          </button>
        </div>
      </header>

      <div className="bs-mobile-tab-label">{currentTab?.label}</div>

      {menuOpen && (
        <div className="bs-mobile-menu">
          {visibleTabs.map(t => (
            <button key={t.id} className={'bs-mobile-menu-item'+(tab===t.id?' active':'')} onClick={()=>switchTab(t.id)}>
              {t.label}
            </button>
          ))}
          <div className="bs-mobile-menu-footer">
            <span style={{fontSize:'12px',color:'#64748b'}}>{ROLE_LABELS[profile.role]} · {profile.name}</span>
          </div>
        </div>
      )}

      {toast && <div className={'bs-toast '+(toast.type==='err'?'err':toast.type==='info'?'info':'ok')}>{toast.msg}</div>}
      <InstallPrompt />

      <main className="bs-main">
        {tab==='dashboard'   && perms.canViewDashboard    && <Dashboard      products={products} sales={sales} workers={workers} profile={profile} settings={settings} categories={categories}/>}
        {tab==='pos'         && perms.canDoPOS            && <POS            products={products} photos={photos} onSale={handleSale} profile={profile} settings={settings} creditCustomers={creditCustomers} categories={categories}/>}
        {tab==='inventory'   && perms.canManageInventory  && <Inventory      products={products} photos={photos} onAdd={handleAddProd} onUpdate={handleUpdateProd} onDelete={handleDelProd} canEdit={perms.canAdjustPrices} canDelete={perms.canDeleteInventory} settings={settings} categories={categories}/>}
        {tab==='receive'     && perms.canManageSuppliers  && <ReceiveStock   products={products} suppliers={suppliers} onReceive={handleReceive} onAddProduct={handleAddProd} settings={settings} stockReceipts={stockReceipts} categories={categories}/>}
        {tab==='payables'    && perms.canManageSuppliers  && <Payables       stockReceipts={stockReceipts} suppliers={suppliers} settings={settings}/>}
        {tab==='suppliers'   && perms.canManageSuppliers  && <Suppliers      suppliers={suppliers} onAdd={handleAddSupplier} onUpdate={handleUpdSupplier} onDelete={handleDelSupplier}/>}
        {tab==='reports'     && perms.canViewReports      && <Reports        sales={sales} products={products} workers={workers} settings={settings}/>}
        {tab==='saleshistory'&& perms.canViewReports      && <SalesHistory   sales={sales} products={products} settings={settings} profile={profile}/>}
        {tab==='workers'     && perms.canManageWorkers    && <Workers        workers={workers} onAdd={handleAddWorker} onUpdate={handleUpdWorker} onDelete={handleDelWorker} profile={profile}/>}
        {tab==='settings'    && perms.canManageWorkers    && <Settings       settings={settings} onSave={handleSettings}/>}
        {tab==='activitylog' && perms.canManageWorkers    && <ActivityLog    activityLog={activityLog}/>}
        {tab==='customers'   && perms.canViewReports      && <CreditCustomers customers={creditCustomers} sales={sales} onAdd={handleAddCust} onUpdate={handleUpdCust} onDelete={handleDelCust} settings={settings}/>}
        {tab==='appearance'  && perms.canChangeAppearance && <AppearanceSettings settings={settings} onSave={handleSettings}/>}
      </main>
    </div>
  );
}

// ── Appearance Settings (available to all roles) ──────────────────────────────
function AppearanceSettings({ settings, onSave }) {
  const [fontSize, setFontSize] = React.useState(settings?.fontSize || 'md');
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => { setFontSize(settings?.fontSize || 'md'); }, [settings]);

  const handleSave = async () => {
    await onSave({ ...settings, fontSize });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const SIZES = [
    { id:'sm', label:'Small',   px:'13px', desc:'Compact — more content on screen' },
    { id:'md', label:'Medium',  px:'15px', desc:'Default — balanced readability' },
    { id:'lg', label:'Large',   px:'17px', desc:'Comfortable — easier on the eyes' },
    { id:'xl', label:'X-Large', px:'19px', desc:'Bold — best for larger screens' },
  ];

  return (
    <div className="bs-settings">
      <div className="bs-inv-bar" style={{marginBottom:'20px'}}>
        <h2 className="bs-h2" style={{margin:0}}>🎨 Appearance</h2>
        {saved && <span className="bs-saved-badge">✅ Saved!</span>}
      </div>

      <div className="bs-settings-grid">
        <div className="bs-settings-card span2">
          <p className="bs-dcard-ttl">🔡 Font Size</p>
          <p className="bs-muted" style={{marginBottom:'16px',fontSize:'12px'}}>
            Adjust the text size across the entire app. Changes apply immediately.
          </p>
          <div style={{display:'flex',flexDirection:'column',gap:'10px',maxWidth:'480px'}}>
            {SIZES.map(opt => (
              <button key={opt.id} type="button"
                onClick={() => {
                  setFontSize(opt.id);
                  // Live preview — same property JS sets on load
                  document.documentElement.style.setProperty('--bs-font-size', opt.px);
                }}
                style={{
                  display:'flex', alignItems:'center', gap:'16px',
                  padding:'14px 18px', borderRadius:'12px', cursor:'pointer', textAlign:'left',
                  background: fontSize===opt.id ? 'rgba(56,189,248,.1)' : 'rgba(255,255,255,.03)',
                  border: fontSize===opt.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,.08)',
                  transition:'all .15s',
                }}>
                <span style={{
                  fontSize: opt.px, fontWeight:700,
                  color: fontSize===opt.id ? '#38bdf8' : '#94a3b8',
                  minWidth:'28px', lineHeight:1,
                }}>Aa</span>
                <div>
                  <p style={{fontSize:'13px', fontWeight:600, color: fontSize===opt.id ? '#e2e8f0' : '#64748b', marginBottom:'2px'}}>
                    {opt.label} <span style={{fontFamily:'monospace',fontSize:'11px',color:'#475569'}}>({opt.px})</span>
                  </p>
                  <p style={{fontSize:'11px', color:'#475569'}}>{opt.desc}</p>
                </div>
                {fontSize===opt.id && <span style={{marginLeft:'auto', color:'#38bdf8', fontSize:'18px'}}>✓</span>}
              </button>
            ))}
          </div>

          {/* Live preview box */}
          <div style={{marginTop:'20px', background:'#0d1526', border:'1px dashed #2a3a5c', borderRadius:'10px', padding:'16px 20px'}}>
            <p style={{fontSize:'10px', color:'#64748b', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'10px'}}>Live Preview</p>
            <p style={{fontSize:'var(--bs-font-size)', fontWeight:700, color:'#f0f4ff', marginBottom:'4px'}}>Product Name · $29.99</p>
            <p style={{fontSize:'calc(var(--bs-font-size) - 2px)', color:'#94a3b8'}}>Stock: 12 units · Category: Books · Barcode: 978-0743273565</p>
          </div>
        </div>
      </div>

      <div style={{display:'flex', justifyContent:'flex-end', marginTop:'24px'}}>
        <button className="bs-pri" style={{padding:'11px 28px', fontSize:'14px'}} onClick={handleSave}>
          💾 Save Appearance
        </button>
      </div>
    </div>
  );
}
