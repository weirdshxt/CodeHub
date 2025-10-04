const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
}

const signUp = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    await connectToMongo();
    const db = client.db("codeHub");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { userId: result.insertedId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { httpOnly: true });
    res.json({token})

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = (req, res) => {
  console.log("login");
};

const getAllUsers = (req, res) => {
  console.log("getAllUsers");
};

const logout = (req, res) => {
  console.log("logout");
};

const getUserProfile = (req, res) => {
  console.log("getUserProfile");
};

const updateUserProfile = (req, res) => {
  console.log("updateUserProfile");
};

const deleteUserProfile = (req, res) => {
  console.log("deleteUser");
};

module.exports = {
  getAllUsers,
  signUp,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
