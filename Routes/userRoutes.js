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
} = require("../Controller/userController");

const { loginUser, logoutUser } = require("../Controller/authController");

const {
  AuthenticationMiddleware,
  validateToken,
} = require("../Middleware/middleware");

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

//Routes

//Auth Routes
router.post("/login", loginUser);
router.delete("/logout", AuthenticationMiddleware, logoutUser);

router.post("/addUser", upload.single("file"), addUser);
router.delete("/deleteUser/:id", AuthenticationMiddleware, deleteUser);
router.put("/updateUser/:id", AuthenticationMiddleware, updateUser);
router.get("/image/:name", getImage);
router.get("/findUser/:id", validateToken, getUserById);
router.get("/image/:name", getImage);
router.get("/user", AuthenticationMiddleware, getUsers);

module.exports = router;
