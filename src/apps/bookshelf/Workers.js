import React, { useState } from 'react';
import { ROLES, ROLE_LABELS } from './constants';

const BLANK = { name:'', email:'', password:'', role: ROLES.CASHIER, phone:'' };

export default function Workers({ workers, onAdd, onUpdate, onDelete, profile }) {
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [showPw,  setShowPw]  = useState({});

  const handleSave = async data => {
    if (data.id) await onUpdate(data.id, data);
    else         await onAdd(data);
    setModal(null);
  };

  return (
    <div className="bs-workers">
      <div className="bs-inv-bar">
        <h2 className="bs-h2" style={{margin:0}}>Workers & Access</h2>
        <button className="bs-add" onClick={()=>setModal({data:null})}>+ Add Worker</button>
      </div>

      <div className="bs-workers-grid">
        {workers.map(w => (
          <div key={w.id} className="bs-worker-card">
            <div className="bs-wc-avatar">{(w.name||'?')[0].toUpperCase()}</div>
            <div className="bs-wc-info">
              <p className="bs-wc-name">{w.name}</p>
              <p className="bs-wc-email">{w.email}</p>
              <p className="bs-wc-phone">{w.phone||'—'}</p>
            </div>
            <div className="bs-wc-role">
              <span className={'bs-role-badge '+w.role}>{ROLE_LABELS[w.role]}</span>
            </div>
            <div className="bs-wc-pw">
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:'12px',color:'#64748b'}}>
                {showPw[w.id] ? (w.password||'(Firebase Auth)') : '••••••••'}
              </span>
              <button className="bs-pw-toggle" onClick={()=>setShowPw(p=>({...p,[w.id]:!p[w.id]}))}>
                {showPw[w.id]?'🙈':'👁'}
              </button>
            </div>
            <div className="bs-wc-actions">
              {w.id !== profile?.id && (
                <>
                  <button className="bs-act edit" onClick={()=>setModal({data:{...w}})}>Edit</button>
                  <button className="bs-act del"  onClick={()=>setConfirm(w.id)}>Remove</button>
                </>
              )}
              {w.id === profile?.id && <span className="bs-muted" style={{fontSize:'11px'}}>← You</span>}
            </div>
          </div>
        ))}
        {workers.length === 0 && (
          <div className="bs-worker-card empty">
            <p className="bs-muted">No workers added yet. Add workers so they can log in.</p>
          </div>
        )}
      </div>

      {/* Role permission table */}
      <div className="bs-perm-table-wrap">
        <p className="bs-dcard-ttl" style={{marginBottom:'12px'}}>Role Permissions</p>
        <table className="bs-tbl">
          <thead>
            <tr>
              <th>Permission</th>
              <th>👑 Owner</th>
              <th>🔧 Manager</th>
              <th>🛒 Cashier</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['View Dashboard',    true, true,  false],
              ['POS / Make Sales',  true, true,  true ],
              ['Manage Inventory',  true, true,  false],
              ['View All Reports',  true, true,  false],
              ['Manage Workers',    true, false, false],
              ['Adjust Prices',     true, true,  false],
              ['Delete Records',    true, false, false],
            ].map(([label,...perms])=>(
              <tr key={label}>
                <td>{label}</td>
                {perms.map((p,i)=><td key={i} style={{textAlign:'center'}}>{p?'✅':'—'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="bs-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <WorkerForm worker={modal.data} onSave={handleSave} onClose={()=>setModal(null)}/>
        </div>
      )}
      {confirm && (
        <div className="bs-overlay" onClick={e=>e.target===e.currentTarget&&setConfirm(null)}>
          <div className="bs-modal" style={{maxWidth:'360px',padding:'28px'}}>
            <h3 style={{marginBottom:'12px'}}>Remove Worker?</h3>
            <p className="bs-muted" style={{marginBottom:'20px'}}>They will no longer be able to log in.</p>
            <div style={{display:'flex',gap:'10px',justifyContent:'flex-end'}}>
              <button className="bs-sec" onClick={()=>setConfirm(null)}>Cancel</button>
              <button className="bs-act del" style={{padding:'9px 18px'}} onClick={async()=>{await onDelete(confirm);setConfirm(null);}}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkerForm({ worker, onSave, onClose }) {
  const [f, setF] = useState(worker || BLANK);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const submit = e => { e.preventDefault(); onSave(f); };

  return (
    <div className="bs-modal">
      <div className="bs-mhdr">
        <h3>{worker?'Edit Worker':'Add Worker'}</h3>
        <button className="bs-mx" onClick={onClose}>✕</button>
      </div>
      <form className="bs-form" onSubmit={submit}>
        <div className="bs-frow">
          <div className="bs-fg">
            <label>Full Name *</label>
            <input value={f.name} onChange={e=>set('name',e.target.value)} required placeholder="Worker name"/>
          </div>
          <div className="bs-fg">
            <label>Phone</label>
            <input value={f.phone||''} onChange={e=>set('phone',e.target.value)} placeholder="+61 4xx xxx xxx"/>
          </div>
        </div>
        <div className="bs-fg">
          <label>Email / Username *</label>
          <input type="text" value={f.email} onChange={e=>set('email',e.target.value)} required placeholder="worker@email.com or username"/>
        </div>
        <div className="bs-fg">
          <label>Password *</label>
          <input type="text" value={f.password||''} onChange={e=>set('password',e.target.value)} required={!worker} placeholder={worker?'Leave blank to keep current':'Set a password'}/>
        </div>
        <div className="bs-fg">
          <label>Role</label>
          <select value={f.role} onChange={e=>set('role',e.target.value)}>
            {Object.entries(ROLE_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="bs-role-info">
          {f.role===ROLES.OWNER   && <p>👑 <strong>Owner:</strong> Full access to everything including workers and reports.</p>}
          {f.role===ROLES.MANAGER && <p>🔧 <strong>Manager:</strong> Can manage inventory and view reports. Cannot manage workers.</p>}
          {f.role===ROLES.CASHIER && <p>🛒 <strong>Cashier:</strong> POS only. Cannot view reports or change inventory.</p>}
        </div>
        <div className="bs-fa">
          <button type="button" className="bs-sec" onClick={onClose}>Cancel</button>
          <button type="submit" className="bs-pri">{worker?'Save Changes':'Add Worker'}</button>
        </div>
      </form>
    </div>
  );
}
