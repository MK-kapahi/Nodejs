const express = require("express");
const multer = require("multer");

const router = express.Router();
const paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.client_id,
  'client_secret': process.env.client_secret
});

const {
  getUsers,
  getImage,
  getUserById,
  getAllFilteredUsers,
  getSearchedUsers,
  storage,
  payAmount
} = require("../Controller/userController");

const { loginUser, logoutUser, register , getData } = require("../Controller/authController");

const {
  updateUser ,
  deleteUser
} = require ("../Controller/adminController")

const {
  AuthenticationMiddleware,
} = require("../Middleware/middleware");

const upload = multer({ storage: storage  });

//Auth Routes
router.post("/login", loginUser);
router.delete("/logout", AuthenticationMiddleware , logoutUser);


//admin Routes 
router.post("/addUser",   AuthenticationMiddleware ,upload.single("file"), register);
router.delete("/deleteUser/:id", AuthenticationMiddleware, deleteUser);
router.put("/updateUser/:id", AuthenticationMiddleware, upload.single("file") , updateUser);


//Routes
router.get("/image/:name", getImage);
router.get("/findUser/:id", AuthenticationMiddleware, getUserById);
router.get("/image/:name", getImage);
router.get("/user", AuthenticationMiddleware, getUsers);


router.get("/getData" , getData);
// console.log(getAllFilteredUsers())
router.get("/filter", getAllFilteredUsers);
router.get("/searchUser", getSearchedUsers);

router.post('/payment/:price', payAmount)


module.exports = router;