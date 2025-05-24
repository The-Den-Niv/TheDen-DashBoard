// ===== DATA MANAGEMENT ===== //
const appData = {
  crewData: {
    level: 0,
    progress: 0,
    xp: 0
  },
  chartData: [],
  crewMembers: []
};

// Chart instance
let balanceChart;

// ===== INITIALIZATION ===== //
document.addEventListener('DOMContentLoaded', () => {
  initChart();
  loadData();
});

// ===== CHART FUNCTIONS ===== //
function initChart() {
  const ctx = document.getElementById('balanceChart').getContext('2d');
  balanceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Crew Balance ($)',
        data: [],
        borderColor: '#c0c0c0',
        borderWidth: 2,
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
        image: member.image || 'default.png'
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
  progressRing.style.background = `conic-gradient(
    #909090 ${appData.crewData.progress}%,
    rgba(144,144,144,0.1) 0
  )`;

  // Update Chart
  if (balanceChart) {
    balanceChart.data.labels = appData.chartData.map(item => item.date);
    balanceChart.data.datasets[0].data = appData.chartData.map(item => item.amount);
    balanceChart.update();
  }

  // Update Crew Members
  const membersContainer = document.querySelector('.crew-members-horizontal');
  if (membersContainer) {
    membersContainer.innerHTML = appData.crewMembers.map(member => {
      // Handle image paths
      let imagePath = member.image || 'default.png';
      
      // Remove any leading slashes or incorrect paths
      imagePath = imagePath.replace(/^\/|\.\//g, '');
      
      return `
        <div class="member-card">
          <img class="profile-img" 
               src="ProfilePics/${imagePath}" 
               onerror="this.onerror=null;this.src='ProfilePics/default.png'"
               alt="${member.name}">
            <div class="member-info">
            <div class="member-level">Level ${member.level}</div>
            <h3 class="member-name">${member.name}</h3>
            <div class="member-rank">${member.rank}</div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// ===== NAVIGATION ===== //
function toggleNav() {
  const nav = document.querySelector('.nav-dropdown');
  nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', (event) => {
  const nav = document.querySelector('.nav-dropdown');
  if (!event.target.closest('.nav-btn') && !event.target.closest('.nav-dropdown')) {
    nav.style.display = 'none';
  }
});
// ===== ADMIN PANEL FUNCTIONS ===== //
const ADMIN_PASSWORD = "crew123";

function showAdminLogin() {
    const currentLevel = document.querySelector('.level-display').textContent;
    const currentXP = document.querySelector('.xp-total').textContent
        .replace('Total XP: ', '')
        .replace(/,/g, '');
    
    const progressRing = document.querySelector('.progress-ring');
    const progressMatch = progressRing.style.background.match(/(\d+\.?\d*)%/);
    const currentProgress = progressMatch ? progressMatch[1] : '0';

    document.getElementById('adminLevelInput').value = currentLevel;
    document.getElementById('adminProgressInput').value = currentProgress;
    document.getElementById('adminXPInput').value = currentXP;

    document.getElementById('adminLoginModal').style.display = 'flex';
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'none';
    document.getElementById('loginError').textContent = '';
}

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

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target === document.getElementById('adminLoginModal')) {
        closeAdminLogin();
    }
    if (event.target === document.getElementById('adminPanel')) {
        closeAdminPanel();
    }
}

function addChartData() {
    const date = document.getElementById('chartDate').value;
    const amount = document.getElementById('chartAmount').value;

    if (!date || !amount) {
        alert('Please enter both date and amount');
        return;
    }

    if (!appData.chartData) appData.chartData = [];
    appData.chartData.push({
        date: date,
        amount: amount,
        addedAt: new Date().toISOString()
    });
    
    updateUI();
    saveData();
    alert("Data point added!");
    document.getElementById('chartDate').value = '';
    document.getElementById('chartAmount').value = '';
}

function addCrewMember() {
    const name = document.getElementById('newMemberName').value;
    const level = document.getElementById('newMemberLevel').value || 1;
    const rank = document.getElementById('newMemberRank').value || "Member";

    if (!name) {
        alert('Please enter at least a name');
        return;
    }

    if (!appData.crewMembers) appData.crewMembers = [];
    appData.crewMembers.push({
        name: name,
        level: level,
        rank: rank,
        image: "",
        joinedAt: new Date().toISOString()
    });
    
    updateUI();
    saveData();
    alert(`Added new crew member: ${name}`);
    document.getElementById('newMemberName').value = '';
    document.getElementById('newMemberLevel').value = '';
    document.getElementById('newMemberRank').value = '';
}

function resetData() {
    if (confirm('WARNING: This will reset all data. Continue?')) {
        appData = {
            crewData: {
                level: 1,
                progress: 0,
                xp: 0
            },
            chartData: [],
            crewMembers: []
        };
        updateUI();
        saveData();
        alert('All data has been reset');
    }
}

function updateCrewStats() {
    const level = document.getElementById('adminLevelInput').value;
    const progress = document.getElementById('adminProgressInput').value;
    const xp = document.getElementById('adminXPInput').value;

    if (!level || !progress || !xp) {
        alert('Please fill all fields');
        return;
    }

    appData.crewData = {
        level: level,
        progress: progress,
        xp: xp,
        updatedAt: new Date().toISOString()
    };
    
    updateUI();
    saveData();
    alert("Data saved!");
    closeAdminPanel();
}

// ===== INITIALIZE APP ===== //
document.addEventListener('DOMContentLoaded', () => {
  // Initialize chart
  const ctx = document.getElementById('balanceChart')?.getContext('2d');
  if (ctx) {
    window.chart = new Chart(ctx, {
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
  }
  
  loadData();
});
