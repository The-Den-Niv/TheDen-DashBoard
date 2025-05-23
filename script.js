// ===== FIREBASE INITIALIZATION ===== //
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC56lEYzlg-f86opfRP1HAKZbthyZ43YFM",
  authDomain: "theden-dashboard.firebaseapp.com",
  databaseURL: "https://theden-dashboard-default-rtdb.firebaseio.com",
  projectId: "theden-dashboard",
  storageBucket: "theden-dashboard.firebasestorage.app",
  messagingSenderId: "1013512631696",
  appId: "1:1013512631696:web:843369462b1830cdb5af15",
  measurementId: "G-KTZL0HJ132"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// ===== END FIREBASE INIT ===== //

// Then continue with your existing chart code...
const ctx = document.getElementById('balanceChart').getContext('2d');

// ===== ENHANCED DATA LOADING ===== //
// Load initial data when page starts
document.addEventListener('DOMContentLoaded', function() {
    // 1. Load Crew Level (XP, Progress, etc.)
    firebase.database().ref('crewData').once('value').then(snapshot => {
        const data = snapshot.val();
        if (data) {
            document.querySelector('.level-display').textContent = data.level;
            const progressRing = document.querySelector('.progress-ring');
            progressRing.style.background = `conic-gradient(
                #909090 ${data.progress}%,
                rgba(144,144,144,0.1) 0
            )`;
            document.querySelector('.xp-total').textContent = 
                `Total XP: ${parseInt(data.xp).toLocaleString()}`;
        }
    });

    // 2. Load Chart Data
    firebase.database().ref('chartData').once('value').then(snapshot => {
        const chartData = snapshot.val();
        if (chartData) {
            const labels = [];
            const amounts = [];
            Object.values(chartData).forEach(item => {
                labels.push(item.date);
                amounts.push(item.amount);
            });
            chart.data.labels = labels;
            chart.data.datasets[0].data = amounts;
            chart.update();
        }
    });

    // 3. Load Crew Members
    firebase.database().ref('crewMembers').once('value').then(snapshot => {
        const members = snapshot.val();
        const container = document.querySelector('.crew-members-horizontal');
        if (members) {
            container.innerHTML = '';
            Object.values(members).forEach(member => {
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
                container.appendChild(memberCard);
            });
        }
    });
});
// ===== END ENHANCED DATA LOADING ===== //

// Initialize the balance chart
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

// Navigation dropdown functionality
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

// Admin Panel functionality
const ADMIN_PASSWORD = "crew123"; // Change this in production

// Show admin login modal
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
        // Sign in anonymously to get write access
        firebase.auth().signInAnonymously()
            .then(() => {
                closeAdminLogin();
                document.getElementById('adminPanel').style.display = 'flex';
            })
            .catch(error => {
                errorElement.textContent = 'Login failed: ' + error.message;
            });
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

// Admin Panel Functions
function addChartData() {
    const date = document.getElementById('chartDate').value;
    const amount = document.getElementById('chartAmount').value;

    if (!date || !amount) {
        alert('Please enter both date and amount');
        return;
    }

    firebase.database().ref('chartData').push({
        date: date,
        amount: amount,
        addedAt: new Date().toISOString()
    }).then(() => {
        alert("Data point added!");
        // Clear inputs
        document.getElementById('chartDate').value = '';
        document.getElementById('chartAmount').value = '';
    }).catch(error => {
        alert("Error adding data: " + error.message);
    });
}

function addCrewMember() {
    const name = document.getElementById('newMemberName').value;
    const level = document.getElementById('newMemberLevel').value || 1;
    const rank = document.getElementById('newMemberRank').value || "Member";

    if (!name) {
        alert('Please enter at least a name');
        return;
    }

    firebase.database().ref('crewMembers').push({
        name: name,
        level: level,
        rank: rank,
        image: "assets/images/default.png", // Default image
        joinedAt: new Date().toISOString()
    }).then(() => {
        alert(`Added new crew member: ${name}`);
        // Clear inputs
        document.getElementById('newMemberName').value = '';
        document.getElementById('newMemberLevel').value = '';
        document.getElementById('newMemberRank').value = '';
    }).catch(error => {
        alert("Error adding member: " + error.message);
    });
}

function resetData() {
    if (confirm('WARNING: This will reset all data. Continue?')) {
        firebase.database().ref().remove()
            .then(() => alert('All data has been reset'))
            .catch(error => alert('Error resetting data: ' + error));
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

    firebase.database().ref('crewData').set({
        level: level,
        progress: progress,
        xp: xp,
        updatedAt: new Date().toISOString()
    }).then(() => {
        alert("Data saved for all users!");
        closeAdminPanel();
    }).catch(error => {
        alert("Error saving data: " + error.message);
    });
}

// Listen for real-time updates
firebase.database().ref('crewData').on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    document.querySelector('.level-display').textContent = data.level;
    
    const progressRing = document.querySelector('.progress-ring');
    progressRing.style.background = `conic-gradient(
        #909090 ${data.progress}%,
        rgba(144,144,144,0.1) 0
    )`;
    
    document.querySelector('.xp-total').textContent = `Total XP: ${parseInt(data.xp).toLocaleString()}`;
});

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

// Load initial crew members
firebase.database().ref('crewMembers').on('value', (snapshot) => {
    const members = snapshot.val();
    if (!members) return;

    const membersContainer = document.querySelector('.crew-members-horizontal');
    membersContainer.innerHTML = '';

    Object.values(members).forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        memberCard.innerHTML = `
            <div class="profile-img"></div>
            <div class="member-info">
                <div class="member-level">Level ${member.level}</div>
                <h3 class="member-name">${member.name}</h3>
                <div class="member-rank">${member.rank}</div>
            </div>
        `;
        membersContainer.appendChild(memberCard);
    });
});
