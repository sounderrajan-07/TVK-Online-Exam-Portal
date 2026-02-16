// LocalStorage Keys: 'users', 'currentUser', 'adminLoggedIn'

const Auth = {
    // Register Student
    register: (name, email, password) => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(u => u.email === email)) return { success: false, msg: "Email already exists!" };
        
        users.push({ id: Date.now(), name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        return { success: true };
    },

    // Student Login
    login: (email, password) => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    },

    // Admin Login (Hardcoded)
    adminLogin: (user, pass) => {
        if (user === "admin@gmail.com" && pass === "123") {
            localStorage.setItem('adminLoggedIn', 'true');
            return true;
        }
        return false;
    },

    logout: () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'index.html';
    }
};