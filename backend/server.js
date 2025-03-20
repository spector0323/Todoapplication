const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend to connect
    methods: ["GET", "POST"],
  },
});

let tasks = []; // Store tasks in-memory

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send current tasks to new user
  socket.emit("tasksUpdated", tasks);

  socket.on("addTask", (task) => {
    tasks.push(task);
    io.emit("tasksUpdated", tasks);
  });

  socket.on("editTask", ({ index, task }) => {
    tasks[index] = task;
    io.emit("tasksUpdated", tasks);
  });

  socket.on("deleteTask", (index) => {
    tasks.splice(index, 1);
    io.emit("tasksUpdated", tasks);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
