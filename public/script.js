const container = document.getElementById('busDataContainer');
const searchBar = document.getElementById('searchBar');
let allBusData = [];

async function fetchBuses() {
    try {
        const response = await fetch('/api/buses');
        allBusData = await response.json();
        displayBuses(allBusData);
    } catch (err) {
        container.innerHTML = `<p style="color:red; text-align:center;">Error connecting to server.</p>`;
    }
}

function displayBuses(data) {
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>No routes found.</p>";
        return;
    }

    // Grouping logic
    const grouped = data.reduce((acc, bus) => {
        if (!acc[bus.route_name]) acc[bus.route_name] = [];
        acc[bus.route_name].push(bus);
        return acc;
    }, {});

    for (const routeName in grouped) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'route-group';

        groupDiv.innerHTML = `
            <div class="route-header">
                <span>${routeName}</span>
                <span class="arrow">▼</span>
            </div>
            <div class="route-content">
                ${grouped[routeName].map(stop => `
                    <div class="stop-row">
                        <span>${stop.stop_name}</span>
                        <span class="stop-time">${stop.arrival_time}</span>
                    </div>
                `).join('')}
            </div>
        `;

        groupDiv.querySelector('.route-header').addEventListener('click', function() {
            const content = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');
            content.classList.toggle('active');
            arrow.style.transform = content.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        });

        container.appendChild(groupDiv);
    }
}

searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allBusData.filter(bus => 
        bus.stop_name.toLowerCase().includes(term) || 
        bus.route_name.toLowerCase().includes(term)
    );
    displayBuses(filtered);
});

fetchBuses();