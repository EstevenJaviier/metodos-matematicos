require("dotenv").config();

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false })); //cargar el bodyparser
app.use(bodyParser.json()); //convertir cualquier peticion que me llege a json.
app.use(cors());

const users = {};

const socketToRoom = {};

io.on("connection", (socket) => {
  socket.on("join room", (roomID) => {
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
  });
});

server.listen(process.env.PORT || 3000, () =>
  console.log("server is running on port 3000")
);
