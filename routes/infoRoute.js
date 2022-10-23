const asyncHandler = require("express-async-handler");
const express = require("express");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const Information = require("../model/infoModel");
const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const information = await Information.find();

  res.status(200).json(information);
}));
router.post("/", upload.single("biodata"), asyncHandler(async(req,res)=>{
    console.log(req.file)
    // Upload image to cloudinary
  const result = await cloudinary.uploader.upload(req.file.path);
  console.log(result)

  const information = await Information.create({
    username: req.body.username,
    biodata: result.secure_url,
    cloudinary_id: result.public_id,
    email: req.body.email,
    phone: req.body.phone,
    profile: req.body.profile,
  });

  res.status(200).json(information);
}));

module.exports = router;
