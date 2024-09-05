const mongoose = require("mongoose");
const Users = require("../Models/userModel");
const Roles = require("../Models/roleModel.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

// Create user for admin
exports.CreateUser = async (req, res) => {
   const { firstName, lastName, userName, pwd, phoneNumber, email, adress } =
     req.body;
   if (!userName || !pwd) {
     return res
       .status(400)
       .json({ message: "Username and password are required" });
   }

   if (userName.length < 3 || pwd.length < 8) {
     return res.status(400).json({
       error:
         "Username must be at least 3 characters and password must be at least 8 characters long",
     });
   }

   try {
     const existingUser = await Users.findOne({ userName });
     if (existingUser) {
       return res
         .status(400)
         .json({ error: "User already exists, please log in instead" });
     }

     const existingEmail = await Users.findOne({ email });
     if (existingEmail) {
       return res.status(400).json({ error: "Email already exists." });
     }
     const hashedPassword = await bcrypt.hash(pwd, saltRounds);

     const admRole = await Roles.findOne({ name: "admin" });
     const newUser = new Users({
       firstName,
       lastName,
       userName,
       pwd: hashedPassword,
       email,
       phoneNumber,
       adress,
       roles: admRole._id,
     });

     const user = await newUser.save();

     // Exclude the password from the response
     const { pwd: _, ...userWithoutPassword } = user.toObject();
     return res.status(201).json({ user: userWithoutPassword });
   } catch (error) {
     console.error("Error creating user:", error.message);
     return res.status(500).json({
       error:
         "An error occurred while creating the user. Please try again later.",
     });
   }
};

// Create user --deliveryMan
exports.CreateDeliveryMan = async (req, res) => {
  const {
    firstName,
    lastName,
    userName,
    pwd,
    phoneNumber,
    email,
    adress,} = req.body;

  if (!userName || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (userName.length < 3 || pwd.length < 8) {
    return res.status(400).json({
      error:
        "Username must be at least 3 characters and password must be at least 8 characters long",
    });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(pwd, saltRounds);

    const DVRole = await Roles.findOne({ name: "deliveryMan" });
    const newUser = new Users({
      firstName,
      lastName,
      userName,
      pwd: hashedPassword,
      email,
      phoneNumber,
      adress,
      roles: DVRole._id,
    });

    const user = await newUser.save();

    // Exclude the password from the response
    const { pwd: _, ...userWithoutPassword } = user.toObject();
    return res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return res.status(500).json({
      error:
        "An error occurred whil creating the user. Please try again later.",
    });
  }
};

//  Sign up __client
exports.Signup = async (req, res) => {
  const { firstName, lastName, userName, pwd, phoneNumber, email, adress } =
    req.body;
  

  //  firstName
  const firstNameRegex = /^[A-Z][a-zA-Z]*$/;
  if (!firstNameRegex.test(firstName)) {
    return res.status(402).json({
      message:
        "First name must start with a capital letter and contain no spaces",
      field: "firstName",
    });
  }

  //  lastName
  const lastNameRegex = /^[A-Z][a-zA-Z]*$/;
  if (!lastNameRegex.test(lastName)) {
    return res.status(402).json({
      message:
        "Last name must start with a capital letter and contain no spaces",
      field: "lastName",
    });
  }

  // email
  const emailRegex = /^[A-Za-z0-9._-]+@[A-Za-z]+\.[A-Za-z]{2,4}$/;
  if (!emailRegex.test(email)) {
    return res
      .status(402)
      .json({ message: "Invalid email format", field: "email" });
  }

  // phoneNumber
  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(402).json({
      message: "Phone number must be 10 digits",
      field: "phoneNumber",
    });
  }

  //  username
  const userNRegex = /^[a-zA-Z]{3,}$/;
  if (!userNRegex.test(userName)) {
    return res.status(402).json({
      message:
        "Username must be at least 3 characters and cannot contain spaces",
      field: "userName",
    });
  }
  // password
  if (pwd.length < 8 || /^(?!.*\s)/.test(pwd) === false) {
    return res.status(402).json({
      message:
        "Password must be at least 8 characters long and cannot contain spaces",
      field: "pwd",
    });
  }
  const pwdRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
  if (!pwdRegex.test(pwd)) {
    return res.status(402).json({
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      field: "pwd",
    });
  }

  if(adress.length < 8){
    return res.status(402).json({
      message:
        "Address must be at least 8 characters.",
      field: "adress",
    });
  }
  try {
    const existingUser = await Users.findOne({ userName });
    if (existingUser) {
      return res.status(402).json({
        error: "User already exists, please log in instead",
        field: "userName",
      });
    }

    const existingEmail = await Users.findOne({ email });
    if (existingEmail) {
      return res.json({ error: "Email already exists.", field: "email" });
    }
    const hashedPassword = await bcrypt.hash(pwd, saltRounds);

    const cltRole = await Roles.findOne({ name: "client" });
    const newUser = new Users({
      firstName,
      lastName,
      userName,
      pwd: hashedPassword,
      email,
      phoneNumber,
      adress,
      roles: cltRole._id,
    });

    const user = await newUser.save();
    // Exclude the password from the response
    const { pwd: _, ...userWithoutPassword } = user.toObject();
    return res.json({ message: "Signup successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error:
        "An error occurred while creating the user. Please try again later.",
    });
  }
};

//Sign In
exports.Signin = async(req,res)=>{
  const { userName, pwd } = req.body;

  try { 
    const existingUser = await Users.findOne({ userName });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "UserName does not exist", field: "userName" });
    }

    const match = await bcrypt.compare(pwd, existingUser.pwd);
      if (!match) {
       return res
         .status(402)
         .json({ message: "Verify your password", field: "pwd" });
      }

    
      const authClaims = [
        { name: existingUser.userName },
        { role: existingUser.roles },
      ];
      const token = jwt.sign({ authClaims }, "bookStore2024", {
        expiresIn: "1h",
        algorithm: "HS256",
      });

      return res.status(200).json({
        id: existingUser.id,
        role: existingUser.roles,
        token: token,
        message: "Welcome",
      });
  
  } catch (error) {
    console.error("Error sign in user:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}; 

// Controller function to get user info
exports.getUserInfo = async (req, res) => {
    try {
      const {id} = req.headers;      
    if (!id) {
      return res.status(400).json({ message: "ID header is required" });
    }

     const data = await Users.findById(id).select("-pwd");
     console.log(id);
    if (!data) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Edit user
exports.editUsers = async (req, res) => {
  try {
    const { id } = req.headers;
    const {adresse} = req.body;
    const user = await Users.findByIdAndUpdate(id, {adresse: adresse}); 
    return res.status(200).json({ message: "Address updates successfully"});
  } catch (error) {
    console.log(JSON.stringify(error));
    return res.status(500).json({ message: error.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await Users.find().populate("roles").exec();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id).populate();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(JSON.stringify(error));
    return res.status(500).json({ message: error.message });
  }
};



// Delete user
exports.deleteUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: `Cannot find user with ID ${id}` });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(JSON.stringify(error));
    return res.status(500).json({ message: error.message });
  }
};

// exports.signup = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError("Invalid inputs passed, please check your data.", 422)
//     );
//   }
//   const { fillName,userName, email, pwd, roles } = req.body;

//   let existingUser;
//   try {
//     existingUser = await Users.findOne({ userName: userName });
//   } catch (err) {
//     const error = new HttpError(
//       "Signing up failed, please try again later.",
//       500
//     );
//     return next(error);
//   }

//   if (existingUser) {
//     const error = new HttpError(
//       "User exists already, please login instead.",
//       422
//     );
//     return next(error);
//   }
//   try {
//     await CreateUser.save();
//   } catch (err) {
//     const error = new HttpError("Signing up failed, please try again.", 500);
//     return next(error);
//   }

//   res.status(201).json({ user: createdUser.toObject({ getters: true }) });
// };


// exports.login = async (req, res, next) => {
//   const { userName, pwd } = req.body;

//   let existingUser;
//   try {
//     existingUser = await Users.findOne({ userName: userName });
//   } catch (err) {
//     const error = new HttpError(
//       "Logging in failed, please try again later.",
//       500
//     );
//     return next(error);
//   }

//   if (!existingUser || existingUser.pwdp !== pwd) {
//     const error = new HttpError(
//       "Invalid credentials, could not log you in.",
//       401
//     );
//     return next(error);
//   }

//   res.json({ message: "Logged in!" });
// };
