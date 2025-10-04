
const createRepo = (req, res) => {
    res.send("Repo created");
};

const getAllRepos = (req, res) => {
    res.send("All Repos fetched!");
};

const fetchRepoById = (req, res) => {
    res.send("Repo details fetched");
};

const fetchRepoByName = (req, res) => {
    res.send("Repo details fetched");
};

const fetchRepoForCurrentUser = (req, res) => {
    res.send("Repo created");
};

const updateRepoById = (req, res) => {
    res.send("Repo created");
};

const toggleVisibilityRepoById = (req, res) => {
    res.send("Repo created");
};

const DeleteRepoById = (req, res) => {
    res.send("Repo created");
};


module.exports = {
    createRepo,
    getAllRepos,
    fetchRepoById,
    fetchRepoByName,
    fetchRepoForCurrentUser,
    updateRepoById,
    toggleVisibilityRepoById,
    DeleteRepoById
}