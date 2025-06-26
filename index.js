// define the base URL
const API_URL = "http://localhost:3000/childhood_flix";

// get The DOM elements
const flixListContainer = document.getElementById('flix-list-container');
const addFlixForm = document.getElementById('add-flix-form');
const filterTypeSelect = document.getElementById('filter-type-select');
const flixDetailSection = document.getElementById('flix-detail-section');
const flixDetailContent = document.getElementById('flix-detail-content');
const mainContainer = document.querySelector('main'); // to adjust them grid layout

// functions interacting with the local API

// functio to fetch all flix items
async function fetchAllFlix() {
    try{
        const response = await fetch(API_URL);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${resposse.status}`);
        }
        const flixItems = await resposse.json();
        renderFlixList(flixItems);
    } catch (error) {
        console.error("error fetching flix items:", error);
        flixListContainer.innerHTML = '<p> style="failed to lood the flix"</p>';      
    }
}

// aading a new flix item
async function addFlixItem() {
    try{
        const response = await fetch(API_URL, {
            method:'POST',
            headers: {
                'content-type': 'application/json',
            },
            body : JSON.stringify(flixdata),
        });
        if(!response.ok){
            throw new Error(`HTTP error! status: ${resposse.status}`);
        }
        const newItems = await resposse.json();
        console.log("Added new flix", newFlix);

        // re-fetch the lsist included the in the new item
        fetchAllFlix();
        addFlixForm.reset(); // clear the form
        alert('flix added successfully');
    } catch (error){
        console.error("error adding flix", error);
        alert('failed to add flix. Try again');
    }
}

// deleting the flix item 
async function deleteFlixItem(id) {
    try{
        const response = await fetch(`${API_URL}/${id}`,{
            method: 'DELETE',
        });
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(`Delete flix with ID ${id}`);

// removing from the DOM
document.getElementById(`flix-${id}`).remove();

// clear details of the deleted item
if (flixDetailContent.dataset.currentFlixId === string(id)){
    clearFlixDetail();
}
alert('flix deleted successfully');
    }catch (error){
        console.error("error deleting flix item", error);
        alert ('failed to delete. Try again later');
    }
}

//rendering update to the ui

// rendering a single flix item
function createFlixItemElement(flix){
    const flixDiv = document.createElement('div');
    flixDiv.classList.add('flix-item');
    flixDiv.id =`flix-${flix.id}`;

    flixDiv.innerHTML =`
    <h3>${flix.title}</h3>
    <p><strong>Type:</strong>${flix.year || 'NA'}</p>
    <button class="delete.btn" data-id=">Delete</button>
    `;

    // Event listener for showing details (Distinct Event Listener 1: Click on item)
    flixDiv.addEventListener('click', (event) => {
        // Prevent click on delete button from also triggering detail view
        if (!event.target.classList.contains('delete-btn')) {
            displayFlixDetail(flix);
        }
    });

    // Event listener for the delete button (Distinct Event Listener 2: Click on delete button)
    const deleteButton = flixDiv.querySelector('.delete-btn');
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the parent flixDiv click from firing
        if (confirm(`Are you sure you want to delete "${flix.title}"?`)) {
            deleteFlixItem(flix.id);
        }
    });

    return flixDiv;
}

// Function to render the list of flix items
function renderFlixList(flixItems) {
    flixListContainer.innerHTML = ''; // Clear previous list
    // Array iteration: forEach to render each item
    flixItems.forEach(flix => {
        const flixElement = createFlixItemElement(flix);
        flixListContainer.appendChild(flixElement);
    });
}

// Function to display details of a selected flix item
function displayFlixDetail(flix) {
    flixDetailContent.innerHTML = `
        <h3>${flix.title}</h3>
        <p><strong>Type:</strong> ${flix.type}</p>
        <p><strong>Year:</strong> ${flix.year || 'N/A'}</p>
        <p><strong>Description:</strong> ${flix.description || 'No description available.'}</p>
    `;
    // Store current flix ID for clearing detail view if deleted
    flixDetailContent.dataset.currentFlixId = flix.id;
    // Adjust main layout to show detail section side-by-side
    mainContainer.classList.add('detail-view');
}

// Function to clear the detail view
function clearFlixDetail() {
    flixDetailContent.innerHTML = '<p>Click on an item in your collection to see its details here.</p>';
    delete flixDetailContent.dataset.currentFlixId; // Remove stored ID
    mainContainer.classList.remove('detail-view'); // Reset layout
}


// --- Event Listeners ---

// Event Listener 3: Form submission for adding a new flix
addFlixForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission behavior (page reload)

    const newFlix = {
        title: document.getElementById('title').value,
        type: document.getElementById('type').value,
        year: document.getElementById('year').value ? parseInt(document.getElementById('year').value) : null, // Convert to number or null
        description: document.getElementById('description').value
    };

    addFlixItem(newFlix);
});

// Event Listener 4: Filter by type (Distinct Event Listener 3: Change on select)
filterTypeSelect.addEventListener('change', async (event) => {
    const selectedType = event.target.value;
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allFlix = await response.json();

        let filteredFlix;
        if (selectedType === 'All') {
            filteredFlix = allFlix;
        } else {
            // Array iteration: filter to match selected type
            filteredFlix = allFlix.filter(flix => flix.type === selectedType);
        }
        renderFlixList(filteredFlix);
    } catch (error) {
        console.error("Error filtering flix items:", error);
        flixListContainer.innerHTML = '<p style="color: red;">Failed to filter flix. Please try again.</p>';
    }
});


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    fetchAllFlix(); // Load all flix items when the page loads
});
