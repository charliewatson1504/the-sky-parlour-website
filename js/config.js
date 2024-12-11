const isGitHubPages = window.location.hostname.includes('github.io');

const config = {
  baseUrl: isGitHubPages ? '/the-sky-parlour-website' : '',
};

export default config;
