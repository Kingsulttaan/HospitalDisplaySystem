require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Hospital =
  require("./models/Hospital");

  const Emergency =
  require("./models/Emergency");
  const User =
  require("./models/User");

const app = express();

const server =
  http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
let connectedDevices = {};

const SECRET_KEY =
  "hospital_secret_key";

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

/* =========================
   MONGODB
========================= */

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {

    console.log(
      "MongoDB Connected"
    );

  })
  .catch(err => {

    console.log(err);

  });

/* =========================
   ROOT
========================= */

app.get("/", (req, res) => {

  res.send(
    "Hospital CMS Backend Running"
  );

});

/* =========================
   USERS
========================= */



/* =========================
   LOGIN
========================= */

app.post(
  "/login",
  async (req, res) => {

    const {

      username,

      password

    } = req.body;

    const user =
      await User.findOne({

        username

      });

    if (!user) {

      return res.status(401)
        .json({

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

      return res.status(401)
        .json({

          message:
            "Invalid password"

        });

    }

    const token =
      jwt.sign(

        {

          username:
            user.username,

          role:
            user.role

        },

        SECRET_KEY,

        {

          expiresIn:
            "1d"

        }

      );

    res.json({

      token,

      username:
        user.username,

      role:
        user.role,

      avatar:
        user.avatar

    });

  }
);
/* =========================
   USER MANAGEMENT
========================= */

app.get(
  "/users",
  async (req, res) => {

    const users =
      await User.find()
      .select("-password");

    res.json(users);

  }
);

app.post(
  "/users",
  async (req, res) => {

    try {

      const {

        username,

        password,

        role

      } = req.body;

      const existing =
        await User.findOne({

          username

        });

      if (existing) {

        return res.status(400)
          .json({

            message:
              "User already exists"

          });

      }

      const hashed =
        bcrypt.hashSync(
          password,
          10
        );

      await User.create({

        username,

        password:
          hashed,

        role

      });

      res.json({

        success: true

      });

    } catch (error) {

      res.status(500)
        .json({

          message:
            error.message

        });

    }

  }
);

app.delete(
  "/users/:id",
  async (req, res) => {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({

      success: true

    });

  }
);

app.put(
  "/users/password/:id",
  async (req, res) => {

    const {

      password

    } = req.body;

    const hashed =
      bcrypt.hashSync(
        password,
        10
      );

    await User.findByIdAndUpdate(

      req.params.id,

      {

        password:
          hashed

      }

    );

    res.json({

      success: true

    });

  }
);

/* =========================
   HOSPITAL CRUD
========================= */

app.get(
  "/hospitals",
  async (req, res) => {

    const hospitals =
      await Hospital.find();

    res.json(
      hospitals
    );

  }
);

app.post(
  "/hospital",
  async (req, res) => {

    const {
      name,
      deviceId
    } = req.body;

    const existing =
      await Hospital.findOne({

        deviceId

      });

    if (existing) {

      return res.status(400)
        .json({

          message:
            "Device ID already exists"

        });

    }

    await Hospital.create({

      name,

      deviceId

    });

    res.json({

      success: true

    });

  }
);

app.put(
  "/hospital/:id",
  async (req, res) => {

    await Hospital
      .findByIdAndUpdate(
        req.params.id,
        req.body
      );

    res.json({

      success: true

    });

  }
);

app.delete(
  "/hospital/:id",
  async (req, res) => {

    await Hospital
      .findByIdAndDelete(
        req.params.id
      );

    res.json({

      success: true

    });

  }
);

/* =========================
   PLAYLIST
========================= */

app.get(
  "/playlist/:deviceId",
  async (req, res) => {

    const hospital =
      await Hospital.findOne({

        deviceId:
          req.params.deviceId

      });

    if (!hospital) {

      return res.status(404)
        .json({

          message:
            "Hospital not found"

        });

    }

    res.json(
      hospital.playlist
    );

  }
);

app.delete(
  "/playlist/:deviceId/:itemId",
  async (req, res) => {

    const hospital =
      await Hospital.findOne({

        deviceId:
          req.params.deviceId

      });

    if (!hospital) {

      return res.status(404)
        .json({

          message:
            "Hospital not found"

        });

    }

    hospital.playlist =
      hospital.playlist.filter(

        item =>

          item._id.toString()
          !==
          req.params.itemId

      );

    await hospital.save();

    res.json({

      success: true

    });

  }
);

/* =========================
   MOVE UP
========================= */

app.put(
  "/playlist/:deviceId/:itemId/up",
  async (req, res) => {

    const hospital =
      await Hospital.findOne({

        deviceId:
          req.params.deviceId

      });

    if (!hospital) {

      return res.status(404)
        .json({

          message:
            "Hospital not found"

        });

    }

    const index =
      hospital.playlist.findIndex(

        item =>

          item._id.toString()
          ===
          req.params.itemId

      );

    if (index <= 0) {

      return res.json({

        success: true

      });

    }

    const temp =
      hospital.playlist[index];

    hospital.playlist[index] =
      hospital.playlist[index - 1];

    hospital.playlist[index - 1] =
      temp;

    hospital.markModified(
      "playlist"
    );

    await hospital.save();

    res.json({

      success: true

    });

  }
);

/* =========================
   MOVE DOWN
========================= */

app.put(
  "/playlist/:deviceId/:itemId/down",
  async (req, res) => {

    const hospital =
      await Hospital.findOne({

        deviceId:
          req.params.deviceId

      });

    if (!hospital) {

      return res.status(404)
        .json({

          message:
            "Hospital not found"

        });

    }

    const index =
      hospital.playlist.findIndex(

        item =>

          item._id.toString()
          ===
          req.params.itemId

      );

    if (

      index === -1 ||

      index ===
      hospital.playlist.length - 1

    ) {

      return res.json({

        success: true

      });

    }

    const temp =
      hospital.playlist[index];

    hospital.playlist[index] =
      hospital.playlist[index + 1];

    hospital.playlist[index + 1] =
      temp;

    hospital.markModified(
      "playlist"
    );

    await hospital.save();

    res.json({

      success: true

    });

  }
);
/* =========================
   SCHEDULES
========================= */

app.get(
  "/schedule/:deviceId",
  async (req, res) => {

    const hospital =
      await Hospital.findOne({

        deviceId:
          req.params.deviceId

      });

    if (!hospital) {

      return res.status(404)
        .json({

          message:
            "Hospital not found"

        });

    }

    res.json(
      hospital.schedules || []
    );

  }
);

app.post(
  "/schedule",
  async (req, res) => {

    const {

      deviceId,

      filename,

      mediaUrl,

      startTime,

      endTime

    } = req.body;

    const hospital =
      await Hospital.findOne({

        deviceId

      });

    if (!hospital) {

      return res.status(404)
        .json({

          message:
            "Hospital not found"

        });

    }

    hospital.schedules.push({

      filename,

      mediaUrl,

      startTime,

      endTime

    });

    await hospital.save();

    res.json({

      success: true

    });

  }
);

app.delete(
  "/schedule/:deviceId/:scheduleId",
  async (req, res) => {

    const hospital =
      await Hospital.findOne({

        deviceId:
          req.params.deviceId

      });

    if (!hospital) {

      return res.status(404)
        .json({

          message:
            "Hospital not found"

        });

    }

    hospital.schedules =
      hospital.schedules.filter(

        schedule =>

          schedule._id.toString()
          !==
          req.params.scheduleId

      );

    await hospital.save();

    res.json({

      success: true

    });

  }
);

/* =========================
   EMERGENCY
========================= */

app.get(
  "/emergency",
  async (req, res) => {

    let emergency =
      await Emergency.findOne();

    if (!emergency) {

      emergency =
        await Emergency.create({
          active: false
        });

    }

    res.json(
      emergency
    );

  }
);

app.post(
  "/emergency",
  async (req, res) => {

    const {

      active,

      message,

      mediaUrl

    } = req.body;

    let emergency =
      await Emergency.findOne();

    if (!emergency) {

      emergency =
        new Emergency();

    }

    emergency.active =
      active;

    emergency.message =
      message;

    emergency.mediaUrl =
      mediaUrl;

    emergency.activatedAt =
      new Date();

    await emergency.save();

    io.emit(
      "emergency-updated"
    );

    res.json({

      success: true

    });

  }
);

/* =========================
   STORAGE
========================= */

const storage =
  multer.diskStorage({

    destination(
      req,
      file,
      cb
    ) {

      cb(
        null,
        "uploads/"
      );

    },

    filename(
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

/* =========================
   UPLOAD
========================= */

app.post(
  "/upload",
  upload.single(
    "media"
  ),
  async (req, res) => {

    const {
      deviceId
    } = req.body;

    const mediaUrl =
      `http://localhost:5000/uploads/${req.file.filename}`;

    const hospital =
      await Hospital.findOne({

        deviceId

      });

    if (!hospital) {

      return res.status(404)
        .json({

          message:
            "Hospital not found"

        });

    }

    hospital.playlist.push({

      mediaUrl,

      filename:
        req.file.filename

    });

    hospital.currentContent =
      req.file.filename;

    await hospital.save();

const socketId =
  connectedDevices[
    deviceId
  ];

if (socketId) {

  io.to(
    socketId
  ).emit(
    "playlist-updated"
  );

}

res.json({

  success: true,

  playlist:
    hospital.playlist

});

  }
);

/* =========================
   START SERVER
========================= */
io.on(
  "connection",
  socket => {

    console.log(
      "Device Connected"
    );

    socket.on(
      "register-device",
      deviceId => {

        connectedDevices[
          deviceId
        ] = socket.id;

      }
    );

    socket.on(
  "heartbeat",
  async deviceId => {

    try {

      if (
        mongoose.connection.readyState !== 1
      ) {
        return;
      }

      await Hospital.findOneAndUpdate(
        {
          deviceId
        },
        {
          status: "Online",
          lastSeen: new Date()
        }
      );

    } catch (error) {

      console.log(
        "Heartbeat Error:",
        error.message
      );

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
server.listen(
  5000,
  () => {

    console.log(
      "Server running on port 5000"
    );

  }
);