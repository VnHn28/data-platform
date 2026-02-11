import { useEffect, useState } from "react";
import { authFetch } from "../api/client";
import { AccessRequestForm } from "../components/AccessRequestForm";
import "./DatasetsPage.css";

type Dataset = {
  id: number;
  name: string;
  description: string;
  sensitivity: string;
  owner_department: string;
};

export function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDataset, setCurrentDataset] = useState<Partial<Dataset>>({});

  useEffect(() => {
    authFetch("/datasets/")
      .then(res => res.json())
      .then((data: any) => {
        setDatasets(Array.isArray(data) ? data : data.results || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentDataset.id ? 'PATCH' : 'POST';
    const url = currentDataset.id ? `/datasets/${currentDataset.id}/` : '/datasets/';

    try {
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentDataset),
      });
      if (res.ok) {
        const saved = await res.json();
        if (method === 'POST') {
          setDatasets([...datasets, saved]);
        } else {
          setDatasets(datasets.map(d => d.id === saved.id ? saved : d));
        }
        setIsEditing(false);
        setCurrentDataset({});
      }
    } catch (error) {
      console.error("Failed to save dataset", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="datasets-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="datasets-heading" style={{ marginBottom: 0 }}>Available Datasets</h2>
        <button className="btn btn-primary" onClick={() => { setCurrentDataset({}); setIsEditing(true); }}>
          + New Dataset
        </button>
      </div>

      {isEditing && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3>{currentDataset.id ? 'Edit Dataset' : 'Create Dataset'}</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={currentDataset.name || ''} onChange={e => setCurrentDataset({...currentDataset, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" value={currentDataset.description || ''} onChange={e => setCurrentDataset({...currentDataset, description: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Sensitivity</label>
              <select className="form-input" value={currentDataset.sensitivity || 'public'} onChange={e => setCurrentDataset({...currentDataset, sensitivity: e.target.value})}>
                <option value="public">Public</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Owner Department</label>
              <input className="form-input" value={currentDataset.owner_department || ''} onChange={e => setCurrentDataset({...currentDataset, owner_department: e.target.value})} required />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <ul className="datasets-list">
        {datasets.map(d => (
          <li key={d.id} className="dataset-card">
            <div className="dataset-card-header">
              <h3 className="dataset-card-title">{d.name}</h3>
              <button 
                className="btn btn-secondary" 
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginLeft: 'auto', marginRight: '1rem' }}
                onClick={() => { setCurrentDataset(d); setIsEditing(true); }}
              >
                Edit
              </button>
              <span className={`dataset-badge ${d.sensitivity === 'public' ? 'dataset-badge-public' : 'dataset-badge-restricted'}`}>
                {d.sensitivity}
              </span>
            </div>
            <p className="dataset-description">{d.description}</p>
            <div className="dataset-actions">
              {d.sensitivity !== "public" && <AccessRequestForm datasetId={d.id} />}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
