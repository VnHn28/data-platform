import { useEffect, useState } from "react";
import { authFetch } from "../api/client";

type AccessRequest = {
  id: number;
  dataset: number;
  user: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
};

export function AccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/access-requests/')
      .then(res => res.json())
      .then((data: any) => {
        setRequests(Array.isArray(data) ? data : data.results || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = (id: number, status: 'approved' | 'rejected') => {
    authFetch(`/access-requests/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(res => {
      if (res.ok) {
        setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
      }
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Access Requests</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
            <th style={{ padding: '0.5rem' }}>Dataset ID</th>
            <th style={{ padding: '0.5rem' }}>User</th>
            <th style={{ padding: '0.5rem' }}>Reason</th>
            <th style={{ padding: '0.5rem' }}>Status</th>
            <th style={{ padding: '0.5rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.5rem' }}>{r.dataset}</td>
              <td style={{ padding: '0.5rem' }}>{r.user}</td>
              <td style={{ padding: '0.5rem' }}>{r.reason}</td>
              <td style={{ padding: '0.5rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '9999px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  backgroundColor: r.status === 'approved' ? '#d1fae5' : r.status === 'rejected' ? '#fee2e2' : '#f3f4f6',
                  color: r.status === 'approved' ? '#065f46' : r.status === 'rejected' ? '#991b1b' : '#374151'
                }}>
                  {r.status}
                </span>
              </td>
              <td style={{ padding: '0.5rem' }}>
                {r.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" style={{ fontSize: '0.75rem' }} onClick={() => updateStatus(r.id, 'approved')}>Approve</button>
                    <button className="btn btn-danger" style={{ fontSize: '0.75rem' }} onClick={() => updateStatus(r.id, 'rejected')}>Deny</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}