import { useEffect, useState } from "react";
import { authFetch } from "../api/client";
import { AccessRequestForm } from "../components/AccessRequestForm";

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
      .then(setDatasets)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Datasets</h2>
      <ul>
        {datasets.map(d => (
          <li key={d.id}>
            <strong>{d.name}</strong> — {d.sensitivity}
            {d.sensitivity !== "public" && <AccessRequestForm datasetId={d.id} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
