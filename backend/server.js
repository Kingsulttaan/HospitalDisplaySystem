const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const SECRET_KEY = "hospital_secret_key";

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

app.get("/", (req, res) => {

  res.send(
    "Hospital CMS Backend Running"
  );

});

/* USERS */

const users = [
  {
    username: "admin",
    password: bcrypt.hashSync(
      "12345",
      10
    )
  }
];

/* DATA */

let hospitals = [];

let connectedDevices = {};

/* LOGIN */

app.post("/login", (req, res) => {

  const {
    username,
    password
  } = req.body;

  const user =
    users.find(
      u =>
        u.username === username
    );

  if (!user) {

    return res.status(401).json({
      message:
        "Invalid username"
    });

  }

  const valid =
    bcrypt.compareSync(
      password,
      user.password
    );

  if (!valid) {

    return res.status(401).json({
      message:
        "Invalid password"
    });

  }

  const token = jwt.sign(
    { username },
    SECRET_KEY,
    {
      expiresIn: "1d"
    }
  );

  res.json({
    token
  });

});

/* HOSPITALS */

app.get(
  "/hospitals",
  (req, res) => {

    res.json(hospitals);

  }
);

app.post(
  "/hospital",
  (req, res) => {

    const {
      name,
      deviceId
    } = req.body;

    const duplicate =
      hospitals.find(
        h =>
          h.deviceId ===
          deviceId
      );

    if (duplicate) {

      return res.status(400).json({
        message:
          "Device ID already exists"
      });

    }

    hospitals.push({

      id: Date.now(),

      name,

      deviceId,

      status: "Offline",

      currentContent: "-",

      lastSeen: null

    });

    res.json({
      success: true
    });

  }
);

app.put(
  "/hospital/:id",
  (req, res) => {

    const id =
      Number(
        req.params.id
      );

    const {
      name,
      deviceId
    } = req.body;

    const hospital =
      hospitals.find(
        h =>
          h.id === id
      );

    if (!hospital) {

      return res.status(404).json({
        message:
          "Hospital not found"
      });

    }

    const duplicate =
      hospitals.find(
        h =>
          h.deviceId ===
            deviceId &&
          h.id !== id
      );

    if (duplicate) {

      return res.status(400).json({
        message:
          "Device ID already exists"
      });

    }

    hospital.name =
      name;

    hospital.deviceId =
      deviceId;

    res.json({
      success: true
    });

  }
);

app.delete(
  "/hospital/:id",
  (req, res) => {

    const id =
      Number(
        req.params.id
      );

    hospitals =
      hospitals.filter(
        h =>
          h.id !== id
      );

    res.json({
      success: true
    });

  }
);

/* SOCKETS */

io.on(
  "connection",
  (socket) => {

    console.log(
      "Device Connected"
    );

    socket.on(
      "register-device",
      (deviceId) => {

        connectedDevices[
          deviceId
        ] = socket.id;

      }
    );

    socket.on(
      "heartbeat",
      (deviceId) => {

        const hospital =
          hospitals.find(
            h =>
              h.deviceId ===
              deviceId
          );

        if (hospital) {

          hospital.status =
            "Online";

          hospital.lastSeen =
            Date.now();

        }

      }
    );

    socket.on(
      "disconnect",
      () => {

        Object.keys(
          connectedDevices
        ).forEach(
          key => {

            if (
              connectedDevices[
                key
              ] === socket.id
            ) {

              delete connectedDevices[
                key
              ];

            }

          }
        );

      }
    );

  }
);

/* OFFLINE CHECK */

setInterval(() => {

  hospitals.forEach(
    hospital => {

      if (
        !hospital.lastSeen
      ) return;

      const diff =
        Date.now() -
        hospital.lastSeen;

      if (
        diff > 10000
      ) {

        hospital.status =
          "Offline";

      }

    }
  );

}, 5000);

/* UPLOAD */

const storage =
  multer.diskStorage({

    destination:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          "uploads/"
        );

      },

    filename:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          Date.now() +
          path.extname(
            file.originalname
          )
        );

      }

  });

const upload =
  multer({
    storage
  });

app.post(
  "/upload",
  upload.single(
    "media"
  ),
  (req, res) => {

    const {
      deviceId
    } = req.body;

    const mediaUrl =
      `http://localhost:5000/uploads/${req.file.filename}`;

    const socketId =
      connectedDevices[
        deviceId
      ];

    if (socketId) {

      io.to(
        socketId
      ).emit(
        "new-media",
        {
          mediaUrl
        }
      );

    }

    const hospital =
      hospitals.find(
        h =>
          h.deviceId ===
          deviceId
      );

    if (hospital) {

      hospital.currentContent =
        req.file.filename;

    }

    res.json({

      success: true,

      mediaUrl

    });

  }
);

server.listen(
  5000,
  () => {

    console.log(
      "Server running on port 5000"
    );

  }
);