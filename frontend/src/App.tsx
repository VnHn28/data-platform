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
      <div className="App" style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h1 style={{ marginBottom: '2rem', color: '#333' }}>Data Platform</h1>
          <LoginPage onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="App" style={styles.appContainer}>
      <nav style={styles.nav}>
        <div style={styles.brand}>Data Platform</div>
        <div style={styles.navLinks}>
          <button
            style={page === 'datasets' ? { ...styles.navButton, ...styles.activeNavButton } : styles.navButton}
            onClick={() => setPage('datasets')}
          >
            Datasets
          </button>
          <button
            style={page === 'requests' ? { ...styles.navButton, ...styles.activeNavButton } : styles.navButton}
            onClick={() => setPage('requests')}
          >
            Access Requests
          </button>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </nav>
      <main style={styles.main}>
        {page === 'datasets' && <DatasetsPage />}
        {page === 'requests' && <AccessRequestsPage />}
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f7fa',
  },
  loginBox: {
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  brand: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginRight: '3rem',
    color: '#111827',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
  },
  navButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#6b7280',
    borderRadius: '4px',
  },
  activeNavButton: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontWeight: 500,
  },
  logoutButton: {
    marginLeft: 'auto',
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
};

export default App;
