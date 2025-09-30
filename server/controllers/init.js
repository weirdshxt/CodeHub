const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".code");
  const commitPath = path.join(repoPath, "commits");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitPath, { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({ bucket: "my-bucket" })
    );
    console.log("Initialized empty Git repository");
  } catch (error) {
    console.error("Error initializing repository:", error);
  }
}

module.exports = { initRepo };
