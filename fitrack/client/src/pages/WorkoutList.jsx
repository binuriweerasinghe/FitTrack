import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { getUserId } from "../lib/auth"; // <-- import getUserId
import "./WorkoutList.css";

export default function WorkoutsList() {
  const [items, setItems] = useState([]);
  const uid = getUserId(); // <-- get current user ID

  const load = async () => {
    if (!uid) return;
    const { data } = await api.get(`/workouts?userId=${uid}`); // fetch only current user's workouts
    setItems(data);
  };

  const remove = async (id) => {
    if (!confirm("Delete this workout?")) return;
    await api.delete(`/workouts/${id}`, { data: { userId: uid } });
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="workout-container">
      <h1 className="workout-title">Workouts</h1>
      <div className="workout-list">
        {items.map((w) => (
          <div key={w._id} className="workout-card">
            <div className="workout-info">
              <h2 className="workout-name">{w.name}</h2>
              <p className="workout-meta">
                {w.duration} min • {w.calories} kcal •{" "}
                {new Date(w.date).toLocaleDateString()}
              </p>
              {w.notes && <p className="workout-notes">{w.notes}</p>}
            </div>
            <div className="workout-actions">
              <Link to={`/workouts/${w._id}/edit`} className="btn btn-edit">
                Edit
              </Link>
              <button onClick={() => remove(w._id)} className="btn btn-delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="add-workout">
        <Link to="/workouts/new" className="btn btn-add">
          + Add Workout
        </Link>
      </div>
    </div>
  );
}

