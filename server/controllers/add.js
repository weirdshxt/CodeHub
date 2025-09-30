const fs = require("fs").promises;
const path = require("path");

async function addRepo(file) {
  const repoPath = path.resolve(process.cwd(), ".code");
  const statusPath = path.join(repoPath, "status");
  const filePath = path.join(statusPath, file);

  try {
    await fs.mkdir(statusPath, { recursive: true });
    const fileName = path.basename(file);
    await fs.copyFile(file, filePath);
    console.log(`Added file ${fileName} to repository`);
  } catch (error) {
    console.error("Error adding file to repository:", error);
  }
}

module.exports = { addRepo };
