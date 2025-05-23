// Chart initialization
const ctx = document.getElementById('balanceChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Crew Balance ($)',
            data: [],
            borderColor: '#c0c0c0',
            borderWidth: 2,
            pointBackgroundColor: '#2b2b2b',
            pointBorderColor: '#c0c0c0',
            tension: 0.4,
            fill: {
                target: 'origin',
                above: 'rgba(192,192,192,0.1)'
            }
        }]
    },
  options: {
    responsive: true,
    maintainAspectRatio: false, // Add this
        scales: {
            y: {
                grid: { color: 'rgba(192,192,192,0.1)' },
                ticks: { color: '#c0c0c0' }
            },
            x: {
                grid: { color: 'rgba(192,192,192,0.1)' },
                ticks: { color: '#c0c0c0' }
            }
        }
    }
});

// Navigation toggle
function toggleNav() {
    const nav = document.querySelector('.nav-dropdown');
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.querySelector('.nav-dropdown');
    if (!event.target.closest('.nav-btn') && !event.target.closest('.nav-dropdown')) {
        nav.style.display = 'none';
    }
});

function openSettings() {
    document.getElementById('settingsPage').style.display = 'flex';
}

function closeSettings() {
    document.getElementById('settingsPage').style.display = 'none';
}

function addChartData() {
    const date = document.getElementById('chartDate').value;
    const amount = document.getElementById('chartAmount').value;
    
    if (date && amount) {
        // Add to chart logic here
        alert(`Added $${amount} for ${date}`);
    } else {
        alert('Please enter both date and amount');
    }
}

function addCrewMember() {
    const name = document.getElementById('newMemberName').value;
    if (name) {
        // Add crew member logic here
        alert(`Added new crew member: ${name}`);
    }
}

function resetData() {
    if (confirm('WARNING: This will reset all data. Continue?')) {
        // Reset logic here
        alert('All data has been reset');
    }
}
// Open settings page
function openSettings() {
    document.getElementById('settingsPage').style.display = 'flex';
}

// Close settings page
function closeSettings() {
    document.getElementById('settingsPage').style.display = 'none';
}

// Update navigation dropdown link to use the new function
// Change your settings link in the nav dropdown to:
// <a href="#" onclick="openSettings()">Settings</a>
