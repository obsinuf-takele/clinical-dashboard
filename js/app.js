// Main Application Controller
class ClinicalApp {
    constructor() {
        this.userManager = new UserManager();
        this.patientManager = new PatientManager();
        this.ui = null;
        this.init();
    }

    init() {
        const currentUser = this.userManager.getCurrentUser();
        if (currentUser) {
            this.ui = new ClinicalUI(this.userManager, this.patientManager);
            this.showDashboard();
        }
        
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });
        
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
        
        // Setup edit form submissions
        this.setupEditForms();
    }
    
    setupEditForms() {
        // Edit Doctor Form Submit
        const editDoctorForm = document.getElementById('editDoctorForm');
        if (editDoctorForm) {
            editDoctorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = parseInt(document.getElementById('editDoctorId').value);
                const updatedData = {
                    name: document.getElementById('editDoctorName').value,
                    username: document.getElementById('editDoctorUsername').value,
                    email: document.getElementById('editDoctorEmail').value,
                    specialization: document.getElementById('editDoctorSpecialization').value,
                    phone: document.getElementById('editDoctorPhone').value,
                    status: document.getElementById('editDoctorStatus').value,
                    avatar: document.getElementById('editDoctorAvatar').value
                };
                
                if (this.userManager.updateDoctor(id, updatedData)) {
                    alert('✅ Doctor updated successfully!');
                    window.closeEditDoctorModal();
                    this.ui.updateContent('doctors');
                } else {
                    alert('❌ Failed to update doctor');
                }
            });
        }
        
        // Edit Patient Form Submit
        const editPatientForm = document.getElementById('editPatientForm');
        if (editPatientForm) {
            editPatientForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = parseInt(document.getElementById('editPatientId').value);
                const updatedData = {
                    name: document.getElementById('editPatientName').value,
                    age: parseInt(document.getElementById('editPatientAge').value),
                    gender: document.getElementById('editPatientGender').value,
                    bloodType: document.getElementById('editPatientBloodType').value,
                    condition: document.getElementById('editPatientCondition').value,
                    status: document.getElementById('editPatientStatus').value,
                    phone: document.getElementById('editPatientPhone').value,
                    email: document.getElementById('editPatientEmail').value,
                    address: document.getElementById('editPatientAddress').value,
                    nextAppointment: document.getElementById('editPatientNextAppointment').value,
                    appointmentTime: document.getElementById('editPatientAppointmentTime').value
                };
                
                if (this.patientManager.updatePatient(id, updatedData)) {
                    alert('✅ Patient updated successfully!');
                    window.closeEditPatientModal();
                    if (this.ui.currentUser.role === 'admin') {
                        this.ui.updateContent('patients');
                    } else {
                        this.ui.updateContent('my-patients');
                    }
                } else {
                    alert('❌ Failed to update patient');
                }
            });
        }
    }
    
    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (this.userManager.authenticate(username, password)) {
            this.ui = new ClinicalUI(this.userManager, this.patientManager);
            this.showDashboard();
        } else {
            const errorDiv = document.getElementById('loginError');
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    }
    
    handleLogout() {
        this.userManager.logout();
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('dashboardContainer').style.display = 'none';
    }
    
    showDashboard() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboardContainer').style.display = 'block';
        this.ui.updateUserProfile();
        this.ui.updateNavigation();
        this.ui.updateContent('dashboard');
    }
}

// Global functions for modal handling and search
window.viewDoctor = function(id) {
    const app = window.clinicalApp;
    const doctor = app.userManager.users.find(u => u.id === id);
    if (doctor) {
        const detailsDiv = document.getElementById('doctorDetails');
        detailsDiv.innerHTML = `
            <p><strong><i class="fas fa-user-md"></i> Name:</strong> ${doctor.name}</p>
            <p><strong><i class="fas fa-user-circle"></i> Username:</strong> ${doctor.username}</p>
            <p><strong><i class="fas fa-envelope"></i> Email:</strong> ${doctor.email}</p>
            <p><strong><i class="fas fa-stethoscope"></i> Specialization:</strong> ${doctor.specialization}</p>
            <p><strong><i class="fas fa-phone"></i> Phone:</strong> ${doctor.phone}</p>
            <p><strong><i class="fas fa-flag-checkered"></i> Status:</strong> ${doctor.status}</p>
            <p><strong><i class="fas fa-calendar"></i> Joined:</strong> ${new Date(doctor.createdAt).toLocaleDateString()}</p>
        `;
        document.getElementById('doctorModal').style.display = 'flex';
    }
};

window.openEditDoctorModal = function(id) {
    const app = window.clinicalApp;
    const doctor = app.userManager.users.find(u => u.id === id);
    if (doctor) {
        document.getElementById('editDoctorId').value = doctor.id;
        document.getElementById('editDoctorName').value = doctor.name;
        document.getElementById('editDoctorUsername').value = doctor.username;
        document.getElementById('editDoctorEmail').value = doctor.email;
        document.getElementById('editDoctorSpecialization').value = doctor.specialization;
        document.getElementById('editDoctorPhone').value = doctor.phone;
        document.getElementById('editDoctorStatus').value = doctor.status;
        document.getElementById('editDoctorAvatar').value = doctor.avatar;
        document.getElementById('editDoctorModal').style.display = 'flex';
    }
};

window.closeEditDoctorModal = function() {
    document.getElementById('editDoctorModal').style.display = 'none';
};

window.openEditPatientModal = function(id) {
    const app = window.clinicalApp;
    const patient = app.patientManager.getPatient(id);
    if (patient) {
        document.getElementById('editPatientId').value = patient.id;
        document.getElementById('editPatientName').value = patient.name;
        document.getElementById('editPatientAge').value = patient.age;
        document.getElementById('editPatientGender').value = patient.gender;
        document.getElementById('editPatientBloodType').value = patient.bloodType;
        document.getElementById('editPatientCondition').value = patient.condition;
        document.getElementById('editPatientStatus').value = patient.status;
        document.getElementById('editPatientPhone').value = patient.phone;
        document.getElementById('editPatientEmail').value = patient.email;
        document.getElementById('editPatientAddress').value = patient.address || '';
        document.getElementById('editPatientNextAppointment').value = patient.nextAppointment || '';
        document.getElementById('editPatientAppointmentTime').value = patient.appointmentTime || '';
        document.getElementById('editPatientModal').style.display = 'flex';
    }
};

window.closeEditPatientModal = function() {
    document.getElementById('editPatientModal').style.display = 'none';
};

window.deleteDoctor = function(id) {
    if (confirm('⚠️ Are you sure you want to delete this doctor? This action cannot be undone.')) {
        const app = window.clinicalApp;
        app.userManager.deleteDoctor(id);
        app.ui.updateContent('doctors');
        alert('✅ Doctor deleted successfully!');
    }
};

window.viewPatient = function(id) {
    const app = window.clinicalApp;
    const patient = app.patientManager.getPatient(id);
    if (patient) {
        const detailsDiv = document.getElementById('patientDetails');
        const doctor = app.userManager.users.find(u => u.username === patient.assignedDoctor);
        detailsDiv.innerHTML = `
            <p><strong><i class="fas fa-user-injured"></i> Name:</strong> ${patient.name}</p>
            <p><strong><i class="fas fa-birthday-cake"></i> Age:</strong> ${patient.age}</p>
            <p><strong><i class="fas fa-venus-mars"></i> Gender:</strong> ${patient.gender}</p>
            <p><strong><i class="fas fa-tint"></i> Blood Type:</strong> ${patient.bloodType}</p>
            <p><strong><i class="fas fa-heartbeat"></i> Medical Condition:</strong> ${patient.condition}</p>
            <p><strong><i class="fas fa-flag-checkered"></i> Status:</strong> ${patient.status}</p>
            <p><strong><i class="fas fa-phone"></i> Phone:</strong> ${patient.phone}</p>
            <p><strong><i class="fas fa-envelope"></i> Email:</strong> ${patient.email}</p>
            <p><strong><i class="fas fa-home"></i> Address:</strong> ${patient.address || 'Not provided'}</p>
            <p><strong><i class="fas fa-user-md"></i> Assigned Doctor:</strong> ${doctor ? doctor.name : patient.assignedDoctor}</p>
            <p><strong><i class="fas fa-calendar-check"></i> Last Visit:</strong> ${patient.lastVisit}</p>
            <p><strong><i class="fas fa-calendar-plus"></i> Next Appointment:</strong> ${patient.nextAppointment || 'Not scheduled'} ${patient.appointmentTime ? `at ${patient.appointmentTime}` : ''}</p>
        `;
        document.getElementById('patientModal').style.display = 'flex';
    }
};

window.deletePatient = function(id) {
    if (confirm('⚠️ Are you sure you want to delete this patient record?')) {
        const app = window.clinicalApp;
        app.patientManager.deletePatient(id);
        if (app.ui.currentUser.role === 'admin') {
            app.ui.updateContent('patients');
        } else {
            app.ui.updateContent('my-patients');
        }
        alert('✅ Patient deleted successfully!');
    }
};

window.closeDoctorModal = function() {
    document.getElementById('doctorModal').style.display = 'none';
};

window.closePatientModal = function() {
    document.getElementById('patientModal').style.display = 'none';
};

window.navigateToAppointments = function() {
    const app = window.clinicalApp;
    if (app.ui) {
        app.ui.updateContent('appointments');
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        const appointmentsNav = Array.from(document.querySelectorAll('.nav-item')).find(n => n.dataset.page === 'appointments');
        if (appointmentsNav) appointmentsNav.classList.add('active');
    }
};

window.filterDoctors = function() {
    const input = document.getElementById('doctorSearch');
    if (!input) return;
    const filter = input.value.toLowerCase();
    const table = document.getElementById('doctorsTable');
    if (!table) return;
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;
        for (let j = 0; j < cells.length - 1; j++) {
            const text = cells[j].textContent.toLowerCase();
            if (text.indexOf(filter) > -1) {
                found = true;
                break;
            }
        }
        rows[i].style.display = found ? '' : 'none';
    }
};

window.filterPatients = function() {
    const input = document.getElementById('patientSearch');
    if (!input) return;
    const filter = input.value.toLowerCase();
    const table = document.getElementById('patientsTable');
    if (!table) return;
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;
        for (let j = 0; j < cells.length - 1; j++) {
            const text = cells[j].textContent.toLowerCase();
            if (text.indexOf(filter) > -1) {
                found = true;
                break;
            }
        }
        rows[i].style.display = found ? '' : 'none';
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.clinicalApp = new ClinicalApp();
});