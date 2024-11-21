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

    const filteredContent = `
        <div class="response-item">
            <span class="response-label">Numbers:</span> <span>${apiResponse.numbers.join(', ')}</span>
        </div>
        <div class="response-item">
            <span class="response-label">Alphabets:</span> <span>${apiResponse.alphabets.join(', ')}</span>
        </div>
        <div class="response-item">
            <span class="response-label">Highest Lowercase Alphabet:</span> <span>${apiResponse.highest_lowercase_alphabet.join(', ')}</span>
        </div>
    `;

    responseDiv.innerHTML = filteredContent;
    responseTitle.textContent = 'Response';
}

async function handleSubmit() {
    const jsonInput = document.getElementById('jsonInput').value;
    const errorDiv = document.getElementById('error');

    try {
        const parsedInput = JSON.parse(jsonInput);
        console.log('Parsed Input:', parsedInput);
        errorDiv.textContent = '';

        const response = await fetch('https://bajaj-assessment-1.vercel.app/bfhl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: parsedInput })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        apiResponse = await response.json();
        console.log('API Response:', apiResponse);
        updateFilteredResponse();

    } catch (error) {
        console.error('Error:', error.message);
        errorDiv.textContent = 'Invalid JSON format or failed to connect to server';
        document.getElementById('filteredResponse').innerHTML = '';
    }
}

document.addEventListener('click', function(event) {
    if (!event.target.closest('.filter-container')) {
        document.getElementById('dropdown').classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);
});

// document.getElementById('submitBtn').addEventListener('click', handleSubmit);

document.getElementById('filterBtn').addEventListener('click', toggleDropdown);

document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function() {
        toggleFilter(this.getAttribute('data-filter'));
    });
});

document.addEventListener('click', function(event) {
    if (!event.target.closest('.filter-container')) {
        document.getElementById('dropdown').classList.remove('show');
    }
});