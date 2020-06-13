const sofia = require("../socketIO/startSofiaClockIO");
const plovdiv = require("../socketIO/startPlovdivClockIO");
const varna = require("../socketIO/startVarnaClockIO");
let countUsers = 0; //count of connecting users

module.exports = function (io) {
  io.on("connection", (socket) => {
    countUsers++;
    sofia.startConnection(io, socket);
    plovdiv.startConnection(io, socket);
    varna.startConnection(io, socket);
    io.emit("countUsers", { countUsers: countUsers });
    socket.on("disconnect", function () {
      countUsers--;
      io.emit("countUsers", { countUsers: countUsers });
    });
  });
};
