const { existsSync } = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const frontendDir = path.join(rootDir, "frontend");
const indexPath = path.join(frontendDir, "build", "index.html");
const force = process.argv.includes("--force");

const run = (command, args) => {
    const result = spawnSync(command, args, {
        cwd: rootDir,
        stdio: "inherit",
        shell: process.platform === "win32",
    });

    if (result.status !== 0) {
        process.exit(result.status || 1);
    }
};

if (!force && existsSync(indexPath)) {
    console.log("Frontend build already exists. Skipping frontend build.");
    process.exit(0);
}

console.log("Installing frontend dependencies...");
run("npm", ["install", "--prefix", "frontend"]);

console.log("Building frontend...");
run("npm", ["run", "build", "--prefix", "frontend"]);
