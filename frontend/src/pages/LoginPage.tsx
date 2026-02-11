import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      onLogin();
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      <div className="form-group">
        <label className="form-label">Username</label>
        <input className="form-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}