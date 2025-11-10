# yancel

GitHub Pages site displaying personal repository information.

## Features

- **User Profile**: Displays your GitHub avatar, name, bio, and statistics
- **Repository Grid**: Shows all your repositories with details including:
  - Stars and forks count
  - Last updated date
  - Programming language
  - Repository description
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dynamic Content**: Fetches real-time data from the GitHub API

## How to Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Navigate to **Pages** in the left sidebar
4. Under **Source**, select the branch you want to deploy (e.g., `main` or `copilot/add-github-page-for-repositories`)
5. Click **Save**
6. Your site will be published at: `https://sagoyanfisic.github.io/yancel/`

## Files

- `index.html` - Main HTML page structure
- `style.css` - Styling and responsive design
- `script.js` - JavaScript for fetching and displaying GitHub data

## Local Development

To test the site locally:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.