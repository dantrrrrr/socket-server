const express = require("express");
const app = express();

const http = require("http");

const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
const port = 3333;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});
var Custom = [];

io.on("connection", (socket) => {
  //connected
  console.log(`user connected: ${socket.id}`);

  // socket.on("join_room", (data) => {
  //   console.log(data);
  //   socket.join(data);
  // });
  // socket.on("send_message", (data) => {
  //   console.log(data);
  //   socket.to(data.room).emit("receive_message", data);
  // });
  //opendata
  socket.emit("OpenData", Custom);
  socket.on("disconnect", (data) => {
    console.log("disconnected");
  });
  //gettime
  socket.on("GetTime", function (data) {
    console.log(data);
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    socket.emit(
      "Time",
      year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
    );
  });
  socket.on("Open", (data) => {
    if (Custom.length < 9) {
      Custom.push(data);
    } else {
      Custom.splice(0, 1);
      Custom.push(data);
    }
    socket.emit("OpenData", Custom);
  });
  //ACTIVE
  socket.on("Active", (data) => {
    console.log(data);
  });
});
server.listen(port, () => {
  console.log("server is running on port " + port);
});
app.get("/", (req, res) => {
  res.json({ data: "socket server" });
});
