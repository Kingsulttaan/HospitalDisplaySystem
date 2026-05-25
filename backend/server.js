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

const app = express();

const server =
  http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

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

const users = [

  {

    username: "admin",

    password:
      bcrypt.hashSync(
        "12345",
        10
      )

  }

];

/* =========================
   LOGIN
========================= */

app.post(
  "/login",
  (req, res) => {

    const {
      username,
      password
    } = req.body;

    const user =
      users.find(
        u =>
          u.username ===
          username
      );

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
        { username },
        SECRET_KEY,
        {
          expiresIn: "1d"
        }
      );

    res.json({
      token
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

server.listen(
  5000,
  () => {

    console.log(
      "Server running on port 5000"
    );

  }
);