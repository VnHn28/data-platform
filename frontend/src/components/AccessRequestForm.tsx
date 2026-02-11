import { useState } from "react";
import { authFetch } from "../api/client";

export function AccessRequestForm({ datasetId }: { datasetId: number }) {
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    authFetch('/access-requests/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataset: datasetId, reason }),
    }).then(res => {
      if (res.ok) setStatus('success');
      else setStatus('idle');
    });
  };

  if (status === 'success') {
    return <span style={{ color: '#059669', fontSize: '0.875rem' }}>Request Sent</span>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
      <input 
        type="text" 
        placeholder="Reason for access..." 
        value={reason} 
        onChange={e => setReason(e.target.value)} 
        required
        style={{ flex: 1, padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
      />
      <button type="submit" className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} disabled={status === 'submitting'}>
        Request
      </button>
    </form>
  );
}