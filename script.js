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
// Save Chart Data
function addChartData() {
  const date = document.getElementById('chartDate').value;
  const amount = document.getElementById('chartAmount').value;

  firebase.database().ref('chartData').push({
    date: date,
    amount: amount
  }).then(() => alert("Data point added!"));
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

// Save Crew Level Data
function updateCrewStats() {
  const level = document.getElementById('adminLevelInput').value;
  const progress = document.getElementById('adminProgressInput').value;
  const xp = document.getElementById('adminXPInput').value;

  firebase.database().ref('crewData').set({
    level: level,
    progress: progress,
    xp: xp,
    updatedAt: new Date().toISOString()
  }).then(() => {
    alert("Data saved for all users!");
    closeAdminPanel();
  });
}

    // Update level display
    document.querySelector('.level-display').textContent = newLevel;

    // Update progress ring
    const progressRing = document.querySelector('.progress-ring');
    progressRing.style.background = `conic-gradient(
        #909090 ${newProgress}%,
        rgba(144,144,144,0.1) 0
    )`;

    // Update XP display (formatted with commas)
    document.querySelector('.xp-total').textContent = 
        `Total XP: ${parseInt(newXP).toLocaleString()}`;

    // Close admin panel and show success
    closeAdminPanel();
    alert('Crew stats updated successfully!');
}

// Load current values when opening admin panel
function showAdminLogin() {
    // Get current values
    const currentLevel = document.querySelector('.level-display').textContent;
    const currentXP = document.querySelector('.xp-total').textContent
        .replace('Total XP: ', '')
        .replace(/,/g, '');
    
    // Get current progress percentage
    const progressRing = document.querySelector('.progress-ring');
    const progressMatch = progressRing.style.background.match(/(\d+\.?\d*)%/);
    const currentProgress = progressMatch ? progressMatch[1] : '84.84';

    // Set values in admin form
    document.getElementById('adminLevelInput').value = currentLevel;
    document.getElementById('adminProgressInput').value = currentProgress;
    document.getElementById('adminXPInput').value = currentXP;

    // Show login modal
    document.getElementById('adminLoginModal').style.display = 'flex';
}

// Listen for Crew Level Changes
firebase.database().ref('crewData').on('value', (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  document.querySelector('.level-display').textContent = data.level;
  
  // Update progress ring
  const progressRing = document.querySelector('.progress-ring');
  progressRing.style.background = `conic-gradient(
    #909090 ${data.progress}%,
    rgba(144,144,144,0.1) 0
  )`;
  
  document.querySelector('.xp-total').textContent = `Total XP: ${parseInt(data.xp).toLocaleString()}`;
});

// Listen for Chart Updates
firebase.database().ref('chartData').on('value', (snapshot) => {
  const chartData = snapshot.val();
  if (!chartData) return;

  const labels = [];
  const amounts = [];
  
  Object.values(chartData).forEach(item => {
    labels.push(item.date);
    amounts.push(item.amount);
  });

  chart.data.labels = labels;
  chart.data.datasets[0].data = amounts;
  chart.update();
});

