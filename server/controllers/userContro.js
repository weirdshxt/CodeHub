const getAllUsers = (req, res) => {
    console.log("getAllUsers");
};

const signUp = (req, res) => {
  res.send("signUp");
}

const login = (req, res) => {
    console.log("login");
}

const logout = (req, res) => {
    console.log("logout");
}

const getUserProfile = (req, res) => {
    console.log("getUserProfile");
}

const updateUserProfile = (req, res) => {
    console.log("updateUserProfile");
}

const deleteUserProfile = (req, res) => {
    console.log("deleteUser");
}

module.exports = { getAllUsers, signUp, login, logout, getUserProfile, updateUserProfile, deleteUserProfile};