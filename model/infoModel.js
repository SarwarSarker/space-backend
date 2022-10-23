const mongoose = require("mongoose");

const infoSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter Product Name"],
    },
    biodata: {
      type: String,
      required: [true, "Please Upload CV"],
    },
    cloudinary_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Please Enter Email Address"],
    },
    phone: {
      type: String,
      required: [true, "Please Enter Phone Number"],
    },
    profile: {
      type: String,
      required: [true, "Please Enter Linkedin profile"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Information", infoSchema);