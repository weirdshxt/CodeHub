const express = require('express');
const repoContro = require('../controllers/repoContro');

const repoRouter = express.Router();

repoRouter.get('/repos', repoContro.getAllRepos);
repoRouter.post('/repos', repoContro.createRepo);
repoRouter.get('/repos/user', repoContro.fetchRepoForCurrentUser);
repoRouter.get('/repos/:id', repoContro.fetchRepoById);
repoRouter.get('/repos/:name', repoContro.fetchRepoByName);
repoRouter.put('/repos/:id', repoContro.updateRepoById);
repoRouter.patch('/repos/:id/toggle-visibility', repoContro.toggleVisibilityRepoById);
repoRouter.delete('/repos/:id', repoContro.DeleteRepoById);

module.exports = repoRouter;