const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  getUsers,
  getImage,
  getUserById,
  storage
} = require("../Controller/userController");

const { loginUser, logoutUser, register , getData } = require("../Controller/authController");

const {
  updateUser ,
  deleteUser
} = require ("../Controller/adminController")

const {
  AuthenticationMiddleware,
  validateToken,
} = require("../Middleware/middleware");

const upload = multer({ storage: storage  });

//Auth Routes
router.post("/login", loginUser);
router.delete("/logout", AuthenticationMiddleware , logoutUser);


//admin Routes 
router.post("/addUser",   AuthenticationMiddleware ,upload.single("file"), register);
router.delete("/deleteUser/:id", AuthenticationMiddleware, deleteUser);
router.put("/updateUser/:id", upload.single("file") , AuthenticationMiddleware, updateUser);


//Routes
router.get("/image/:name", getImage);
router.get("/findUser/:id", validateToken, getUserById);
router.get("/image/:name", getImage);
router.get("/user", AuthenticationMiddleware, getUsers);


router.get("/getData" , getData)

module.exports = router;