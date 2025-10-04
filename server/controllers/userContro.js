const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId, ReturnDocument } = require("mongodb");
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
      repositiories: [],
      followers: [],
      following: [],
      starRepos: [],
      coverImage: "",
      profileImage: "",
      bio: "",
      location: "",
      website: "",
      link1: "",
      link2: "",
      link3: "",
      link4: "",
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { userId: result.insertedId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

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
    console.error("Error fetching users", err.message);
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
    console.error("Error fetching user profile", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserProfile = async (req, res) => {
  const {
    username,
    email,
    password,
    coverImage,
    profileImage,
    bio,
    location,
    website,
    link1,
    link2,
    link3,
    link4,
  } = req.body;

  try {
    await connectToMongo();
    const db = client.db("codeHub");
    const usersCollection = db.collection("users");

    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    let updateFields = {};

    // Check username uniqueness if provided
    if (username !== undefined) {
      const existingUser = await usersCollection.findOne({
        username,
        _id: { $ne: new ObjectId(userId) },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      updateFields.username = username;
    }

    // Check email uniqueness if provided
    if (email !== undefined) {
      const existingUser = await usersCollection.findOne({
        email,
        _id: { $ne: new ObjectId(userId) },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      updateFields.email = email;
    }

    // Handle password hashing if provided
    if (password !== undefined) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    // Add other profile fields if provided
    const profileFields = {
      coverImage,
      profileImage,
      bio,
      location,
      website,
      link1,
      link2,
      link3,
      link4,
    };
    Object.keys(profileFields).forEach((key) => {
      if (profileFields[key] !== undefined) {
        updateFields[key] = profileFields[key];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", user: result });
  } catch (err) {
    console.error("Error updating user profile", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    await connectToMongo();
    const db = client.db("codeHub");
    const usersCollection = db.collection("users");

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

    if (result.deleteCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User profile deleted" });
    
  } catch (err) {
    console.error("Error deleting user profile", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  signUp,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
