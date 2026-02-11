import { useState } from "react";
import { authFetch } from "../api/client";

export function AccessRequestForm({ datasetId }: { datasetId: number }) {
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const submit = async () => {
    setStatus("submitting");
    await authFetch("/access-requests/", {
      method: "POST",
      body: JSON.stringify({ dataset_id: datasetId, reason }),
    });
    setStatus("success");
  };

  if (status === "success") return <div>Request submitted.</div>;

  return (
    <div>
      <textarea value={reason} onChange={e => setReason(e.target.value)} />
      <button onClick={submit} disabled={status === "submitting"}>
        Request Access
      </button>
    </div>
  );
}
