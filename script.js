let currentPage = 0;
let totalPages = 0;

async function search() {
    currentPage = 0;
    await fetchResults();
}

async function fetchResults() {
    const query = document.getElementById('searchQuery').value;
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const resultsDiv = document.getElementById('results');

    loadingDiv.style.display = 'block';
    errorDiv.textContent = '';
    resultsDiv.innerHTML = '';

    try {
        const response = await fetch(`http://localhost:3000/search?q=${query}&pages=${currentPage + 1}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        console.log('Data received:', data);
        displayResults(data);
        totalPages = Math.ceil(data.length / 10); // Assuming 10 results per page
        updatePaginationButtons(data.length);
    } catch (error) {
        console.error('Error:', error);
        errorDiv.textContent = 'An error occurred while fetching data. Please try again.';
    } finally {
        loadingDiv.style.display = 'none';
    }
}

function displayResults(items) {
    const resultsDiv = document.getElementById('results');
    if (Array.isArray(items) && items.length > 0) {
        items.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `<h3><a href="${item.link}" target="_blank">${item.title}</a></h3><p>${item.snippet}</p>`;
            resultsDiv.appendChild(div);
        });
    } else {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
}

function changePage(direction) {
    currentPage += direction;
    fetchResults();
}

function updatePaginationButtons(resultsCount) {
    document.getElementById('prevPage').disabled = currentPage <= 0;
    document.getElementById('nextPage').disabled = resultsCount < 10;
}
