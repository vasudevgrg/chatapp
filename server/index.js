const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("This is user");
});

const CHAT_BOT = "ChatBot";
let allUsers = []; 


io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("join_room", (data) => {
    const { username, room } = data;
    socket.join(room);

    let __createdtime__ = Date.now(); 


    socket.to(room).emit("receive_message", {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      __createdtime__,
    });

    socket.emit("receive_message", {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__,
    });

    // Save the new user to the room
    allUsers.push({ id: socket.id, username, room });
    let chatRoomUsers = allUsers.filter((user) => user.room === room);

    // Send the updated list of users to the room
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected ${socket.id}`);
    // Remove the user from allUsers
    allUsers = allUsers.filter((user) => user.id !== socket.id);

    // Notify other users in the same room
    const user = allUsers.find((user) => user.id === socket.id);
    if (user) {
      const room = user.room;
      let chatRoomUsers = allUsers.filter((user) => user.room === room);
      socket.to(room).emit("chatroom_users", chatRoomUsers);
    }
  });
});

server.listen(5002, () => {
  console.log("Server is running on port 5002");
});

