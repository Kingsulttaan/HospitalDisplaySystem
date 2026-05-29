const mongoose =
  require("mongoose");

const playlistSchema =
  new mongoose.Schema({

    mediaUrl: String,

    filename: String,

    uploadedAt: {

      type: Date,

      default: Date.now

    }

  });

const scheduleSchema =
  new mongoose.Schema({

    filename: String,

    mediaUrl: String,

    startTime: String,

    endTime: String

  });

const hospitalSchema =
  new mongoose.Schema({

    name: {

      type: String,

      required: true

    },

    deviceId: {

      type: String,

      required: true,

      unique: true

    },

    status: {

      type: String,

      default: "Offline"

    },

    currentContent: {

      type: String,

      default: "-"

    },

    lastSeen: Date,

    playlist: [

      playlistSchema

    ],

    schedules: [

      scheduleSchema

    ]

  });

module.exports =
  mongoose.model(
    "Hospital",
    hospitalSchema
  );