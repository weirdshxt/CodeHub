const fs = require("fs").promises;
const path = require("path");
const {s3, S3_BUCKET} = require("../config/awsConfig");


async function pullChanges() {
 const repoPath = path.resolve(process.cwd(), ".code");
 const commitPath = path.join(repoPath, "commits");

try {
  const data = await s3.listObjects({ Bucket: S3_BUCKET, Prefix: "commits/" }).promise();
  const files = data.Contents;

  for (const file of files) {
    const fileKey = file.Key;
    const commitID = path.dirname(fileKey).split('/').pop();
    const commitDir = path.join(commitPath, commitID);

    await fs.mkdir(commitDir, { recursive: true });

    const params = {
      Bucket: S3_BUCKET,
      Key: fileKey,
    };

    const fileData = await s3.getObject(params).promise();
    await fs.writeFile(path.join(repoPath, fileKey), fileData.Body);

    console.log(`Pulled ${fileKey} to ${repoPath}`);
  }
  
} catch (err) {
  console.error("Error pulling from S3:", err);
}
  
}

module.exports = { pullChanges };
