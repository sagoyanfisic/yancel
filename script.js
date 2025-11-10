// GitHub username - automatically extracted from the repository
const GITHUB_USERNAME = 'sagoyanfisic';

// Fetch user profile data
async function fetchUserProfile() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        const data = await response.json();
        
        // Update profile information
        document.getElementById('avatar').src = data.avatar_url;
        document.getElementById('username').textContent = data.name || data.login;
        document.getElementById('bio').textContent = data.bio || 'Desarrollador apasionado por la tecnología';
        
        // Update stats
        document.getElementById('followers').textContent = `👥 ${data.followers} seguidores`;
        document.getElementById('following').textContent = `👤 ${data.following} siguiendo`;
        document.getElementById('public-repos').textContent = `📚 ${data.public_repos} repositorios`;
        
    } catch (error) {
        console.error('Error fetching user profile:', error);
        document.getElementById('username').textContent = GITHUB_USERNAME;
    }
}

// Fetch repositories data
async function fetchRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        const repos = await response.json();
        
        // Hide loading message
        document.getElementById('loading').style.display = 'none';
        
        // Filter out forks and sort by stars
        const ownRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);
        
        // Display repositories
        const reposContainer = document.getElementById('repositories');
        
        if (ownRepos.length === 0) {
            reposContainer.innerHTML = '<p>No hay repositorios disponibles.</p>';
            return;
        }
        
        ownRepos.forEach(repo => {
            const repoCard = createRepoCard(repo);
            reposContainer.appendChild(repoCard);
        });
        
    } catch (error) {
        console.error('Error fetching repositories:', error);
        document.getElementById('loading').textContent = 'Error al cargar los repositorios';
    }
}

// Create repository card element
function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    
    const name = document.createElement('a');
    name.href = repo.html_url;
    name.target = '_blank';
    name.className = 'repo-name';
    name.textContent = repo.name;
    
    const description = document.createElement('p');
    description.className = 'repo-description';
    description.textContent = repo.description || 'Sin descripción';
    
    const stats = document.createElement('div');
    stats.className = 'repo-stats';
    
    const stars = document.createElement('span');
    stars.className = 'repo-stat';
    stars.innerHTML = `⭐ ${repo.stargazers_count}`;
    
    const forks = document.createElement('span');
    forks.className = 'repo-stat';
    forks.innerHTML = `🔱 ${repo.forks_count}`;
    
    const updated = document.createElement('span');
    updated.className = 'repo-stat';
    updated.innerHTML = `🕒 ${formatDate(repo.updated_at)}`;
    
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

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfile();
    fetchRepositories();
});
