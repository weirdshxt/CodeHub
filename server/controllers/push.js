const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/awsConfig");

async function pushChanges() {
  const repoPath = path.resolve(process.cwd(), ".code");
  const commitPath = path.join(repoPath, "commits");

  try {
    const files = await fs.readdir(commitPath);
    for (const file of files) {
      const filePath = path.join(commitPath, file);
      const fileContents = await fs.readdir(filePath);

      for (const fileContent of fileContents) {
        const contentPath = path.join(filePath, fileContent);
        const fileData = await fs.readFile(contentPath);

        const params = {
          Bucket: S3_BUCKET,
          Key: `commits/${file}/${fileContent}`,
          Body: fileData,
        };

        await s3.upload(params).promise();
      }
    }
    console.log("Changes pushed to S3");
  } catch (err) {
    console.error("Error pushing to S3:", err);
  }
}

module.exports = { pushChanges };
