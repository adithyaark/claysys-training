// UI
type Role = "Admin" | "User" | "Editor";

interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
}

// UserManager
class UserManager {
    private users: User[] = [];
    private nextId: number = 1;

    public addUser(name: string, email: string, role: Role): void {
        const newUser: User = {
            id: this.nextId++,
            name,
            email,
            role
        };
        this.users.push(newUser);
    }

    // Generic method
    public findUserByProperty<K extends keyof User>(property: K, value: User[K]): User | undefined {
        return this.users.find(user => user[property] === value);
    }

    // update roles
    public updateRole(id: number, newRole: Role): void {
        const user = this.findUserByProperty("id", id);
        if (user) {
            user.role = newRole;
        }
    }

    public deleteUser(id: number): void {
        this.users = this.users.filter(user => user.id !== id);
    }

    public getUsers(): User[] {
        return this.users;
    }
}

// Instance and UI Glue
const myManager = new UserManager();

function render(): void {
    const listElement = document.getElementById('userList') as HTMLDivElement;
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

(window as any).addNewUser = () => {
    const name = (document.getElementById('nameInput') as HTMLInputElement).value;
    const email = (document.getElementById('emailInput') as HTMLInputElement).value;
    const role = (document.getElementById('roleSelect') as HTMLSelectElement).value as Role;

    if (name && email) {
        myManager.addUser(name, email, role);
        render();
    }
};

(window as any).removeUser = (id: number) => {
    myManager.deleteUser(id);
    render();
};

(window as any).editRole = (id: number) => {
    const newRole = prompt("Enter new role (Admin, User, Editor):") as Role;
    const validRoles: Role[] = ["Admin", "User", "Editor"];
    if (validRoles.includes(newRole)) {
        myManager.updateRole(id, newRole);
        render();
    } else {
        alert("Invalid Role!");
    }
};