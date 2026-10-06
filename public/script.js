(function () {
  'use strict';

  var GITHUB_USER = 'Sode-No-shirayuki';
  var REPOS_URL = 'https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated&per_page=12';

  var statusEl = document.getElementById('repos-status');
  var listEl = document.getElementById('repos-list');
  var yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function showStatus(message) {
    statusEl.textContent = message;
    statusEl.hidden = false;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function repoCard(repo) {
    var card = el('article', 'card');
    card.appendChild(el('h3', '', repo.name));
    card.appendChild(el('p', '', repo.description || 'No description provided.'));

    var meta = el('div', 'repo-meta');
    meta.appendChild(el('span', '', repo.language || 'Language not set'));
    meta.appendChild(el('span', '', '★ ' + repo.stargazers_count));
    card.appendChild(meta);

    var link = el('a', 'card-link', 'View repository →');
    link.href = repo.html_url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'View ' + repo.name + ' on GitHub');
    card.appendChild(link);

    return card;
  }

  function loadRepos() {
    if (!statusEl || !listEl) return;

    fetch(REPOS_URL, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (response) {
        if (!response.ok) throw new Error('GitHub API responded with ' + response.status);
        return response.json();
      })
      .then(function (repos) {
        if (!Array.isArray(repos) || repos.length === 0) {
          showStatus('No public repositories to show yet.');
          return;
        }
        repos.forEach(function (repo) {
          listEl.appendChild(repoCard(repo));
        });
        statusEl.hidden = true;
      })
      .catch(function () {
        showStatus('Could not load repositories right now. Please visit my GitHub profile instead.');
      });
  }

  loadRepos();
})();
