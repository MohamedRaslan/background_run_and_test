module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Add custom rules here (optional)
    "header-max-length": [2, "always", 150], // Set max length for the commit header
    "type-enum": [
      2, // Severity level: 2 (error), 1 (warning), 0 (disabled)
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation changes
        "style", // Code style changes (e.g., formatting)
        "refactor", // Code refactoring
        "test", // Adding or updating tests
        "chore", // Maintenance tasks (e.g., dependency updates)
        "ci", // CI/CD changes
        "revert", // Reverting a previous commit
        "perf", // Performance improvements
        "build", // Build system changes
      ],
    ],
  },
};
