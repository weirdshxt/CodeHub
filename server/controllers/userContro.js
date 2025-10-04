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

const login = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    await connectToMongo();
    const db = client.db("codeHub");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      $or: [{ username }, { email }],
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
    });
  } catch (err) {
    console.error(`Error during login: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });

  }

};

const getAllUsers = async (req, res) => {
  try {
    await connectToMongo();
    const db = client.db("codeHub");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();
    res.status(200).json(users);
    
  } catch (err) {
    console.error("Error fetching users",err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    await connectToMongo();
    const db = client.db("codeHub");
    const usersCollection = db.collection("users");

    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
    
  } catch (err) {
    console.error("Error fetching user profile",err.message);
    res.status(500).json({ message: "Internal server error" });
  }
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
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
