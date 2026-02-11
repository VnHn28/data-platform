import { useEffect, useState } from "react";
import { authFetch } from "../api/client";

type AccessRequest = {
  id: number;
  user: { username: string };
  dataset: { name: string };
  status: string;
};

export function AccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);

  useEffect(() => {
    authFetch("/access-requests/")
      .then(res => res.json())
      .then((data: any) => {
        setRequests(Array.isArray(data) ? data : data.results || []);
      })
      
  }, []);

  const approve = async (id: number) => {
    await authFetch(`/access-requests/${id}/approve/`, { method: "POST" });
    setRequests(reqs =>
      reqs.map(r => (r.id === id ? { ...r, status: "approved" } : r))
    );
  };

  const reject = async (id: number) => {
    await authFetch(`/access-requests/${id}/reject/`, { method: "POST" });
    setRequests(reqs =>
      reqs.map(r => (r.id === id ? { ...r, status: "rejected" } : r))
    );
  };

  return (
    <div>
      <h2>Access Requests</h2>
      {requests.map(r => (
        <div key={r.id}>
          {r.user.username} → {r.dataset.name} — {r.status}
          {r.status === "pending" && (
            <>
              <button onClick={() => approve(r.id)}>Approve</button>
              <button onClick={() => reject(r.id)}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
