const mongoose =
  require("mongoose");

const emergencySchema =
  new mongoose.Schema({

    active: {

      type: Boolean,

      default: false

    },

    message: {

      type: String,

      default: ""

    },

    mediaUrl: {

      type: String,

      default: ""

    },

    activatedAt: {

      type: Date,

      default: Date.now

    }

  });

module.exports =
  mongoose.model(
    "Emergency",
    emergencySchema
  );