import React, { useState } from 'react';
import './App.css';
import { LoginPage } from './pages/LoginPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { AccessRequestsPage } from './pages/AccessRequestPage';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access'));
  const [page, setPage] = useState<'datasets' | 'requests'>('datasets');

  const handleLogin = () => {
    setToken(localStorage.getItem('access'));
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setToken(null);
  };

  if (!token) {
    return (
      <div className="App">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="App">
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '1rem' }}>
        <button onClick={() => setPage('datasets')}>Datasets</button>
        <button onClick={() => setPage('requests')}>Access Requests</button>
        <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>Logout</button>
      </nav>
      <main style={{ padding: '1rem' }}>
        {page === 'datasets' && <DatasetsPage />}
        {page === 'requests' && <AccessRequestsPage />}
      </main>
    </div>
  );
}

export default App;
