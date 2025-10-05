const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createIssue = async (req, res) => {
  const { title, description, repository } = req.body;
  const id = req.params;

  try {
    const issueData = new Issue({
      title,
      description,
      repository: id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedIssue = await issueData.save();
    res
      .status(201)
      .json({ messsage: "Issue created successfully", savedIssue });
  } catch (err) {
    console.error("Error creating issue: ", err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateIssueById = async (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (status) issue.status = status;
    issue.updatedAt = new Date();

    await issue.save();

    res.status(200).json({ message: "Issue updated successfully", issue });
  } catch (err) {
    console.error("Error updating issue: ", err.messsage);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteIssueById = async (req, res) => {
  const id = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(200).json({ message: "Issue deleted successfully", issue });
  } catch (err) {
    console.error("Error deleting issue: ", err.messsage);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllIssues = async (req, res) => {
  const id = req.params;

  try {
    const issues = await Issue.find({ repository: id });

    if (!issues) {
      return res.status(404).json({ error: "Issues not found" });
    }

    res.status(200).json({ message: "Issues fetched successfully", issues });
  } catch (err) {
    console.error("Error fetching issues: ", err.messsage);
    res.status(500).json({ error: "Server error" });
  }
};

const getIssueById = async (req, res) => {
  const id = req.params;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(200).json({ message: "Issue fetched successfully", issue });
  } catch (err) {
    console.error("Error fetching issue: ", err.messsage);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
