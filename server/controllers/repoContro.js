const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createRepo = async (req, res) => {
  const { owner, name, description, content, visibility, issues } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Repository name is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(owner);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if repository with the same name already exists
    const existingRepo = await Repository.findOne({ name });
    if (existingRepo) {
      return res.status(400).json({ message: "Repository already exists" });
    }

    const newRepo = new Repository({
      name,
      description,
      content: content || [],
      visibility: visibility || true,
      owner,
      stars: 0,
      forks: 0,
      issues: [],
    });

    // if(issue){
    //     if(!mongoose.Types.ObjectId.isValid(issue)){
    //         return res.status(400).json({ message: "Invalid issue ID" });
    //     }
    //     const newIssue = await Issue.findById(issue);
    //     if(!newIssue){
    //         return res.status(404).json({ message: "Issue not found" });
    //     }
    //     newRepo.issues.push(newIssue);
    // }

    await newRepo.save();
    user.repositiories.push(newRepo);
    await user.save();

    res
      .status(201)
      .json({ message: "Repository created successfully", repo: newRepo._id });
  } catch (error) {
    console.error("Error creating repository:", error.message);
    res.status(500).json({ message: "Error creating repository", error });
  }
};

const getAllRepos = async (req, res) => {
  try {
    const repos = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.status(200).json(repos);
  } catch (error) {
    console.error("Error fetching repositories:", error.message);
    res.status(500).json({ message: "Error fetching repositories", error });
  }
};

const fetchRepoById = async (req, res) => {
  const id = req.params.id;

  try {
    const repo = await Repository.findById(id)
      .populate("owner")
      .populate("issues");
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.status(200).json(repo);
  } catch (err) {
    console.error("Error fetching repository:", err.message);
    res.status(500).json({ message: "Error fetching repository", err });
  }
};

const fetchRepoByName = async (req, res) => {
  const repoName = req.params.name;
  try {
    const repo = await Repository.findOne({ name: repoName })
      .populate("owner")
      .populate("issues");
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.status(200).json(repo);
  } catch (err) {
    console.error("Error fetching repository:", err.message);
    res.status(500).json({ message: "Error fetching repository", err });
  }
};

const fetchRepoForCurrentUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const repos = await Repository.find({ owner: userId })
      .populate("owner")
      .populate("issues");

    if (!repos || repos.length === 0) {
      return res.status(404).json({ message: "Repositories not found" });
    }

    res
      .status(200)
      .json({ message: "Repositories fetched successfully", repos });
  } catch (err) {
    console.error("Error fetching repositories:", err.message);
    res.status(500).json({ message: "Error fetching repositories", err });
  }
};

const updateRepoById = async (req, res) => {
  const id = req.params.id;
  const { name, description, content } = req.body;

  try {
    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (name) {
      // Check if repository with the same name already exists
      const existingRepo = await Repository.findOne({ name });
      if (existingRepo && existingRepo._id.toString() !== id) {
        return res
          .status(400)
          .json({ message: "Repository name already exists" });
      }
      repo.name = name;
    }

    if (description) repo.description = description;
    if (content) repo.content.push(content);

    await repo.save();
    res.status(200).json({ message: "Repository updated successfully", repo });
  } catch (err) {
    console.error("Error updating repository:", err.message);
    res.status(500).json({ message: "Error updating repository", err });
  }
};

const toggleVisibilityRepoById = async (req, res) => {
  const id = req.params.id;

  try {
    const repo = Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repo.visibility = !repo.visibility;
    await repo.save();

    res.status(200).json({ message: "Repository visibility toggled", repo });
  } catch (err) {
    console.error("Error toggling repository visibility:", err.message);
    res
      .status(500)
      .json({ message: "Error toggling repository visibility", err });
  }
};

const DeleteRepoById = async (req, res) => {
  const id = req.params.id;

  try {
    const repo = await Repository.findByIdAndDelete(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.status(200).json({ message: "Repository deleted successfully", repo });
  } catch (err) {
    console.error("Error deleting repository:", err.message);
    return res.status(500).json({ message: "Error deleting repository", err });
  }
};

module.exports = {
  createRepo,
  getAllRepos,
  fetchRepoById,
  fetchRepoByName,
  fetchRepoForCurrentUser,
  updateRepoById,
  toggleVisibilityRepoById,
  DeleteRepoById,
};
