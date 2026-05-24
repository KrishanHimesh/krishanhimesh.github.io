import React, { useState, useMemo, useRef, useEffect } from 'react';
import { makeFmt, CATEGORIES as BASE_CATEGORIES } from './constants';
import BulkImport from './BulkImport';

const BLANK = { productCode:'', name:'', category:'Books', company:'', size:'', price:'', cost:'', stock:'', minStock:'3', unit:'ea', barcode:'', photoUrl:'' };
const getCompanies = products => [...new Set(products.map(p=>p.company).filter(Boolean))].sort();

// ── Rename Brand Modal ────────────────────────────────────────────────────────
function RenameCompanyModal({ products, onUpdate, onClose }) {
  const companies = getCompanies(products);
  const [from,    setFrom]    = useState('');
  const [to,      setTo]      = useState('');
  const [busy,    setBusy]    = useState(false);
  const [done,    setDone]    = useState(null);

  const affected = from ? products.filter(p => p.company === from) : [];

  const handleRename = async () => {
    if (!from || !to.trim() || from === to.trim()) return;
    setBusy(true);
    let count = 0;
    for (const p of affected) {
      await onUpdate(p.id, { ...p, company: to.trim() });
      count++;
    }
    setBusy(false);
    setDone(count);
  };

  return (
    <div className="bs-modal" style={{maxWidth:'420px'}}>
      <div className="bs-mhdr">
        <h3>✏️ Rename Company / Brand</h3>
        <button className="bs-mx" onClick={onClose}>✕</button>
      </div>
      <div className="bs-form">
        {done !== null ? (
          <div style={{textAlign:'center',padding:'20px'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>✅</div>
            <p style={{fontWeight:600,marginBottom:'4px'}}>Renamed successfully!</p>
            <p className="bs-muted" style={{fontSize:'13px',marginBottom:'20px'}}>{done} product{done!==1?'s':''} updated from <strong>"{from}"</strong> → <strong>"{to}"</strong></p>
            <button className="bs-pri" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="bs-fg">
              <label>Select brand to rename</label>
              <select value={from} onChange={e=>{setFrom(e.target.value);setTo(e.target.value);}}>
                <option value="">— choose a brand —</option>
                {companies.map(c=>(
                  <option key={c} value={c}>{c} ({products.filter(p=>p.company===c).length} products)</option>
                ))}
              </select>
            </div>

            {from && (
              <>
                <div className="bs-fg">
                  <label>New brand name</label>
                  <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Enter new name"/>
                </div>

                {affected.length > 0 && (
                  <div style={{background:'rgba(251,146,60,.06)',border:'1px solid rgba(251,146,60,.25)',borderRadius:'9px',padding:'10px 14px',marginBottom:'4px'}}>
                    <p style={{fontSize:'12px',color:'#fb923c',fontWeight:600,marginBottom:'6px'}}>
                      ⚠ This will update {affected.length} product{affected.length!==1?'s':''}:
                    </p>
                    <div style={{maxHeight:'130px',overflowY:'auto'}}>
                      {affected.map(p=>(
                        <p key={p.id} style={{fontSize:'12px',color:'#94a3b8',marginBottom:'2px'}}>
                          • {p.name}{p.size?` · ${p.size}`:''}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="bs-fa">
              <button className="bs-sec" onClick={onClose}>Cancel</button>
              <button className="bs-pri"
                disabled={!from || !to.trim() || from===to.trim() || busy || affected.length===0}
                onClick={handleRename}>
                {busy ? `Renaming ${affected.length}…` : `Rename ${affected.length} Product${affected.length!==1?'s':''}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}



export default function Inventory({ products, photos = {}, onAdd, onUpdate, onDelete, canEdit, canDelete, settings, categories: catProp }) {
  const CATEGORIES = catProp || BASE_CATEGORIES;
  const fmt = makeFmt(settings?.currencySymbol || '$');
  const [search,  setSearch]  = useState('');
  const [catF,    setCatF]    = useState('All');
  const [modal,        setModal]        = useState(null);
  const [confirm,      setConfirm]      = useState(null);
  const [renameModal,  setRenameModal]  = useState(false);
  const [sortBy,       setSortBy]       = useState('name');
  const [sortDir,      setSortDir]      = useState('asc');

  const cats = ['All', ...Object.keys(CATEGORIES)];

  const SORT_OPTIONS = [
    { id:'name',     label:'Product Name' },
    { id:'company',  label:'Brand' },
    { id:'category', label:'Category' },
    { id:'stock',    label:'Stock' },
    { id:'price',    label:'Price' },
    { id:'cost',     label:'Cost' },
    { id:'margin',   label:'Margin' },
  ];

  const toggleSort = col => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = products.filter(p =>
      (!q || p.name?.toLowerCase().includes(q)
          || (p.barcode||'').includes(q)
          || (p.productCode||'').toLowerCase().includes(q)
          || (p.company||'').toLowerCase().includes(q)
          || (p.size||'').toLowerCase().includes(q))
      && (catF === 'All' || p.category === catF)
    );
    return list.sort((a, b) => {
      let av, bv;
      if (sortBy === 'margin') {
        av = a.price ? ((a.price - (a.cost||0)) / a.price) : 0;
        bv = b.price ? ((b.price - (b.cost||0)) / b.price) : 0;
      } else {
        av = (a[sortBy] ?? '');
        bv = (b[sortBy] ?? '');
      }
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [products, search, catF, sortBy, sortDir]);

  const totalValue = products.reduce((s,p)=>s+p.price*p.stock,0);
  const totalCost  = products.reduce((s,p)=>s+(p.cost||0)*p.stock,0);

  const handleSave = async data => {
    if (data.id) await onUpdate(data.id, data);
    else         await onAdd(data);
    setModal(null);
  };

  const handleTopupSave = async (id, topupData) => {
    const prod = products.find(p=>p.id===id);
    if (!prod) return;
    await onUpdate(id, { stock: prod.stock+topupData.addQty, cost: topupData.newCost, price: topupData.newPrice, lastTopup: topupData.receiveDate, lastMemo: topupData.memo });
    setModal(null);
  };

  const handleDelete = async id => { await onDelete(id); setConfirm(null); };
  const productLabel = p => [p.company, p.name, p.size].filter(Boolean).join(' · ');

  return (
    <div className="bs-inv">
      <div className="bs-inv-summary">
        <div className="bs-inv-sum-item"><span className="bs-muted">Total Products</span><strong>{products.length}</strong></div>
        <div className="bs-inv-sum-item"><span className="bs-muted">Stock Value</span><strong className="bs-green">{fmt(totalValue)}</strong></div>
        <div className="bs-inv-sum-item"><span className="bs-muted">Cost Value</span><strong style={{color:'#fb923c'}}>{fmt(totalCost)}</strong></div>
        <div className="bs-inv-sum-item"><span className="bs-muted">Potential Profit</span><strong style={{color:'#818cf8'}}>{fmt(totalValue-totalCost)}</strong></div>
      </div>

      <div className="bs-inv-bar">
        <div className="bs-inv-bar-l">
          <input className="bs-inp" style={{width:'220px'}} placeholder="🔍 Search name / code / barcode…" value={search} onChange={e=>setSearch(e.target.value)}/>
          {/* Sort controls */}
          <div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
            <span style={{fontSize:'11px',color:'#475569',whiteSpace:'nowrap'}}>Sort:</span>
            <select
              value={sortBy}
              onChange={e=>{ setSortBy(e.target.value); setSortDir('asc'); }}
              style={{fontSize:'12px',padding:'5px 8px',background:'#1a2540',border:'1px solid #2a3a5c',borderRadius:'7px',color:'#94a3b8',cursor:'pointer'}}>
              {SORT_OPTIONS.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
            <button
              onClick={()=>setSortDir(d=>d==='asc'?'desc':'asc')}
              style={{
                padding:'5px 9px',background:'#1a2540',border:'1px solid #2a3a5c',
                borderRadius:'7px',color:'#94a3b8',cursor:'pointer',fontSize:'13px',lineHeight:1,
              }}
              title={sortDir==='asc'?'Ascending (click to flip)':'Descending (click to flip)'}>
              {sortDir==='asc'?'↑':'↓'}
            </button>
          </div>
          <div className="bs-pills">
            {cats.map(c=><button key={c} className={'bs-pill'+(catF===c?' a':'')} onClick={()=>setCatF(c)}>{c==='All'?'All':CATEGORIES[c]?.icon+' '+c}</button>)}
          </div>
        </div>
        {canEdit && (
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap',flexShrink:0}}>
            <button className="bs-import-btn" onClick={()=>setModal({type:'bulk'})}>📂 Bulk Import</button>
            <button className="bs-sec" style={{padding:'7px 14px',fontSize:'12px'}} onClick={()=>setRenameModal(true)}>✏️ Rename Brand</button>
            <button className="bs-add" onClick={()=>setModal({type:'add',data:null})}>+ Add Product</button>
          </div>
        )}
      </div>

      <div className="bs-tbl-wrap">
        <table className="bs-tbl">
          <thead>
            <tr>
              {/* Sortable column headers */}
              {[
                ['code',     'Code'],
                ['name',     'Product (Brand · Name · Size)'],
                [null,       'Photo'],
                ['category', 'Category'],
                [null,       'Barcode'],
                ['price',    'Sale Price'],
                ['cost',     'Cost'],
                ['margin',   'Margin'],
                ['stock',    'Stock'],
                [null,       'Unit'],
                [null,       'Min'],
                [null,       'Last Receive'],
              ].map(([col, label]) => (
                <th key={label}
                  onClick={col ? ()=>toggleSort(col) : undefined}
                  style={col?{cursor:'pointer',userSelect:'none',whiteSpace:'nowrap'}:{}}>
                  {label}
                  {col && sortBy===col && <span style={{marginLeft:'4px',color:'#38bdf8'}}>{sortDir==='asc'?'↑':'↓'}</span>}
                </th>
              ))}
              {canEdit && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const margin = p.price>0 ? ((p.price-(p.cost||0))/p.price*100).toFixed(0) : 0;
              return (
                <tr key={p.id} className={p.stock===0?'tr-out':p.stock<=p.minStock?'tr-low':''}>
                  <td><span className="bs-isbn" style={{color:'#38bdf8'}}>{p.productCode||'—'}</span></td>
                  <td>
                    <p className="bs-ttl">{productLabel(p)}</p>
                    {p.lastMemo&&<p className="bs-isbn">memo: {p.lastMemo}</p>}
                  </td>
                  <td>{(photos[p.id] || p.photoUrl) ? <img src={photos[p.id] || p.photoUrl} alt="" style={{width:32,height:32,objectFit:'cover',borderRadius:4}}/> : <span className="bs-muted">—</span>}</td>
                  <td><span className="bs-cbadge" style={{borderColor:CATEGORIES[p.category]?.color,color:CATEGORIES[p.category]?.color}}>{CATEGORIES[p.category]?.icon} {p.category}</span></td>
                  <td><span className="bs-isbn">{p.barcode||'—'}</span></td>
                  <td><strong>{fmt(p.price)}</strong></td>
                  <td>{fmt(p.cost||0)}</td>
                  <td><span style={{color:margin>30?'#34d399':margin>15?'#fb923c':'#f87171'}}>{margin}%</span></td>
                  <td><span className={'bs-snum '+(p.stock===0?'red':p.stock<=p.minStock?'ora':'grn')}>{p.stock}</span></td>
                  <td className="bs-muted">{p.unit||'ea'}</td>
                  <td className="bs-muted">{p.minStock}</td>
                  <td className="bs-muted" style={{fontSize:'11px'}}>{p.lastTopup||'—'}</td>
                  {canEdit && (
                    <td>
                      <div className="bs-acts">
                        <button className="bs-act edit" onClick={()=>setModal({type:'edit',data:{...p}})}>Edit</button>
                        {canDelete && <button className="bs-act del"  onClick={()=>setConfirm(p.id)}>Del</button>}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0&&<p className="bs-muted" style={{padding:'32px',textAlign:'center'}}>No products found.</p>}
      </div>

      {(modal?.type==='add'||modal?.type==='edit') && (
        <div className="bs-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <ProductForm
            product={modal.data ? { ...modal.data, photoUrl: photos[modal.data.id] || modal.data.photoUrl || '' } : undefined}
            onSave={handleSave} onClose={()=>setModal(null)} fmt={fmt}
            existingCompanies={getCompanies(products)}
            existingCodes={products.map(p=>p.productCode).filter(Boolean)}
            categories={CATEGORIES}/>
        </div>
      )}
      {modal?.type==='bulk' && (
        <div className="bs-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <BulkImport onAdd={onAdd} onUpdate={onUpdate} products={products} photos={photos} onClose={()=>setModal(null)} categories={CATEGORIES}/>
        </div>
      )}
      {renameModal && (
        <div className="bs-overlay" onClick={e=>e.target===e.currentTarget&&setRenameModal(false)}>
          <RenameCompanyModal products={products} onUpdate={onUpdate} onClose={()=>setRenameModal(false)}/>
        </div>
      )}
      {confirm && (
        <div className="bs-overlay" onClick={e=>e.target===e.currentTarget&&setConfirm(null)}>
          <div className="bs-modal" style={{maxWidth:'360px',padding:'28px'}}>
            <h3 style={{marginBottom:'12px'}}>Delete Product?</h3>
            <p className="bs-muted" style={{marginBottom:'20px'}}>This cannot be undone.</p>
            <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
              <button className="bs-sec" onClick={()=>setConfirm(null)}>Cancel</button>
              <button className="bs-act del" style={{padding:'9px 18px'}} onClick={()=>handleDelete(confirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Product Code Generator ────────────────────────────────────────────────────
// Format: CAT2-BRD2-PRD2-SZ2-VV  (always 14 chars: 2+1+2+1+2+1+2+1+2 = fixed)
// e.g. BK-NP-CO-5K-01
const CATEGORY_CODES = {
  Books:     'BK',
  Groceries: 'GR',
  Supplies:  'SP',
  Other:     'OT',
};

function slugPart(str, len) {
  return (str || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')   // strip non-alphanumeric
    .slice(0, len)
    .padEnd(len, 'X');            // pad with X if too short
}

function buildBaseCode(category, company, name, size) {
  const cat = CATEGORY_CODES[category] || 'OT';
  const brd = slugPart(company, 2);
  const prd = slugPart(name, 2);
  const sz  = slugPart(size, 2);
  return `${cat}-${brd}-${prd}-${sz}`;   // 11 chars
}

function generateProductCode(category, company, name, size, existingCodes, currentCode) {
  const base = buildBaseCode(category, company, name, size);
  // Find all existing codes with same base (excluding current product being edited)
  const taken = new Set(
    existingCodes
      .filter(c => c !== currentCode && c && c.startsWith(base + '-'))
      .map(c => {
        const ver = c.slice(base.length + 1);
        return parseInt(ver, 10);
      })
      .filter(n => !isNaN(n))
  );
  // Find lowest available version starting from 01
  let ver = 1;
  while (taken.has(ver)) ver++;
  return `${base}-${String(ver).padStart(2, '0')}`;  // always 14 chars
}

function ProductForm({ product, onSave, onClose, fmt, existingCompanies, existingCodes, categories: catProp }) {
  const CATEGORIES = catProp || BASE_CATEGORIES;
  const [f,         setF]         = useState(product || BLANK);
  const [showNewCo, setShowNewCo] = useState(false);
  const [scanning,  setScanning]  = useState(false);
  const [errors,    setErrors]    = useState({});
  const [codeManual,setCodeManual]= useState(!!product); // editing = manual, new = auto
  const videoRef = useRef(null);

  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const clearErr = k => setErrors(e => { const n={...e}; delete n[k]; return n; });

  const margin = f.price && f.cost ? (((+f.price - +f.cost) / +f.price) * 100).toFixed(0) : null;

  // Auto-regenerate code whenever key fields change (only for new products, not manual edits)
  useEffect(() => {
    if (codeManual) return;
    const code = generateProductCode(f.category, f.company, f.name, f.size, existingCodes, product?.productCode);
    setF(p => ({ ...p, productCode: code }));
  }, [f.category, f.company, f.name, f.size, codeManual]); // eslint-disable-line

  const validate = () => {
    const e = {};
    if (!f.name?.trim())        e.name        = 'Product name is required';
    if (!f.price || +f.price <= 0) e.price    = 'Sale price must be greater than 0';
    if (f.cost && +f.cost < 0)  e.cost        = 'Cost price cannot be negative';
    if (f.stock === '' || f.stock === undefined) e.stock = 'Stock quantity is required';
    if (+f.stock < 0)           e.stock       = 'Stock cannot be negative';
    if (!f.productCode?.trim()) e.productCode = 'Product code is required';
    const dup = existingCodes.find(c => c === f.productCode && (!product || product.productCode !== c));
    if (dup)                    e.productCode = 'This product code already exists — change a field or edit version manually';
    if (+f.minStock < 0)        e.minStock    = 'Min stock cannot be negative';
    return e;
  };

  const submit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...f, price: +f.price, cost: +(f.cost || 0), stock: +f.stock, minStock: +(f.minStock || 3) });
  };

  const scannerRef = useRef(null);

  useEffect(() => () => {
    if (scannerRef.current) { try { scannerRef.current.reset(); } catch {} scannerRef.current = null; }
  }, []);

  const stopBarcodeCamera = () => {
    if (scannerRef.current) {
      try { scannerRef.current.reset(); } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const startBarcodeCamera = async () => {
    setScanning(true);
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      const codeReader = new BrowserMultiFormatReader();
      scannerRef.current = codeReader;
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (!devices || devices.length === 0) throw new Error('No camera found');
      const backCamera = devices.find(d => /back|rear|environment/i.test(d.label)) || devices[devices.length - 1];
      let scanned = false;
      await codeReader.decodeFromVideoDevice(backCamera?.deviceId, videoRef.current, (result) => {
        if (result && !scanned) {
          scanned = true;
          set('barcode', result.getText());
          stopBarcodeCamera();
        }
      });
    } catch (err) {
      alert('Camera error: ' + (err.message || 'Could not access camera'));
      setScanning(false);
    }
  };

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    const MAX_PX = 600;
    const QUALITY = 0.80;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > MAX_PX || height > MAX_PX) {
        if (width >= height) { height = Math.round(height * MAX_PX / width); width = MAX_PX; }
        else                 { width  = Math.round(width  * MAX_PX / height); height = MAX_PX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      // Store as base64 in form state — useStore.addProduct/updateProduct will
      // detect the "data:" prefix and upload to Firebase Storage, replacing it with a URL.
      set('photoUrl', canvas.toDataURL('image/jpeg', QUALITY));
    };
    img.src = objectUrl;
  };

  const Err = ({ k }) => errors[k]
    ? <span style={{color:'#f87171',fontSize:'11px',marginTop:'3px',display:'block'}}>⚠ {errors[k]}</span>
    : null;

  const fieldStyle = k => ({ borderColor: errors[k] ? '#f87171' : '' });

  return (
    <div className="bs-modal" style={{maxWidth:'580px'}}>
      <div className="bs-mhdr">
        <h3>{product ? 'Edit Product' : 'Add Product'}</h3>
        <button className="bs-mx" onClick={onClose}>✕</button>
      </div>
      <form className="bs-form" onSubmit={submit}>

        {/* Summary error banner */}
        {Object.keys(errors).length > 0 && (
          <div style={{background:'rgba(248,113,113,.08)',border:'1px solid rgba(248,113,113,.3)',borderRadius:'8px',padding:'10px 14px',marginBottom:'12px',fontSize:'12px',color:'#f87171'}}>
            ⚠ Please fix {Object.keys(errors).length} error{Object.keys(errors).length>1?'s':''} before saving.
          </div>
        )}

        {/* Product Name — first so code auto-generates */}
        <div className="bs-frow">
          <div className="bs-fg span2">
            <label>Product Name *</label>
            <input value={f.name||''} onChange={e=>{set('name',e.target.value);clearErr('name');}} placeholder="Product name" style={fieldStyle('name')}/>
            <Err k="name"/>
          </div>
        </div>

        {/* Company dropdown */}
        <div className="bs-frow">
          <div className="bs-fg">
            <label>Company / Brand</label>
            {!showNewCo && existingCompanies.length > 0 ? (
              <div style={{display:'flex',gap:'6px'}}>
                <select style={{flex:1}} value={f.company||''} onChange={e=>{if(e.target.value==='__new__'){setShowNewCo(true);set('company','');}else set('company',e.target.value);}}>
                  <option value="">— select or add —</option>
                  {existingCompanies.map(c=><option key={c} value={c}>{c}</option>)}
                  <option value="__new__">+ Add new…</option>
                </select>
                <button type="button" className="bs-sec" style={{padding:'6px 8px',fontSize:'11px'}} onClick={()=>setShowNewCo(true)}>+</button>
              </div>
            ) : (
              <div style={{display:'flex',gap:'6px'}}>
                <input style={{flex:1}} value={f.company||''} onChange={e=>set('company',e.target.value)} placeholder="Brand name"/>
                {existingCompanies.length>0&&<button type="button" className="bs-sec" style={{padding:'6px 8px',fontSize:'11px'}} onClick={()=>setShowNewCo(false)}>List</button>}
              </div>
            )}
          </div>
          <div className="bs-fg">
            <label>Size / Volume</label>
            <input value={f.size||''} onChange={e=>set('size',e.target.value)} placeholder="e.g. 500ml, 5kg"/>
          </div>
        </div>

        <div className="bs-frow">
          <div className="bs-fg">
            <label>Category</label>
            <select value={f.category} onChange={e=>set('category',e.target.value)}>
              {Object.keys(CATEGORIES).map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="bs-fg">
            <label>Unit</label>
            <select value={f.unit||'ea'} onChange={e=>set('unit',e.target.value)}>
              {['ea','kg','g','L','ml','box','pack','bag','btl','ream','roll','dozen'].map(u=><option key={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Auto-generated Product Code */}
        <div className="bs-fg">
          <label style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span>Product Code * <span style={{color:'#64748b',fontWeight:400,fontSize:'11px'}}>(auto-generated · 14 chars fixed)</span></span>
            {!product && (
              <button type="button" onClick={()=>{setCodeManual(m=>!m);clearErr('productCode');}}
                style={{fontSize:'11px',color:codeManual?'#fb923c':'#38bdf8',background:'none',border:'none',cursor:'pointer',padding:0}}>
                {codeManual ? '↺ Auto-generate' : '✏ Edit manually'}
              </button>
            )}
          </label>
          <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
            <input
              value={f.productCode||''}
              onChange={e=>{set('productCode',e.target.value.toUpperCase().slice(0,14));clearErr('productCode');setCodeManual(true);}}
              readOnly={!codeManual && !product}
              placeholder="Fill in Name + Brand + Size above"
              style={{...fieldStyle('productCode'), fontFamily:'monospace', letterSpacing:'1px', flex:1,
                background: (!codeManual && !product) ? 'rgba(56,189,248,.05)' : ''}}
              maxLength={14}
            />
            <span style={{fontSize:'11px',color: f.productCode?.length===14 ? '#34d399':'#64748b',fontFamily:'monospace',whiteSpace:'nowrap'}}>
              {f.productCode?.length||0}/14
            </span>
          </div>
          {/* Show what each segment means */}
          {f.productCode && f.productCode.length === 14 && (
            <p style={{fontSize:'10px',color:'#64748b',marginTop:'3px',fontFamily:'monospace'}}>
              {f.productCode.slice(0,2)} = category &nbsp;·&nbsp;
              {f.productCode.slice(3,5)} = brand &nbsp;·&nbsp;
              {f.productCode.slice(6,8)} = product &nbsp;·&nbsp;
              {f.productCode.slice(9,11)} = size &nbsp;·&nbsp;
              {f.productCode.slice(12,14)} = version
            </p>
          )}
          <Err k="productCode"/>
        </div>

        <div className="bs-frow">
          <div className="bs-fg">
            <label>Sale Price *</label>
            <input type="number" step="0.01" min="0" value={f.price||''} onChange={e=>{set('price',e.target.value);clearErr('price');}} placeholder="0.00" style={fieldStyle('price')}/>
            <Err k="price"/>
          </div>
          <div className="bs-fg">
            <label>Cost Price</label>
            <input type="number" step="0.01" min="0" value={f.cost||''} onChange={e=>{set('cost',e.target.value);clearErr('cost');}} placeholder="0.00" style={fieldStyle('cost')}/>
            <Err k="cost"/>
          </div>
        </div>

        {margin !== null && (
          <div className="bs-margin-info">Margin: <strong style={{color:margin>30?'#34d399':margin>15?'#fb923c':'#f87171'}}>{margin}%</strong> · Profit/unit: {fmt((+f.price||0)-(+f.cost||0))}</div>
        )}

        <div className="bs-frow">
          <div className="bs-fg">
            <label>Stock Qty *</label>
            <input type="number" min="0" value={f.stock||''} onChange={e=>{set('stock',e.target.value);clearErr('stock');}} placeholder="0" style={fieldStyle('stock')}/>
            <Err k="stock"/>
          </div>
          <div className="bs-fg">
            <label>Min Stock Alert</label>
            <input type="number" min="0" value={f.minStock||''} onChange={e=>{set('minStock',e.target.value);clearErr('minStock');}} placeholder="3" style={fieldStyle('minStock')}/>
            <Err k="minStock"/>
          </div>
        </div>

        {/* Barcode with camera scan */}
        <div className="bs-fg">
          <label>Barcode</label>
          <div style={{display:'flex',gap:'6px'}}>
            <input style={{flex:1}} value={f.barcode||''} onChange={e=>set('barcode',e.target.value)} placeholder="Scan or type barcode"/>
            <button type="button" className="bs-sec" style={{padding:'6px 10px'}} onClick={startBarcodeCamera} title="Scan with camera">📷</button>
          </div>
          {scanning && (
            <div style={{marginTop:'8px',background:'#0d1526',borderRadius:'8px',overflow:'hidden'}}>
              <video ref={videoRef} style={{width:'100%',maxHeight:'220px',objectFit:'cover',borderRadius:'8px 8px 0 0',border:'2px solid #38bdf8'}} muted playsInline autoPlay/>
              <p style={{textAlign:'center',fontSize:'12px',color:'#94a3b8',padding:'6px'}}>
                Point camera at barcode ·
                <button type="button" className="bs-link-btn" onClick={stopBarcodeCamera} style={{marginLeft:'6px'}}>Cancel</button>
              </p>
            </div>
          )}
        </div>

        {/* Photo upload */}
        <div className="bs-fg">
          <label>Product Photo (shown on POS)</label>
          <div style={{display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap'}}>
            {f.photoUrl
              ? <img src={f.photoUrl} alt="" style={{width:56,height:56,objectFit:'cover',borderRadius:8,border:'1px solid #2a3a5c',flexShrink:0}}/>
              : <div style={{width:56,height:56,borderRadius:8,border:'1px dashed #2a3a5c',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',flexShrink:0}}>📷</div>
            }
            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              <div style={{display:'flex',gap:'7px',flexWrap:'wrap'}}>
                <label className="bs-sec" style={{padding:'7px 14px',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:'5px'}}>
                  📷 {f.photoUrl ? 'Change' : 'Add Photo'}
                  <input type="file" accept="image/*" style={{display:'none'}} onChange={handlePhoto}/>
                </label>
                {f.photoUrl && <button type="button" className="bs-act del" onClick={()=>set('photoUrl','')} style={{padding:'6px 10px'}}>Remove</button>}
              </div>
              {f.photoUrl && f.photoUrl.startsWith('data:') && (
                <span style={{fontSize:'11px',color:'#facc15'}}>💾 Will save to Firestore on save (resized to 600px)</span>
              )}
              {f.photoUrl && !f.photoUrl.startsWith('data:') && (
                <span style={{fontSize:'11px',color:'#34d399'}}>✓ Saved in Firestore photo collection</span>
              )}
              {!f.photoUrl && (
                <span style={{fontSize:'11px',color:'#475569'}}>Auto-resized to 600px · JPEG 80% · stored in cloud</span>
              )}
            </div>
          </div>
        </div>

        <div className="bs-fa">
          <button type="button" className="bs-sec" onClick={onClose}>Cancel</button>
          <button type="submit" className="bs-pri">{product ? 'Save Changes' : 'Add Product'}</button>
        </div>
      </form>
    </div>
  );
}
