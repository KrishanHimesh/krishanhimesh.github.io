import React, { useState } from 'react';

export default function LoginPage({ onLogin, loading }) {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [error, setError] = useState('');
  const [busy,  setBusy]  = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError(''); setBusy(true);
    const res = await onLogin(email.trim(), pass);
    if (!res.ok) setError(res.error || 'Invalid credentials');
    setBusy(false);
  };

  return (
    <div className="bs-login-bg">
      <div className="bs-login-card">
        <div className="bs-login-logo">
          <span className="bs-login-icon">🏪</span>
          <h1 className="bs-login-title">Unity Book Shop</h1>
          <p className="bs-login-sub">Business Management Platform</p>
        </div>

        <form className="bs-login-form" onSubmit={submit}>
          <div className="bs-login-field">
            <label>Email</label>
            <input type="email" placeholder="your@email.com" value={email}
              onChange={e=>setEmail(e.target.value)} autoComplete="username" required />
          </div>
          <div className="bs-login-field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={pass}
              onChange={e=>setPass(e.target.value)} autoComplete="current-password" required />
          </div>
          {error && <div className="bs-login-err">⚠ {error}</div>}
          <button className="bs-login-btn" disabled={busy || loading}>
            {busy ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div className="bs-login-roles">
          <div className="bs-role-pills">
            <span className="bs-rpill owner">👑 Owner — Full Access</span>
            <span className="bs-rpill manager">🔧 Manager — Inventory + Reports</span>
            <span className="bs-rpill cashier">🛒 Cashier — POS Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
