const core = require('@actions/core');
const github = require('@actions/github');
const token = core.getInput('token', { required: true });
const repo = core.getInput('repo', { required: true });    
const owner = core.getInput('owner', { required: true });
const octokit = new github.getOctokit(token);

const main = async () => {

  try {
    const last_tag = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
      owner: owner,
      repo: repo
    })

    const last_tag_name = last_tag.data.tag_name

    const array_last_tag_name = last_tag_name.split('')

    array_last_tag_name.shift()

    const last_tag_number = array_last_tag_name.join('')

    await octokit.request('POST /repos/{owner}/{repo}/releases', {
      owner: owner,
      repo: repo,
      tag_name: 'v'+ (parseFloat(last_tag_number) + parseFloat("0.1")).toFixed(1),
      target_commitish: 'hmg',
      name: 'v'+ (parseFloat(last_tag_number) + parseFloat("0.1")).toFixed(1),
      draft: false,
      prerelease: false,
      generate_release_notes: false
      
    })   
    
    await octokit.request('POST /repos/{owner}/{repo}/releases/generate-notes', {
        owner: owner,
        repo: repo,
        tag_name: 'v'+ (parseFloat(last_tag_number) + parseFloat("0.1")).toFixed(1),
        target_commitish: 'hmg',
        previous_tag_name: 'v'+ (parseFloat(last_tag_number)).toFixed(1),
        // configuration_file_path: '.github/custom_release_config.yml'
    })
  } catch (error) {
    await octokit.request('POST /repos/{owner}/{repo}/releases', {
      owner: owner,
      repo: repo,
      tag_name: 'v1.0',
      target_commitish: 'hmg',
      name: 'v1.0',
      draft: false,
      prerelease: false,
      generate_release_notes: false   
    })     
  }
}

// Call the main function to run the action


main();