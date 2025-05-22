document.getElementById('nav-button').addEventListener('click', function() {
    document.querySelector('.dropdown-content').classList.toggle('show');
});

// Close dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('#nav-button')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Admin functionality
let adminLoggedIn = false;

document.getElementById('admin-login').addEventListener('click', function(e) {
    e.preventDefault();
    const password = prompt('Enter admin password:');
    // In production, use proper authentication and store password securely
    if (password === 'your_admin_password') { // Replace with actual password
        adminLoggedIn = true;
        document.getElementById('admin-panel').classList.remove('hidden');
    } else {
        alert('Incorrect password');
    }
});

function uploadData() {
    if (!adminLoggedIn) {
        alert('Admin access required');
        return;
    }
    
    const fileInput = document.getElementById('data-upload');
    const file = fileInput.files[0];
    
    if (file) {
        // Handle file upload here
        const reader = new FileReader();
        reader.onload = function(e) {
            // Process the data
            console.log('Data imported:', e.target.result);
            alert('Data imported successfully');
        };
        reader.readAsText(file);
    }
}

// Add to script.js
document.querySelector('.home-link').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Add temporary click effect
    document.getElementById('site-title').style.transform = 'scale(0.95)';
    setTimeout(() => {
        document.getElementById('site-title').style.transform = 'scale(1)';
    }, 200);
});
