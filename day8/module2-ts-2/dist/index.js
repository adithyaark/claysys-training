"use strict";
// UserManager
class UserManager {
    constructor() {
        this.users = [];
        this.nextId = 1;
    }
    addUser(name, email, role) {
        const newUser = {
            id: this.nextId++,
            name,
            email,
            role
        };
        this.users.push(newUser);
    }
    // Generic method
    findUserByProperty(property, value) {
        return this.users.find(user => user[property] === value);
    }
    // update roles
    updateRole(id, newRole) {
        const user = this.findUserByProperty("id", id);
        if (user) {
            user.role = newRole;
        }
    }
    deleteUser(id) {
        this.users = this.users.filter(user => user.id !== id);
    }
    getUsers() {
        return this.users;
    }
}
// Instance and UI Glue
const myManager = new UserManager();
function render() {
    const listElement = document.getElementById('userList');
    listElement.innerHTML = '';
    myManager.getUsers().forEach(user => {
        const item = document.createElement('div');
        item.className = 'user-item';
        item.innerHTML = `
            <div class="user-info">
                <span>${user.id}. ${user.name}</span>
                <span>${user.email}</span>
                <span>${user.role}</span>
            </div>
            <div class="user-actions">
                <button class="btn-edit" onclick="editRole(${user.id})">Edit</button>
                <button class="btn-delete" onclick="removeUser(${user.id})">Delete</button>
            </div>
        `;
        listElement.appendChild(item);
    });
}
window.addNewUser = () => {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const role = document.getElementById('roleSelect').value;
    if (name && email) {
        myManager.addUser(name, email, role);
        render();
    }
};
window.removeUser = (id) => {
    myManager.deleteUser(id);
    render();
};
window.editRole = (id) => {
    const newRole = prompt("Enter new role (Admin, User, Editor):");
    const validRoles = ["Admin", "User", "Editor"];
    if (validRoles.includes(newRole)) {
        myManager.updateRole(id, newRole);
        render();
    }
    else {
        alert("Invalid Role!");
    }
};
