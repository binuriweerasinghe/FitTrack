import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { getUserId } from "../lib/auth";
import dietImage from './Diet-1.jpg'; // Import the image here
import "./DietForm.css"; // Import the CSS

const today = new Date().toISOString().substring(0, 10);
const empty = {
  mealType: "breakfast",
  food: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  date: today
};

export default function DietForm() {
  const [form, setForm] = useState(empty);
  const { id } = useParams();
  const nav = useNavigate();
  const editing = Boolean(id);
  const uid = getUserId();

useEffect(() => {
  if (editing) {
    api.get(`/diets/${id}?userId=${uid}`)
      .then(({ data }) => {
        setForm({
          mealType: data.mealType || "breakfast",
          food: data.food || "",
          calories: data.calories || "",
          protein: data.protein || "",
          carbs: data.carbs || "",
          fat: data.fat || "",
          date: data.date ? data.date.substring(0, 10) : ""
        });
      })
      .catch(() => alert("Failed to fetch diet entry"));
  }
}, [editing, id, uid]);


  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      userId: uid, // ensure diet belongs to logged-in user
      calories: Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0
    };
    if (editing) await api.put(`/diets/${id}`, payload);
    else await api.post("/diets", payload);
    nav("/diets");
  };

  return (
    <div 
      className="diet-form-container"
      style={{ backgroundImage: `url(${dietImage})` }} // Dynamically set the background image
    >
      <h1 className="diet-form-title">{editing ? "Edit" : "Add"} Diet</h1>
      <form onSubmit={submit} className="diet-form">
        <select
          name="mealType"
          value={form.mealType}
          onChange={onChange}
          className="diet-input"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>

        <input
          name="food"
          placeholder="Food"
          value={form.food}
          onChange={onChange}
          className="diet-input"
          required
        />

        <input
          name="calories"
          type="number"
          placeholder="Calories(g)"
          value={form.calories}
          onChange={onChange}
          className="diet-input"
          required
        />

        <input
          name="protein"
          type="number"
          placeholder="Protein(g)"
          value={form.protein}
          onChange={onChange}
          className="diet-input"
        />

        <input
          name="carbs"
          type="number"
          placeholder="Carbs(g)"
          value={form.carbs}
          onChange={onChange}
          className="diet-input"
        />

        <input
          name="fat"
          type="number"
          placeholder="Fat(g)"
          value={form.fat}
          onChange={onChange}
          className="diet-input"
        />

        <input
          name="date"
          type="date"
          value={form.date}
          onChange={onChange}
          className="diet-input"
        />

        <button type="submit" className="diet-btn">
          {editing ? "Update" : "Add"} Diet
        </button>
      </form>
    </div>
  );
}







