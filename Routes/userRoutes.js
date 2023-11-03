const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  getImage,
  getUserById,
  loginUser,
  logoutUser,
} = require("../Controller/userController");

const { validateToken } = require("../Middleware/middleware");

const { validateToken } = require("../Middleware/middleware");

router.get("/user", validateToken, getUsers);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./data");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });
router.post("/addUser", validateToken, upload.single("file"), addUser);

router.delete("/deleteUser/:id", validateToken, deleteUser);

router.put("/updateUser/:id", validateToken, updateUser);

router.get("/image/:name", getImage);
router.get("/findUser/:id", validateToken, getUserById);

router.get("/image/:name", getImage);
router.get("/findUser/:id", getUserById);
router.post("/login", loginUser);

router.post("/login", loginUser);

router.get("/validateToken", validateToken);

module.exports = router;
