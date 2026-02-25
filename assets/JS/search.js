function toggleSearch() {
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  searchBar.classList.toggle('hidden');

  if (!searchBar.classList.contains('hidden')) {
    searchInput.focus();
  }
}

function closeSearch() {
  const searchBar = document.getElementById('searchBar');
  const searchResults = document.getElementById('searchResults');
  const searchInput = document.getElementById('searchInput');

  if (searchBar) searchBar.classList.add('hidden');
  if (searchResults) searchResults.classList.add('hidden');
  if (searchInput) searchInput.value = '';
}

function performSearch(event) {
  if (event.key === 'Enter') {
    const query = document.getElementById('searchInput').value.trim();
    if (query !== '') {
      displaySearchResults(query);
    }
  }
}

function performMobileSearch() {
  const query = document.getElementById('mobileSearchInput').value.trim();
  if (query !== '') {
    displaySearchResults(query);
  }
}

function displaySearchResults(query) {
  const resultsContainer = document.getElementById('searchResults');
  const resultsWrapper = resultsContainer.querySelector('div');

  const searchableElements = document.querySelectorAll('section, h1, h2, h3, p, li');
  const results = [];

  searchableElements.forEach(element => {
    const text = element.innerText;
    if (
      text &&
      text.toLowerCase().includes(query.toLowerCase()) &&
      text.trim().length > 20
    ) {
      let id = element.id;

      // Auto-generate ID if missing
      if (!id) {
        id = 'search-' + Math.random().toString(36).substr(2, 9);
        element.id = id;
      }

      results.push({
        title: element.tagName,
        description: text.substring(0, 120) + '...',
        link: '#' + id
      });
    }
  });

  if (results.length === 0) {
    resultsWrapper.innerHTML =
      '<p class="text-gray-500 p-4">No results found</p>';
  } else {
    resultsWrapper.innerHTML = results.slice(0, 10).map(result => `
      <a href="${result.link}" 
         class="block p-4 border-b border-gray-100 hover:bg-gray-50 transition">
        <p class="font-semibold text-gray-900">${result.description}</p>
      </a>
    `).join('');
  }

  resultsContainer.classList.remove('hidden');
}

document.addEventListener('click', function(event) {
  const searchBar = document.getElementById('searchBar');
  const searchResults = document.getElementById('searchResults');
  const searchButton = event.target.closest('button[onclick*="toggleSearch"]');

  if (
    searchBar &&
    searchResults &&
    !searchBar.contains(event.target) &&
    !searchResults.contains(event.target) &&
    !searchButton
  ) {
    closeSearch();
  }
});