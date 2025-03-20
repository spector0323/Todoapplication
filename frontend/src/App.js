import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000"); // Connect to backend

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    socket.on("tasksUpdated", (updatedTasks) => {
      setTasks(updatedTasks);
    });

    return () => {
      socket.off("tasksUpdated");
    };
  }, []);

  const handleAddTask = () => {
    if (task.trim() === "") return;
    if (editIndex !== null) {
      socket.emit("editTask", { index: editIndex, task });
      setEditIndex(null);
    } else {
      socket.emit("addTask", task);
    }
    setTask("");
  };

  const handleEditTask = (index) => {
    setTask(tasks[index]);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    socket.emit("deleteTask", index);
  };

  return (
    <div className="app">
      <h1>Real-Time To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task..."
        />
        <button onClick={handleAddTask}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>
      <ul>
        {tasks.map((t, index) => (
          <li key={index}>
            <span>{t}</span>
            <div>
              <button className="edit" onClick={() => handleEditTask(index)}>
                Edit
              </button>
              <button
                className="delete"
                onClick={() => handleDeleteTask(index)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
