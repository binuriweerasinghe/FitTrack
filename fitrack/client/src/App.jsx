import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import WorkoutList from "./pages/WorkoutList";
import WorkoutForm from "./pages/WorkoutForm";
import DietList from "./pages/DietList";
import DietForm from "./pages/DietForm";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar */}
        <nav className="navbar">
          <h1 className="logo">FitTrack</h1>
          <div className="nav-links">
            <Link to="/workouts">Workouts</Link>
            <Link to="/diets">Diets</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Login</Link>
          </div>
        </nav>

        {/* Main Content */}
        <div className="main-content">
          <div className="page-card">
            <Routes>
              {/* Workouts (protected) */}
              <Route path="/workouts" element={
                <ProtectedRoute><WorkoutList /></ProtectedRoute>
              } />
              <Route path="/workouts/new" element={
                <ProtectedRoute><WorkoutForm /></ProtectedRoute>
              } />
              <Route path="/workouts/:id/edit" element={<ProtectedRoute><WorkoutForm /></ProtectedRoute>} />


              {/* Diets (protected) */}
              <Route path="/diets" element={
                <ProtectedRoute><DietList /></ProtectedRoute>
              } />
              <Route path="/diets/new" element={
                <ProtectedRoute><DietForm /></ProtectedRoute>
              } />
              <Route path="/diets/edit/:id" element={
                <ProtectedRoute><DietForm /></ProtectedRoute>
              } />

              {/* Profile (protected) */}
              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />

              {/* Login */}
              <Route path="/login" element={<Login />} />

              {/* Default route */}
              <Route path="*" element={
                <h2 className="text-center">
                  Please <b>Login</b> first to access <b>Workouts</b>, <b>Diets</b>, or <b>Profile</b>.
                </h2>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}







