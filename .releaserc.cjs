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
    [
      "@semantic-release/github", // Publishes the release to GitHub
      {
        successComment:
          ":tada: This ${issue.pull_request ? 'pull request' : 'issue'} has been resolved in version ${nextRelease.version} :tada:\n\nThe release is available on [GitHub release](<github_release_url>)",
        failComment:
          "🚨 This release from branch ${branch.name} had failed due to the following errors:\n- ${errors.map(err => err.message).join('\\n- ')}",
        failTitle: "🚨 Automated release failed for ${nextRelease.version} release",
        labels: ["auto-release-fail"],
        releasedLabels: ['released<%= nextRelease.channel ? ` on @${nextRelease.channel}` : "production" %>'],
      },
    ],
  ],
};

