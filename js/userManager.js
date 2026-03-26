// User Management System
class UserManager {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = null;
    }

    loadUsers() {
        const saved = localStorage.getItem('clinical_users');
        if (saved) {
            return JSON.parse(saved);
        }
        return [
            {
                id: 1,
                username: "admin",
                password: "admin123",
                name: "Dr. Admin",
                email: "admin@clinical.com",
                role: "admin",
                specialization: "System Administrator",
                phone: "+1 234-567-8900",
                avatar: "👑",
                status: "active",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                username: "dr.smith",
                password: "doctor123",
                name: "Dr. Sarah Smith",
                email: "sarah.smith@clinical.com",
                role: "doctor",
                specialization: "Cardiology",
                phone: "+1 234-567-8901",
                avatar: "👩‍⚕️",
                status: "active",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                username: "dr.johnson",
                password: "doctor123",
                name: "Dr. Michael Johnson",
                email: "michael.johnson@clinical.com",
                role: "doctor",
                specialization: "Neurology",
                phone: "+1 234-567-8902",
                avatar: "👨‍⚕️",
                status: "active",
                createdAt: new Date().toISOString()
            }
        ];
    }

    saveUsers() {
        localStorage.setItem('clinical_users', JSON.stringify(this.users));
    }

    authenticate(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password && u.status === 'active');
        if (user) {
            this.currentUser = { ...user };
            delete this.currentUser.password;
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    }

    getCurrentUser() {
        if (this.currentUser) return this.currentUser;
        const saved = sessionStorage.getItem('currentUser');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            return this.currentUser;
        }
        return null;
    }

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('currentUser');
    }

    getAllDoctors() {
        return this.users.filter(u => u.role === 'doctor');
    }

    addDoctor(doctorData) {
        const newDoctor = {
            id: this.users.length + 1,
            ...doctorData,
            role: 'doctor',
            status: 'active',
            createdAt: new Date().toISOString()
        };
        this.users.push(newDoctor);
        this.saveUsers();
        return newDoctor;
    }

    updateDoctor(id, updatedData) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updatedData };
            this.saveUsers();
            return true;
        }
        return false;
    }

    deleteDoctor(id) {
        this.users = this.users.filter(u => u.id !== id);
        this.saveUsers();
    }

    getDoctorStats() {
        const doctors = this.getAllDoctors();
        const active = doctors.filter(d => d.status === 'active').length;
        return {
            total: doctors.length,
            active: active,
            inactive: doctors.length - active
        };
    }
}