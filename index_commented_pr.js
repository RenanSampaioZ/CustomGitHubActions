const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {

const token = core.getInput('token', { required: true });
const repo = core.getInput('repo', { required: true });    
const owner = core.getInput('owner', { required: true });
// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: token
})

await octokit.request('POST /repos/{owner}/{repo}/releases', {
  owner: owner,
  repo: repo,
  tag_name: 'v1.0.0',
  target_commitish: 'master',
  name: 'v1.0.0',
  body: 'Description of the release',
  draft: false,
  prerelease: false,
  generate_release_notes: false
})
}

// Call the main function to run the action
main();