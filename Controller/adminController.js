
const User = require("../Modal/user");
const { Roles } = require("../utils/constant");
//Update User details in Database
const updateUser = async (req, res) => {
 
  if (req.role != Roles.Admin) {
    res.status(401).send("Unauthorized");
    return;
  }
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndUpdate(userId, {
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      age: req.body.age,
    });

    if (req.file) {
      const filename = req.file.filename;
      user.imagePath = filename;
      await user.save();
    }

    const updatedUser = await User.findById(userId);
    res.status(200).send({
      
      user : updatedUser ,
      message : "User Updated Sucessfully"
    }
      );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
    });
  }
};


//Delete user from the database
const deleteUser = async (req, res) => {
  if (req.role != Roles.Admin) {
    res.status(401).send("Unauthorized");
    return;
  }
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.status(200).send(`User deleted is ${userId}`);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  updateUser,
  deleteUser,
}