// ===== DATA MANAGEMENT ===== // //test//
const appData = {
    crewData: {
        level: 0,
        progress: 0,
        xp: 0
    },
    chartData: [],
    crewMembers: []
};

let balanceChart;
let musicPlayer; // Will hold MusicPlayer instance

// ===== INITIALIZATION ===== //
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    loadData();
    
    // Initialize music player
    musicPlayer = new MusicPlayer();
});

// ===== CHART FUNCTIONS ===== //
function initChart() {
    const ctx = document.getElementById('balanceChart')?.getContext('2d');
    if (!ctx) return;
    
    balanceChart = new Chart(ctx, {
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
                    beginAtZero: false,
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
}

// ===== DATA LOADING ===== //
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to load data');
        const jsonData = await response.json();

        // Update crew stats
        if (jsonData.crewData) {
            appData.crewData = {
                level: Number(jsonData.crewData.level) || 0,
                progress: Math.min(100, Math.max(0, Number(jsonData.crewData.progress))) || 0,
                xp: Number(jsonData.crewData.xp) || 0
            };
        }

        // Update chart data
        if (Array.isArray(jsonData.chartData)) {
            appData.chartData = jsonData.chartData
                .filter(item => item.date && !isNaN(item.amount))
                .map(item => ({
                    date: item.date,
                    amount: Number(item.amount)
                }));
        }

        // Update crew members
        if (Array.isArray(jsonData.crewMembers)) {
            appData.crewMembers = jsonData.crewMembers.map(member => ({
                name: member.name || 'Unknown',
                level: Number(member.level) || 1,
                rank: member.rank || 'Member',
                image: member.image || 'ProfilePics/default.png'
            }));
        }

        updateUI();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// ===== UI UPDATES ===== //
function updateUI() {
    // Update Crew Stats
    document.querySelector('.level-display').textContent = appData.crewData.level;
    document.querySelector('.xp-total').textContent = `Total XP: ${appData.crewData.xp.toLocaleString()}`;
    
    const progressRing = document.querySelector('.progress-ring');
    if (progressRing) {
        progressRing.style.background = `conic-gradient(#909090 ${appData.crewData.progress}%, rgba(144,144,144,0.1) 0)`;
    }

    // Update Chart
    if (balanceChart) {
        balanceChart.data.labels = appData.chartData.map(item => item.date);
        balanceChart.data.datasets[0].data = appData.chartData.map(item => item.amount);
        balanceChart.update();
    }

    // Update Crew Members
    const membersContainer = document.querySelector('.crew-members-horizontal');
    if (membersContainer) {
        membersContainer.innerHTML = appData.crewMembers.map(member => `
            <div class="member-card">
                <img class="profile-img" 
                     src="${member.image}" 
                     onerror="this.src='ProfilePic/default.png'"
                     alt="${member.name}">
                <div class="member-info">
                    <div class="member-level">Level ${member.level}</div>
                    <h3 class="member-name">${member.name}</h3>
                    <div class="member-rank">${member.rank}</div>
                </div>
            </div>
        `).join('');
    }
}

// ===== NAVIGATION ===== //
function toggleNav() {
    const nav = document.querySelector('.nav-dropdown');
    if (nav) {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    }
}

document.addEventListener('click', (event) => {
    const nav = document.querySelector('.nav-dropdown');
    if (nav && !event.target.closest('.nav-btn') && !event.target.closest('.nav-dropdown')) {
        nav.style.display = 'none';
    }
});
