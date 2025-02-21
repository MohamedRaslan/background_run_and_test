module.exports = {
  branches: [
    "main", // Regular releases for the main branch
    {
      name: "staging", // Pre-releases for the staging branch
      channel: "beta",
      prerelease: "beta",
    },
  ],
  plugins: [
    "@semantic-release/commit-analyzer", // Analyzes commits to determine the version bump
    "@semantic-release/release-notes-generator", // Generates release notes
    "@semantic-release/github", // Publishes the release to GitHub
  ],
};
