// Configuration
const CONFIG = {
    username: 'sagoyanfisic',
    apiBase: 'https://api.github.com',
    cacheExpiry: 5 * 60 * 1000, // 5 minutes
};

// State management
const state = {
    repositories: [],
    filteredRepos: [],
    currentSort: 'updated',
    currentLanguage: 'all',
    searchQuery: '',
    theme: localStorage.getItem('theme') || 'light',
};

// Theme management
function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
    icon.textContent = state.theme === 'light' ? '🌙' : '☀️';
}

// API utilities
async function fetchWithCache(url, key) {
    const cached = localStorage.getItem(key);
    const cacheTime = localStorage.getItem(`${key}_time`);

    if (cached && cacheTime) {
        const age = Date.now() - parseInt(cacheTime);
        if (age < CONFIG.cacheExpiry) {
            return JSON.parse(cached);
        }
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${key}_time`, Date.now().toString());

    return data;
}

// Fetch user profile data
async function fetchUserProfile() {
    try {
        const data = await fetchWithCache(
            `${CONFIG.apiBase}/users/${CONFIG.username}`,
            'github_profile'
        );

        updateProfileUI(data);

    } catch (error) {
        console.error('Error fetching user profile:', error);
        showError('No se pudo cargar el perfil de usuario');
        document.getElementById('username').textContent = CONFIG.username;
    }
}

function updateProfileUI(data) {
    // Update profile information
    const avatar = document.getElementById('avatar');
    avatar.src = data.avatar_url;
    avatar.alt = `Avatar de ${data.name || data.login}`;

    document.getElementById('username').textContent = data.name || data.login;
    document.getElementById('bio').textContent = data.bio || 'Desarrollador apasionado por la tecnología';

    // Add profile links if available
    const linksContainer = document.getElementById('profile-links');
    linksContainer.innerHTML = '';

    if (data.blog) {
        const blogLink = createProfileLink('🌐', data.blog.startsWith('http') ? data.blog : `https://${data.blog}`, 'Sitio web');
        linksContainer.appendChild(blogLink);
    }

    if (data.twitter_username) {
        const twitterLink = createProfileLink('🐦', `https://twitter.com/${data.twitter_username}`, 'Twitter');
        linksContainer.appendChild(twitterLink);
    }

    if (data.location) {
        const locationSpan = document.createElement('span');
        locationSpan.className = 'profile-link';
        locationSpan.textContent = `📍 ${data.location}`;
        linksContainer.appendChild(locationSpan);
    }

    // Update stats
    document.getElementById('followers').textContent = `👥 ${formatNumber(data.followers)} seguidores`;
    document.getElementById('following').textContent = `👤 ${formatNumber(data.following)} siguiendo`;
    document.getElementById('public-repos').textContent = `📚 ${formatNumber(data.public_repos)} repositorios`;
}

function createProfileLink(emoji, url, label) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'profile-link';
    link.textContent = `${emoji} ${label}`;
    return link;
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Fetch repositories data
async function fetchRepositories() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');

    try {
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';

        const repos = await fetchWithCache(
            `${CONFIG.apiBase}/users/${CONFIG.username}/repos?sort=updated&per_page=100`,
            'github_repos'
        );

        // Filter out forks
        state.repositories = repos.filter(repo => !repo.fork);
        state.filteredRepos = [...state.repositories];

        // Populate language filter
        populateLanguageFilter();

        // Apply initial sort and display
        sortAndDisplayRepositories();

        loadingEl.style.display = 'none';

        // Update last updated time
        updateLastUpdated();

    } catch (error) {
        console.error('Error fetching repositories:', error);
        loadingEl.style.display = 'none';
        showError('Error al cargar los repositorios. Por favor, intenta de nuevo.');
    }
}

function showError(message) {
    const errorEl = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    errorText.textContent = message;
    errorEl.style.display = 'block';
}

function populateLanguageFilter() {
    const languages = new Set();
    state.repositories.forEach(repo => {
        if (repo.language) {
            languages.add(repo.language);
        }
    });

    const languageFilter = document.getElementById('language-filter');
    const sortedLanguages = Array.from(languages).sort();

    sortedLanguages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang;
        languageFilter.appendChild(option);
    });
}

// Filter and sort functionality
function applyFilters() {
    let filtered = [...state.repositories];

    // Apply language filter
    if (state.currentLanguage !== 'all') {
        filtered = filtered.filter(repo => repo.language === state.currentLanguage);
    }

    // Apply search filter
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(repo =>
            repo.name.toLowerCase().includes(query) ||
            (repo.description && repo.description.toLowerCase().includes(query))
        );
    }

    state.filteredRepos = filtered;
}

function sortRepositories() {
    const sortFunctions = {
        updated: (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
        stars: (a, b) => b.stargazers_count - a.stargazers_count,
        forks: (a, b) => b.forks_count - a.forks_count,
        name: (a, b) => a.name.localeCompare(b.name),
    };

    state.filteredRepos.sort(sortFunctions[state.currentSort]);
}

function sortAndDisplayRepositories() {
    applyFilters();
    sortRepositories();
    displayRepositories();
}

function displayRepositories() {
    const reposContainer = document.getElementById('repositories');
    const repoCount = document.getElementById('repo-count');

    reposContainer.innerHTML = '';

    if (state.filteredRepos.length === 0) {
        reposContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No se encontraron repositorios.</p>';
        repoCount.style.display = 'none';
        return;
    }

    // Update count
    repoCount.textContent = `Mostrando ${state.filteredRepos.length} de ${state.repositories.length} repositorios`;
    repoCount.style.display = 'block';

    // Create cards with stagger animation
    state.filteredRepos.forEach((repo, index) => {
        const repoCard = createRepoCard(repo);
        repoCard.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s backwards`;
        reposContainer.appendChild(repoCard);
    });
}

// Create repository card element
function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';

    const name = document.createElement('a');
    name.href = repo.html_url;
    name.target = '_blank';
    name.rel = 'noopener noreferrer';
    name.className = 'repo-name';
    name.textContent = repo.name;

    const description = document.createElement('p');
    description.className = 'repo-description';
    description.textContent = repo.description || 'Sin descripción';

    const stats = document.createElement('div');
    stats.className = 'repo-stats';

    const stars = document.createElement('span');
    stars.className = 'repo-stat';
    stars.innerHTML = `⭐ ${formatNumber(repo.stargazers_count)}`;
    stars.title = `${repo.stargazers_count} estrellas`;

    const forks = document.createElement('span');
    forks.className = 'repo-stat';
    forks.innerHTML = `🔱 ${formatNumber(repo.forks_count)}`;
    forks.title = `${repo.forks_count} forks`;

    const updated = document.createElement('span');
    updated.className = 'repo-stat';
    updated.innerHTML = `🕒 ${formatDate(repo.updated_at)}`;
    updated.title = new Date(repo.updated_at).toLocaleDateString();

    stats.appendChild(stars);
    stats.appendChild(forks);
    stats.appendChild(updated);

    card.appendChild(name);
    card.appendChild(description);
    card.appendChild(stats);

    // Add language badge if available
    if (repo.language) {
        const language = document.createElement('span');
        language.className = 'language';
        language.textContent = repo.language;
        card.appendChild(language);
    }

    return card;
}

// Format date to relative time
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `${diffDays} días`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} años`;
}

function updateLastUpdated() {
    const lastUpdatedEl = document.getElementById('last-updated');
    const now = new Date();
    lastUpdatedEl.textContent = `Última actualización: ${now.toLocaleTimeString()}`;
}

// Event listeners
function initEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);

    // Search
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        sortAndDisplayRepositories();
    });

    // Sort
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        state.currentSort = e.target.value;
        sortAndDisplayRepositories();
    });

    // Language filter
    const languageFilter = document.getElementById('language-filter');
    languageFilter.addEventListener('change', (e) => {
        state.currentLanguage = e.target.value;
        sortAndDisplayRepositories();
    });

    // Retry button
    const retryButton = document.getElementById('retry-button');
    retryButton.addEventListener('click', () => {
        // Clear cache and retry
        localStorage.removeItem('github_repos');
        localStorage.removeItem('github_repos_time');
        fetchRepositories();
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initEventListeners();
    fetchUserProfile();
    fetchRepositories();
});
