/**
 * @type {import('semantic-release').GlobalConfig}
 */

module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/git',
      {
        assets: ['dist/*.js', 'dist/*.js.map'],
        successComment: ({ nextRelease }) =>
          `:tada: This issue has been resolved in version ${nextRelease.version} :tada:\n\nThe release is available on [GitHub release](<github_release_url>)`
      }
    ],
    '@semantic-release/github'
  ]
}
