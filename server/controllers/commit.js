const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");



async function commitChanges(message) {
  const commitID = uuidv4();
  const repoPath = path.resolve(process.cwd(), ".code");
  const statusPath = path.join(repoPath, "status");
  const commitsPath = path.join(repoPath, "commits");
  const commitPath = path.join(commitsPath, `${commitID}.json`);


  try {
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.writeFile(commitPath, JSON.stringify({ message, Date: new Date().toISOString(), id: commitID }, null, 2));

    const files = await fs.readdir(statusPath);
    for (const file of files) {
      const filePath = path.join(statusPath, file);
      await fs.copyFile(filePath, path.join(repoPath, file));
    }

    console.log(`Committed changes with ID: ${commitID}`);
  } catch (error) {
    console.error("Error committing changes:", error);
  }
}

module.exports = { commitChanges };
