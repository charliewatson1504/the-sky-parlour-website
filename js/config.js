const isGitHubPages = window.location.hostname.includes('github.io');
const isDevelopment =
  window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';

const config = {
  baseUrl: isGitHubPages ? '/the-sky-parlour-website' : '',
  // For debugging
  isGitHubPages,
  isDevelopment,
};

export default config;
