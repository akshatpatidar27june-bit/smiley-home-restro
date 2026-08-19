// GitHub-backed decoration storage helpers.
// Used by the Render API so uploaded decoration images survive Render restarts.
export async function githubStorageConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "akshatpatidar27june-bit/waiting-for-name";
  const branch = process.env.GITHUB_BRANCH || "main";
  const folder = process.env.GITHUB_DECORATION_FOLDER || "public/decorations";
  if (!token) throw new Error("GITHUB_TOKEN is not configured on the server.");
  return { token, repo, branch, folder };
}

export function githubFileUrl(repo, branch, filePath) {
  return `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`;
}
