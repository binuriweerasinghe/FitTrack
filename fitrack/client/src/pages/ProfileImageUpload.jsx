import { useState } from "react";
import { api } from "../lib/api";
import { getUserId } from "../lib/auth";

export default function ProfileImageUpload({ onUploaded }) {
  const uid = getUserId();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return alert("Please choose a file first");

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const { data } = await api.post(`/users/${uid}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Uploaded successfully");
      if (onUploaded) onUploaded(data.user.profileImage); // update parent
    } catch (e) {
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={upload}
        style={{
          backgroundColor: "#007bff", // blue color
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
