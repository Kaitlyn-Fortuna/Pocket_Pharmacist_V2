const API_URL = "https://x341fqukm8.execute-api.us-east-1.amazonaws.com/Production"; // 🔴 PASTE YOUR API URL HERE

// POST /presigned-url
export async function getPresignedUploadUrl() {
  const res = await fetch(`${API_URL}/presigned-url`);
  if (!res.ok) throw new Error("Failed to get presigned URL");
  const { upload_url, s3_key } = await res.json();
  return { uploadUrl: upload_url, objectKey: s3_key };
}

// PUT directly to S3 using presigned URL (browser → S3, never touches your backend)
export async function uploadToS3(presignedUrl, imageBlob) {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    body: imageBlob,
    headers: { "Content-Type": "image/jpeg" },
  });
  if (!res.ok) throw new Error("Failed to upload to S3");
  return true;
}

// POST /scan — sends only s3_key + user_id to Lambda
export async function analyzePhoto(objectKey) {
  const res = await fetch(`${API_URL}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      s3_key: objectKey,
      user_id: "demo-user-1",
    }),
  });
  if (!res.ok) throw new Error("Failed to analyze photo");
  const data = await res.json();

  // Remap backend shape → frontend shape
  return {
    detectedDrug: data.drug_name,
    summary: data.summary,
    interactions: (data.interactions || []).map((i) => ({
      medication: i,
      severity: data.urgency?.toLowerCase() === "high" ? "high" : "low",
      description: "",
    })),
    warnings: data.warnings || [],
    dosage: data.dosage,
    hasDangerousInteraction: data.urgency === "HIGH",
  };
}

// GET /medications
export async function getMedications() {
  const res = await fetch(`${API_URL}/medications`);
  if (!res.ok) throw new Error("Failed to fetch medications");
  return res.json();
  // Expected: [{ id, name, dosage, frequency, addedAt }]
}

// POST /medications
export async function addMedication(name, dosage, frequency) {
  const res = await fetch(`${API_URL}/medications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, dosage, frequency }),
  });
  if (!res.ok) throw new Error("Failed to add medication");
  return res.json();
  // Expected: { id, name, dosage, frequency, addedAt }
}

// DELETE /medications/{id}
export async function deleteMedication(id) {
  const res = await fetch(`${API_URL}/medications/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete medication");
  return true;
}