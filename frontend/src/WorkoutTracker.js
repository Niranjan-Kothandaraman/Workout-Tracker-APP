import React, { useState, useEffect } from "react";
import axios from "axios";

function WorkoutTracker() {
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [workouts, setWorkouts] = useState([]);

  // fetch existing workouts
  useEffect(() => {
    axios.get("http://localhost:4000/workouts")
      .then(res => setWorkouts(res.data))
      .catch(err => console.error(err));
  }, []);

  const addWorkout = () => {
    const newWorkout = { exercise, sets, reps, weight, date };
    axios.post("http://localhost:4000/workouts", newWorkout)
      .then(res => {
        // merge returned id with the workout you just sent
        const savedWorkout = { id: res.data.id, ...newWorkout };
        setWorkouts([...workouts, savedWorkout]);

        // clear inputs
        setExercise("");
        setSets("");
        setReps("");
        setWeight("");
        setDate("");
      })
      .catch(err => console.error(err));
  };

  const deleteWorkout = (id) => {
    axios.delete(`http://localhost:4000/workouts/${id}`)
      .then(() => setWorkouts(workouts.filter(w => w.id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Workout Tracker</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input placeholder="Exercise" value={exercise} onChange={e => setExercise(e.target.value)} />
        <input placeholder="Sets" value={sets} onChange={e => setSets(e.target.value)} type="number" />
        <input placeholder="Reps" value={reps} onChange={e => setReps(e.target.value)} type="number" />
        <input placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} type="number" />
        <input placeholder="Date" value={date} onChange={e => setDate(e.target.value)} type="date" />
        <button onClick={addWorkout}>Add Workout</button>
      </div>

      {workouts.map((w) => (
        <div key={w.id} style={{ background: "#fff", padding: "15px", borderRadius: "8px", marginBottom: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <strong>{w.exercise || "Unnamed workout"}</strong>
          <p>{w.sets} sets × {w.reps} reps @ {w.weight}kg</p>
          <p>{w.date}</p>
          <button onClick={() => deleteWorkout(w.id)} style={{ background: "red", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default WorkoutTracker;