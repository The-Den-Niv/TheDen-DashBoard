let balanceData = {
    labels: [],
    datasets: [{
        label: 'Crew Total Balance ($)',
        data: [],
        borderColor: '#c0c0c0',
        tension: 0.1
    }]
};

const ctx = document.getElementById('balanceChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: balanceData,
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function addData() {
    const date = new Date().toLocaleDateString();
    const amount = Math.floor(Math.random() * 1000) + 500;
    balanceData.labels.push(date);
    balanceData.datasets[0].data.push(amount);
    chart.update();
}

function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Initial data
addData();
addData();
addData();

// Add progress animation
document.addEventListener('DOMContentLoaded', () => {
    const progress = document.querySelector('.progress');
    progress.style.width = '75%'; // Sync with actual level percentage
});
