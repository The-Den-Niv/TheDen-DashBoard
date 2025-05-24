// ===== DATA MANAGEMENT ===== //
let appData = {};

// Load data from JSON file
async function loadData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Failed to load data');
    appData = await response.json();
    updateUI();
  } catch (error) {
    console.error('Error loading data:', error);
    alert('Failed to load data. Please check your data.json file.');
  }
}

// Save data to JSON file (simulated - would need server-side in real implementation)
async function saveData() {
  // In a real app, you would send this to a server endpoint
  console.log('Data would be saved here:', appData);
  alert('Note: In a real implementation, this would save to your server');
}

// ===== UI UPDATE FUNCTION ===== //
function updateUI() {
  if (!appData.crewData || !appData.chartData || !appData.crewMembers) {
    console.error('Incomplete data structure');
    return;
  }

  // Update Crew Stats
  const crewData = appData.crewData;
  document.querySelector('.level-display').textContent = crewData.level;
  const progressRing = document.querySelector('.progress-ring');
  progressRing.style.background = `conic-gradient(
      #909090 ${crewData.progress}%,
      rgba(144,144,144,0.1) 0
  )`;
  document.querySelector('.xp-total').textContent = 
      `Total XP: ${parseInt(crewData.xp).toLocaleString()}`;

  // Update Chart Data
  const labels = appData.chartData.map(item => item.date);
  const amounts = appData.chartData.map(item => item.amount);
  chart.data.labels = labels;
  chart.data.datasets[0].data = amounts;
  chart.update();

  // Update Crew Members
  const membersContainer = document.querySelector('.crew-members-horizontal');
  membersContainer.innerHTML = '';
  appData.crewMembers.forEach(member => {
      const memberCard = document.createElement('div');
      memberCard.className = 'member-card';
      memberCard.innerHTML = `
          <img class="profile-img" src="${member.image || 'assets/images/default.png'}" alt="${member.name}">
          <div class="member-info">
              <div class="member-level">Level ${member.level}</div>
              <h3 class="member-name">${member.name}</h3>
              <div class="member-rank">${member.rank}</div>
          </div>
      `;
      membersContainer.appendChild(memberCard);
  });
}

// ===== CHART INITIALIZATION ===== //
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

// ===== NAVIGATION FUNCTIONS ===== //
function toggleNav() {
    const nav = document.querySelector('.nav-dropdown');
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function(event) {
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
document.addEventListener('DOMContentLoaded', function() {
    loadData(); // Load data from data.json when page loads
});
