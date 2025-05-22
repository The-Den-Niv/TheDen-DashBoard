// Chart initialization
const ctx = document.getElementById('balanceChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Crew Balance ($)',
            data: [5000, 6200, 7500, 8200, 9000],
            borderColor: '#c0c0c0',
            tension: 0.4
        }]
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
