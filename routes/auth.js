const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "SyedEhsanIsACricketer";
const fetchuser = require('../middleware/fetchuser')
//POST REQ Create A User

//////////////////////////////SIGN UP/////////////////////////////////////////////////////

router.post(
  "/createuser",
  [
    body("name", "Enter min 3 Charactor Name").isLength({ min: 3, max: 20 }),
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Enter min 8 Charactor password").isLength({
      min: 6,
      max: 15,
    }),
  ],
  async (req, res) => {
    let success =false

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check user exist with mail
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json("User already Exist");
        success =false
      }
      const salt = await bcrypt.genSalt(10);
      const securedPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securedPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success =true
      res.json({success,authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occured");
    }
  }
);
//////////////////////////////Login/////////////////////////////////////////////////////

// Login Router

router.post(
  "/login",
  [
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Blank Hai Sahi Se Bhad").exists(),
  ],
  async (req, res) => {
     let success =false
       
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success=false
        return res.status(400).json("Incorect Credentials");
        
      }
      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        success=false
        return res.status(400).json("Incorect Credentials");

      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({success,authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occured");
    }
  }
);
//////////////////////////////USER DETAILS/////////////////////////////////////////////////////
router.get("/getuser",fetchuser ,async(req, res) => {
  try {
    const userId  =req.user.id
    const user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
  }
}
);

module.exports = router;
