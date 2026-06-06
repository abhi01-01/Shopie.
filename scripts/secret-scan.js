const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const patterns = [
    { name: "MongoDB Atlas URI", regex: /mongodb\+srv:\/\//i },
    { name: "Stripe secret key", regex: /sk_(?:live|test)_[A-Za-z0-9]{10,}/ },
    { name: "Cloudinary API secret", regex: /^\s*CLOUDINARY_API_SECRET\s*=\s*\S+/ },
    { name: "JWT secret", regex: /^\s*JWT_SECRET\s*=\s*\S{12,}/ },
    { name: "SMTP password", regex: /^\s*S(?:MTP|MPT)_PASSWORD\s*=\s*\S+/ },
];

const excluded = [
    "backend/config/config.env",
    "frontend/build/",
    "node_modules/",
    "frontend/node_modules/",
    "package-lock.json",
    "frontend/package-lock.json",
];

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
    cwd: root,
    encoding: "utf8",
})
    .split("\n")
    .filter(Boolean)
    .filter((file) => !excluded.some((entry) => file === entry || file.startsWith(entry)));

const findings = [];

files.forEach((file) => {
    const fullPath = path.join(root, file);

    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        return;
    }

    const content = fs.readFileSync(fullPath, "utf8");

    patterns.forEach(({ name, regex }) => {
        const lines = content.split("\n");

        lines.forEach((line, index) => {
            if (regex.test(line)) {
                findings.push(`${file}:${index + 1} matched ${name}`);
            }
        });
    });
});

if (findings.length > 0) {
    console.error("Potential secrets found:");
    findings.forEach((finding) => console.error(`- ${finding}`));
    process.exit(1);
}

console.log(`Secret scan passed for ${files.length} files.`);
