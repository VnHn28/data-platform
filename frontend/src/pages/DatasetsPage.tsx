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

  useEffect(() => {
    authFetch("/datasets/")
      .then(res => res.json())
      .then((data: any) => {
        setDatasets(Array.isArray(data) ? data : data.results || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="datasets-container">
      <h2 className="datasets-heading">Available Datasets</h2>
      <ul className="datasets-list">
        {datasets.map(d => (
          <li key={d.id} className="dataset-card">
            <div className="dataset-card-header">
              <h3 className="dataset-card-title">{d.name}</h3>
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
