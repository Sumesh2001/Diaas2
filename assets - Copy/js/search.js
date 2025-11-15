function toggleSearch() {
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  searchBar.classList.toggle('hidden');
  if (!searchBar.classList.contains('hidden')) {
    searchInput.focus();
  }
}

function closeSearch() {
  document.getElementById('searchBar').classList.add('hidden');
  document.getElementById('searchResults').classList.add('hidden');
  document.getElementById('searchInput').value = '';
}

function performSearch(event) {
  if (event.key === 'Enter') {
    const query = document.getElementById('searchInput').value;
    displaySearchResults(query);
  }
}

function performMobileSearch() {
  const query = document.getElementById('mobileSearchInput').value;
  displaySearchResults(query);
}

function displaySearchResults(query) {
  const resultsContainer = document.getElementById('searchResults');
  const data = getSearchData();
  const results = data.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.description.toLowerCase().includes(query.toLowerCase())
  );
  
  if (results.length === 0) {
    resultsContainer.querySelector('div').innerHTML = '<p class="text-gray-500 p-4">No results found</p>';
  } else {
    resultsContainer.querySelector('div').innerHTML = results.map(result => `
      <a href="${result.link}" class="block p-4 border-b border-gray-100 hover:bg-gray-50 transition">
        <p class="font-semibold text-gray-900">${result.title}</p>
        <p class="text-sm text-gray-600">${result.description}</p>
      </a>
    `).join('');
  }
  
  resultsContainer.classList.remove('hidden');
}

function getSearchData() {
  return [
    { title: 'Services', description: 'Explore our comprehensive services', link: '#services' },
    { title: 'About Us', description: 'Learn more about Diaas', link: 'pages/about.html' },
    { title: 'Blog', description: 'Read our latest articles', link: 'pages/blogs.html' },
    { title: 'Case Studies', description: 'See our success stories', link: 'pages/case-studies.html' },
    { title: 'Careers', description: 'Join our team', link: 'pages/careers.html' },
    { title: 'Contact', description: 'Get in touch with us', link: '#contact' }
  ];
}

// Close search when clicking outside
document.addEventListener('click', function(event) {
  const searchBar = document.getElementById('searchBar');
  const searchResults = document.getElementById('searchResults');
  const searchButton = event.target.closest('button[onclick*="toggleSearch"]');
  
  if (!searchBar.contains(event.target) && !searchResults.contains(event.target) && !searchButton) {
    closeSearch();
  }
});
