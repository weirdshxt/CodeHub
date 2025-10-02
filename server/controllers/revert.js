const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);


async function revertChanges(commitID) {
  const repoPath = path.resolve(process.cwd(), ".code");
  const commitPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitPath, commitID);
    const commitFiles = await readdir(commitDir);
    const parentDir = path.resolve(repoPath, "..")

    for (const file of commitFiles) {
      await copyFile(path.join(commitDir, file), path.join(parentDir, file));
    }

    console.log(`Changes reverted to commit ${commitID}`);

  } catch (err) {
    console.error("Error reverting changes:", err);
    
  }

}

module.exports = { revertChanges };
