let apiResponse = null;
let selectedFilters = new Set();

function toggleDropdown() {
    document.getElementById('dropdown').classList.toggle('show');
}

function toggleFilter(filter) {
    if (selectedFilters.has(filter)) {
        selectedFilters.delete(filter);
    } else {
        selectedFilters.add(filter);
    }
    updateTags();
    updateFilteredResponse();
}

function updateTags() {
    const tagsContainer = document.getElementById('selectedTags');
    tagsContainer.innerHTML = Array.from(selectedFilters).map(filter =>
        `<span class="tag">${filter} <span class="remove" onclick="event.stopPropagation(); toggleFilter('${filter}')">×</span></span>`
    ).join('');
}

function formatResponse(key, value) {
    if (Array.isArray(value)) {
        return value.join(',');
    }
    return value;
}

function updateFilteredResponse() {
    if (!apiResponse) return;

    const responseDiv = document.getElementById('filteredResponse');
    const responseTitle = document.getElementById('responseTitle');

    const filteredContent = Array.from(selectedFilters)
        .filter(key => apiResponse[key])
        .map(key => `
            <div class="response-item">
                <span class="response-label">${key}:</span>
                <span>${formatResponse(key, apiResponse[key])}</span>
            </div>
        `).join('');

    responseDiv.innerHTML = filteredContent || `
        <div class="response-item">
            <span class="response-label">Numbers:</span> <span>${formatResponse('numbers', apiResponse.numbers)}</span>
        </div>
        <div class="response-item">
            <span class="response-label">Alphabets:</span> <span>${formatResponse('alphabets', apiResponse.alphabets)}</span>
        </div>
        <div class="response-item">
            <span class="response-label">Highest Lowercase Alphabet:</span> <span>${formatResponse('highest_lowercase_alphabet', apiResponse.highest_lowercase_alphabet)}</span>
        </div>
    `;

    responseTitle.textContent = selectedFilters.size ? 'Filtered Response' : 'Response';
}

async function handleSubmit() {
    const jsonInput = document.getElementById('jsonInput').value;
    const errorDiv = document.getElementById('error');

    try {
        const parsedInput = JSON.parse(jsonInput);
        errorDiv.textContent = '';

        const response = await fetch('http://localhost:3000/bfhl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsedInput)
        });

        apiResponse = await response.json();
        updateFilteredResponse();

    } catch (error) {
        errorDiv.textContent = 'Invalid JSON format';
        document.getElementById('filteredResponse').innerHTML = '';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.filter-container')) {
        document.getElementById('dropdown').classList.remove('show');
    }
});