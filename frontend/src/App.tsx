import React, { useState, useEffect } from 'react';
import './App.css';
import { LoginPage } from './pages/LoginPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { AccessRequestsPage } from './pages/AccessRequestPage';
import { authFetch } from './api/client';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access'));
  const [page, setPage] = useState<'datasets' | 'requests'>('datasets');

  // Verify token validity when it changes or on mount
  useEffect(() => {
    if (token) {
      // Try to fetch a protected resource to verify the token
      authFetch('/datasets/').then((res) => {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
        }
      }).catch(console.error);
    }
  }, [token]);

  const handleLogin = () => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) setToken(accessToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setToken(null);
  };

  if (!token) {
    return (
      <div className="App login-container">
        <div className="login-box">
          <h1 style={{ marginBottom: '2rem', color: '#333' }}>Data Platform</h1>
          <LoginPage onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="App app-container">
      <nav className="nav">
        <div className="brand">Data Platform</div>
        <div className="nav-links">
          <button
            className={`nav-button ${page === 'datasets' ? 'active' : ''}`}
            onClick={() => setPage('datasets')}
          >
            Datasets
          </button>
          <button
            className={`nav-button ${page === 'requests' ? 'active' : ''}`}
            onClick={() => setPage('requests')}
          >
            Access Requests
          </button>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
      <main className="main-content">
        {page === 'datasets' && <DatasetsPage />}
        {page === 'requests' && <AccessRequestsPage />}
      </main>
    </div>
  );
}

export default App;
