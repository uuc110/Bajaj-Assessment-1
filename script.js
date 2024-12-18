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

    let filteredContent = '';

    if (selectedFilters.size === 0) {
        filteredContent = '<div class="response-item">No filters selected. Please select from the filter above.</div>';
    } else {
        selectedFilters.forEach(filter => {
            switch (filter) {
                case 'numbers':
                    filteredContent += `
                        <div class="response-item">
                            <span class="response-label">Numbers:</span> 
                            <span>${apiResponse.numbers.length > 0 ? apiResponse.numbers.join(', ') : 'None'}</span>
                        </div>
                    `;
                    break;
                case 'alphabets':
                    filteredContent += `
                        <div class="response-item">
                            <span class="response-label">Alphabets:</span> 
                            <span>${apiResponse.alphabets.length > 0 ? apiResponse.alphabets.join(', ') : 'None'}</span>
                        </div>
                    `;
                    break;
                case 'highest_lowercase_alphabet':
                    filteredContent += `
                        <div class="response-item">
                            <span class="response-label">Highest Lowercase Alphabet:</span> 
                            <span>${apiResponse.highest_lowercase_alphabet.length > 0 ? apiResponse.highest_lowercase_alphabet.join(', ') : 'None'}</span>
                        </div>
                    `;
                    break;
                // Add other filters if necessary
                default:
                    break;
            }
        });
    }

    responseDiv.innerHTML = filteredContent;
    responseTitle.textContent = 'Response';
}

async function handleSubmit() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    const errorDiv = document.getElementById('error');

    if (!jsonInput) {
        errorDiv.textContent = 'Input cannot be empty. Please enter valid JSON.';
        return;
    }

    try {
        document.getElementById('responseTitle').textContent = 'Loading...';

        // Parse the input JSON
        const parsedInput = JSON.parse(jsonInput);
        
        // Validate the required structure
        if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
            throw new Error('Input must contain a "data" array');
        }

        console.log('Parsed Input:', parsedInput);
        errorDiv.textContent = '';

        const response = await fetch('https://bajaj-assessment-1-phum.onrender.com/bfhl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsedInput) // Send the entire parsed input
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        apiResponse = await response.json();
        console.log('API Response:', apiResponse);
        updateFilteredResponse();
        document.getElementById('responseTitle').textContent = 'Response';

    } catch (error) {
        console.error('Error:', error.message);
        if (error instanceof SyntaxError) {
            errorDiv.textContent = 'Invalid JSON format. Please enter valid JSON.';
        } else {
            errorDiv.textContent = error.message;
        }
        document.getElementById('filteredResponse').innerHTML = '';
        document.getElementById('responseTitle').textContent = '';
    }
}

document.addEventListener('click', function(event) {
    if (!event.target.closest('.filter-container')) {
        document.getElementById('dropdown').classList.remove('show');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);
    document.getElementById('filterBtn').addEventListener('click', toggleDropdown);
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            toggleFilter(this.getAttribute('data-filter'));
        });
    });
});
