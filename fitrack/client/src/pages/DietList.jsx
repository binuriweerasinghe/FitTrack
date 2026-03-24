import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { getUserId } from "../lib/auth";
import "./DietList.css";

export default function DietList() {
  const [diets, setDiets] = useState([]);
  const uid = getUserId();

  // Fetch diet data for current user
  const fetchDiets = async () => {
    if (!uid) return;
    const { data } = await api.get(`/diets?userId=${uid}`);
    setDiets(data);
  };

  useEffect(() => {
    fetchDiets();
  }, []);

  const deleteDiet = async (id) => {
    if (window.confirm("Are you sure you want to delete this diet entry?")) {
      await api.delete(`/diets/${id}`, { data: { userId: uid } });
      fetchDiets();
    }
  };

  return (
    <div className="diet-container">
      <div className="diet-header">
        <h1 className="diet-title">Diet Entries</h1>
        <Link to="/diets/new" className="add-diet-btn">
          + Add Diet
        </Link>
      </div>

      <table className="diet-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Meal</th>
            <th>Food</th>
            <th>Calories</th>
            <th>Protein</th>
            <th>Carbs</th>
            <th>Fat</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {diets.map((d) => (
            <tr key={d._id}>
              <td>{new Date(d.date).toLocaleDateString()}</td>
              <td>{d.mealType}</td>
              <td>{d.food}</td>
              <td>{d.calories}</td>
              <td>{d.protein}</td>
              <td>{d.carbs}</td>
              <td>{d.fat}</td>
              <td className="actions">
                <Link to={`/diets/edit/${d._id}`} className="edit-btn">
                  Edit
                </Link>
                <button onClick={() => deleteDiet(d._id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {diets.length === 0 && (
            <tr>
              <td colSpan="8" className="no-data">
                No diet entries yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


