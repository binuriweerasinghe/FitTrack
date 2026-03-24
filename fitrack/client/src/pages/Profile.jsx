import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { getUserId, clearUserId } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import ProfileImageUpload from "./ProfileImageUpload";
import "./Profile.css"; // <-- import CSS file

export default function Profile() {
  const nav = useNavigate();
  const uid = getUserId();
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    weight: "",
    height: "",
    fitnessGoals: "",
  });

  useEffect(() => {
    if (!uid) return nav("/login");
    api
      .get(`/users/${uid}`)
      .then(({ data }) => {
        setUser(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          age: data.age ?? "",
          weight: data.weight ?? "",
          height: data.height ?? "",
          fitnessGoals: data.fitnessGoals || "",
          password: "",
        });
      })
      .catch(() => nav("/login"));
  }, [uid, nav]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    try {
      const body = {
        name: form.name,
        email: form.email,
        age: form.age !== "" ? Number(form.age) : undefined,
        weight: form.weight !== "" ? Number(form.weight) : undefined,
        height: form.height !== "" ? Number(form.height) : undefined,
        fitnessGoals: form.fitnessGoals,
      };

      if (form.password) body.password = form.password;

      const { data } = await api.put(`/users/${uid}`, { ...body, userId: uid });

      if (data.forceLogout) {
        alert("Email or password changed. Please login again.");
        clearUserId();
        nav("/login");
        return;
      }

      setUser(data.user);
      setForm({ ...form, password: "" });
      setEdit(false);
      alert("Profile updated successfully!");
    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }
  };

  const remove = async () => {
    if (!confirm("Delete your account? This cannot be undone.")) return;
    try {
      await api.delete(`/users/${uid}`, { data: { userId: uid } });
      clearUserId();
      nav("/login");
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  const logout = () => {
    clearUserId();
    nav("/login");
  };

  const deleteProfileImage = async () => {
    if (!confirm("Delete your profile picture?")) return;
    try {
      await api.delete(`/users/${uid}/profile-image`);
      setUser({ ...user, profileImage: "" });
      alert("✅ Profile picture deleted");
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="profile-title">Profile</h2>
        <div className="profile-actions">
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
          <button onClick={remove} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      {/* ---- Profile Picture Section ---- */}
      <div className="profile-picture">
        {user.profileImage ? (
          <>
            <img src={user.profileImage} alt="Profile" className="profile-img" />
            <button onClick={deleteProfileImage} className="btn btn-danger">
              Delete Picture
            </button>
          </>
        ) : (
          
          <p>No profile picture uploaded</p>
        )}

        <ProfileImageUpload
          userId={uid}
          onUploadSuccess={(imgPath) =>
            setUser({ ...user, profileImage: imgPath })
          }
        />
      </div>

      {/* ---- Profile Info ---- */}
      {edit ? (
        <div className="profile-form">
          <input
            className="form-input"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Name"
          />
          <input
            className="form-input"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
          />
          <input
            className="form-input"
            type="number"
            name="age"
            value={form.age}
            onChange={onChange}
            placeholder="Age"
          />
          <input
            className="form-input"
            type="number"
            name="weight"
            value={form.weight}
            onChange={onChange}
            placeholder="Weight (kg)"
          />
          <input
            className="form-input"
            type="number"
            name="height"
            value={form.height}
            onChange={onChange}
            placeholder="Height (cm)"
          />
          <input
            className="form-input"
            name="fitnessGoals"
            value={form.fitnessGoals}
            onChange={onChange}
            placeholder="Fitness Goals"
          />
          <input
            className="form-input"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="New password (optional)"
          />
          <div className="form-actions">
            <button onClick={save} className="btn btn-primary">
              Save
            </button>
            <button onClick={() => setEdit(false)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-info">
          <p>
            <b>Name:</b> {user.name}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Age:</b> {user.age ?? "-"}
          </p>
          <p>
            <b>Weight:</b> {user.weight ?? "-"}
          </p>
          <p>
            <b>Height:</b> {user.height ?? "-"}
          </p>
          <p>
            <b>Fitness Goals:</b> {user.fitnessGoals || "-"}
          </p>
          <button onClick={() => setEdit(true)} className="btn btn-primary">
            Edit
          </button>
        </div>
      )}
    </div>
  );
}





