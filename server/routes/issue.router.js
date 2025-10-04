const express = require('express');
const issueContro = require('../controllers/issue.contro');

const issueRouter = express.Router();

issueRouter.get('/issues', issueContro.getAllIssues);
issueRouter.post('/issues', issueContro.createIssue);
issueRouter.get('/issues/:id', issueContro.getIssueById);
issueRouter.put('/issues/:id', issueContro.updateIssueById);
issueRouter.delete('/issues/:id', issueContro.deleteIssueById);

module.exports = issueRouter; 