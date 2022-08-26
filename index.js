const core = require('@actions/core');
const github = require('@actions/github');
const token = core.getInput('token', { required: true });
const repo = core.getInput('repo', { required: true });    
const owner = core.getInput('owner', { required: true });
const octokit = new github.getOctokit(token);

const main = async () => {

  const key = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
    owner: owner,
    repo: repo
  })

  const libsodium = require("libsodium")

  const secret_name = core.getInput('secret_name', { required: true });
  const secret_value = core.getInput('secret_value', { required: true });

  
  // Convert the message and key to Uint8Array's (Buffer implements that interface)
  const messageBytes = Buffer.from(secret_value);
  const keyBytes = Buffer.from(key, 'base64');
  
  // Encrypt using LibSodium.
  const encryptedBytes = libsodium.seal(messageBytes, keyBytes);
  
  // Base64 the encrypted secret
  const encrypted = Buffer.from(encryptedBytes).toString('base64');
  
  console.log(encrypted);

  await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
    owner: owner,
    repo: repo,
    secret_name: secret_name,
    encrypted_value: encrypted,
    key_id: key.key_id
  })
  
}

// Call the main function to run the action


main();