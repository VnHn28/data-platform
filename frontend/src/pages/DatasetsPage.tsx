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
      .then((data: any) => {
        setDatasets(Array.isArray(data) ? data : data.results || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Available Datasets</h2>
      <ul style={styles.list}>
        {datasets.map(d => (
          <li key={d.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{d.name}</h3>
              <span style={{
                ...styles.badge,
                backgroundColor: d.sensitivity === 'public' ? '#d1fae5' : '#fee2e2',
                color: d.sensitivity === 'public' ? '#065f46' : '#991b1b',
              }}>
                {d.sensitivity}
              </span>
            </div>
            <p style={styles.description}>{d.description}</p>
            <div style={styles.actions}>
              {d.sensitivity !== "public" && <AccessRequestForm datasetId={d.id} />}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  heading: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem',
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1f2937',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    textTransform: 'uppercase',
  },
  description: {
    color: '#4b5563',
    marginBottom: '1.5rem',
    flexGrow: 1,
  },
  actions: {
    marginTop: 'auto',
  }
};
