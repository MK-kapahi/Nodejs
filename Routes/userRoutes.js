const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  getImage
} = require("../Controller/userController");

router.get("/", getUsers);

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    // console.log(file)
    cb(null, "./data");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null,uniqueSuffix+ file.originalname);
  },
});
const upload = multer({ storage: storage });
router.post("/addUser", upload.single("file"), addUser);

router.delete("/deleteUser/:id", deleteUser);

router.put("/updateUser/:id", updateUser);

router.get("/image/:name" , getImage)



module.exports = router;