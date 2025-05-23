/**
 * Initialize the balance chart
 */
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
        maintainAspectRatio: false,
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

/**
 * Navigation dropdown functionality
 */
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

/**
 * Admin Panel functionality
 */
const ADMIN_PASSWORD = "crew123"; // Change this in production

// Show admin login modal
function showAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'flex';
}

// Close admin login modal
function closeAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'none';
    document.getElementById('loginError').textContent = '';
}

// Attempt admin login
function attemptLogin() {
    const password = document.getElementById('adminPassword').value;
    const errorElement = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        closeAdminLogin();
        document.getElementById('adminPanel').style.display = 'flex';
    } else {
        errorElement.textContent = 'Invalid password';
    }
}

// Close admin panel
function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target === document.getElementById('adminLoginModal')) {
        closeAdminLogin();
    }
    if (event.target === document.getElementById('adminPanel')) {
        closeAdminPanel();
    }
}

/**
 * Admin Panel Functions
 */
function addChartData() {
    const date = document.getElementById('chartDate').value;
    const amount = document.getElementById('chartAmount').value;
    
    if (date && amount) {
        // Add to chart logic here
        chart.data.labels.push(date);
        chart.data.datasets[0].data.push(amount);
        chart.update();
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
