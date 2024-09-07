const fs = require("fs");
const path = require("path");

const hooksDir = path.join(".husky");

fs.readdirSync(hooksDir).forEach((file) => {
  const filePath = path.join(hooksDir, file);
  if (file !== "_" && !file.endsWith(".sample") && !file.endsWith(".md")) {
    fs.chmodSync(filePath, 0o755);
    console.log(`Made ${filePath} executable`);
  }
});
