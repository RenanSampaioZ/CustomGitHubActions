const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {

const token = core.getInput('token', { required: true });
const repo = core.getInput('repo', { required: true });    
const owner = core.getInput('owner', { required: true });
const octokit = new github.getOctokit(token);
  
const last_tag = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
    owner: owner,
    repo: repo
  })

console.log(last_tag)

// await octokit.request('POST /repos/{owner}/{repo}/releases', {
//   owner: owner,
//   repo: repo,
//   tag_name: last_tag + '0.1.0',
//   target_commitish: 'master',
//   name: last_tag + '0.1.0',
//   body: 'Description of the release',
//   draft: false,
//   prerelease: false,
//   generate_release_notes: false
// })
}

// Call the main function to run the action
main();