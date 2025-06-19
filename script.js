// Mock database
let users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" },
    { id: 3, name: "Carol Davis", email: "carol@example.com" }
];
let nextId = 4;

// Function to update input placeholders with current ID range
function updatePlaceholders() {
    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    const minId = users.length > 0 ? Math.min(...users.map(u => u.id)) : 0;
    const range = users.length > 0 ? `${minId}-${maxId}` : 'No users available';
    
    document.getElementById('getUserId').placeholder = `Enter user ID (${range})`;
    document.getElementById('updateUserId').placeholder = `Enter user ID (${range})`;
    document.getElementById('deleteUserId').placeholder = `Enter user ID (${range})`;
    
    // Update max attributes
    document.getElementById('getUserId').max = maxId;
    document.getElementById('updateUserId').max = maxId;
    document.getElementById('deleteUserId').max = maxId;
}

function displayResponse(status, method, endpoint, data, statusCode = 200) {
    const responseArea = document.getElementById('responseArea');
    const timestamp = new Date().toLocaleTimeString();
    const statusClass = statusCode < 300 ? 'status-success' : statusCode < 500 ? 'status-pending' : 'status-error';
    
    responseArea.innerHTML = `
<span class="status-indicator ${statusClass}"></span>${method} ${endpoint}
Status: ${statusCode} ${status}
Time: ${timestamp}

Response:
${JSON.stringify(data, null, 2)}

Request completed successfully! ✅
    `;
}

function getUsers() {
    updatePlaceholders();
    displayResponse('OK', 'GET', '/api/users', {
        success: true,
        data: users,
        count: users.length
    });
}

function getUserById() {
    const id = parseInt(document.getElementById('getUserId').value);
    if (!id) {
        displayResponse('Bad Request', 'GET', '/api/users/{id}', {
            success: false,
            error: 'User ID is required'
        }, 400);
        return;
    }

    const user = users.find(u => u.id === id);
    if (user) {
        displayResponse('OK', 'GET', `/api/users/${id}`, {
            success: true,
            data: user
        });
    } else {
        displayResponse('Not Found', 'GET', `/api/users/${id}`, {
            success: false,
            error: 'User not found'
        }, 404);
    }
}

function createUser() {
    const name = document.getElementById('newUserName').value.trim();
    const email = document.getElementById('newUserEmail').value.trim();
    
    if (!name || !email) {
        displayResponse('Bad Request', 'POST', '/api/users', {
            success: false,
            error: 'Name and email are required'
        }, 400);
        return;
    }

    const newUser = { id: nextId++, name, email };
    users.push(newUser);
    updatePlaceholders(); // Update placeholders after adding user
    
    displayResponse('Created', 'POST', '/api/users', {
        success: true,
        data: newUser,
        message: 'User created successfully'
    }, 201);
    
    document.getElementById('newUserName').value = '';
    document.getElementById('newUserEmail').value = '';
}

function updateUser() {
    const id = parseInt(document.getElementById('updateUserId').value);
    const name = document.getElementById('updateUserName').value.trim();
    
    if (!id || !name) {
        displayResponse('Bad Request', 'PUT', '/api/users/{id}', {
            success: false,
            error: 'User ID and name are required'
        }, 400);
        return;
    }

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        users[userIndex].name = name;
        displayResponse('OK', 'PUT', `/api/users/${id}`, {
            success: true,
            data: users[userIndex],
            message: 'User updated successfully'
        });
        document.getElementById('updateUserName').value = '';
    } else {
        displayResponse('Not Found', 'PUT', `/api/users/${id}`, {
            success: false,
            error: 'User not found'
        }, 404);
    }
}

function deleteUser() {
    const id = parseInt(document.getElementById('deleteUserId').value);
    
    if (!id) {
        displayResponse('Bad Request', 'DELETE', '/api/users/{id}', {
            success: false,
            error: 'User ID is required'
        }, 400);
        return;
    }

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1)[0];
        updatePlaceholders(); // Update placeholders after deleting user
        displayResponse('OK', 'DELETE', `/api/users/${id}`, {
            success: true,
            data: deletedUser,
            message: 'User deleted successfully'
        });
        document.getElementById('deleteUserId').value = '';
    } else {
        displayResponse('Not Found', 'DELETE', `/api/users/${id}`, {
            success: false,
            error: 'User not found'
        }, 404);
    }
}

// Add some nice animations on load
window.addEventListener('load', function() {
    // Add padding to body for fixed response area
    document.body.classList.add('has-fixed-response');
    
    // Initialize placeholders
    updatePlaceholders();
    
    const cards = document.querySelectorAll('.concept-card, .demo-section');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});