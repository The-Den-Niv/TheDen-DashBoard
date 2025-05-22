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

// Admin login
let isAdmin = false;

function toggleLogin() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'flex';
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if(username === 'admin' && password === 'secret') {
        isAdmin = true;
        document.getElementById('addDataBtn').style.display = 'block';
        document.getElementById('loginModal').style.display = 'none';
    }
}

// Data form (simplified)
function showDataForm() {
    const date = prompt('Enter date (YYYY-MM-DD):');
    const amount = prompt('Enter amount ($):');
    if(date && amount) {
        chart.data.labels.push(date);
        chart.data.datasets[0].data.push(amount);
        chart.update();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if(event.target == modal) {
        modal.style.display = 'none';
    }
}
