import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { getUserId } from "../lib/auth"; // <-- import getUserId
import "./WorkoutForm.css"; // import CSS file

const today = new Date().toISOString().substring(0, 10);
const empty = {
  name: "",
  duration: "",
  calories: "",
  notes: "",
  date: today
};

export default function WorkoutForm() {
  const [form, setForm] = useState(empty);
  const { id } = useParams();
  const nav = useNavigate();
  const editing = Boolean(id);
  const uid = getUserId(); // <-- get current user id

  useEffect(() => {
    if (editing) {
      api.get(`/workouts/${id}?userId=${uid}`) // pass userId as query
        .then(({ data }) => {
          setForm({
            name: data.name ?? "",
            duration: data.duration ?? "",
            calories: data.calories ?? "",
            notes: data.notes ?? "",
            date: data.date ? data.date.substring(0, 10) : ""
          });
        });
    }
  }, [editing, id, uid]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      userId: uid,               // <-- include userId for backend
      duration: Number(form.duration) || 0,
      calories: Number(form.calories) || 0
    };
    if (editing) await api.put(`/workouts/${id}`, payload);
    else await api.post("/workouts", payload);
    nav("/workouts");
  };

  return (
    <div className="workout-form-container">
      <h1 className="form-title">{editing ? "Edit" : "Add"} Workout</h1>
      <form onSubmit={submit} className="workout-form">
        <input
          name="name"
          placeholder="Workout Name"
          value={form.name}
          onChange={onChange}
          className="form-input"
          required
        />
        <input
          name="duration"
          type="number"
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={onChange}
          className="form-input"
          required
        />
        <input
          name="calories"
          type="number"
          placeholder="Calories Burned"
          value={form.calories}
          onChange={onChange}
          className="form-input"
        />
        <input
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={onChange}
          className="form-input"
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={onChange}
          className="form-input"
        />
        <button type="submit" className="submit-btn">
          {editing ? "Update" : "Add"} Workout
        </button>
      </form>
    </div>
  );
}



