// UI Renderer
class ClinicalUI {
    constructor(userManager, patientManager) {
        this.userManager = userManager;
        this.patientManager = patientManager;
        this.currentUser = userManager.getCurrentUser();
        this.currentPage = 'dashboard';
    }

    getNavigation() {
        if (this.currentUser.role === 'admin') {
            return [
                { page: 'dashboard', icon: '<i class="fas fa-chart-line"></i>', label: 'Dashboard' },
                { page: 'doctors', icon: '<i class="fas fa-user-md"></i>', label: 'Manage Doctors' },
                { page: 'add-doctor', icon: '<i class="fas fa-plus-circle"></i>', label: 'Add New Doctor' },
                { page: 'patients', icon: '<i class="fas fa-users"></i>', label: 'All Patients' },
                { page: 'add-patient', icon: '<i class="fas fa-user-plus"></i>', label: 'Add Patient' }
            ];
        } else {
            return [
                { page: 'dashboard', icon: '<i class="fas fa-chart-line"></i>', label: 'My Dashboard' },
                { page: 'my-patients', icon: '<i class="fas fa-users"></i>', label: 'My Patients' },
                { page: 'add-patient', icon: '<i class="fas fa-user-plus"></i>', label: 'Add Patient' },
                { page: 'appointments', icon: '<i class="fas fa-calendar-alt"></i>', label: 'Appointments' }
            ];
        }
    }

    renderAboutClinic() {
        return `
            <div class="about-clinic">
                <div class="clinic-header">
                    <div class="clinic-icon">
                        <i class="fas fa-hospital-user" style="font-size: 40px; color: white;"></i>
                    </div>
                    <div class="clinic-title">
                        <h3>About ClinicalHub</h3>
                        <p>Excellence in Healthcare Since 2010</p>
                    </div>
                </div>
                <p style="margin-bottom: 1rem; line-height: 1.6;">
                    ClinicalHub is a state-of-the-art healthcare facility committed to providing 
                    exceptional medical care with compassion and innovation. Our multidisciplinary 
                    team of specialists works together to ensure the best possible outcomes for 
                    our patients.
                </p>
                <div class="clinic-features">
                    <div class="feature-item">
                        <div class="feature-icon"><i class="fas fa-clock"></i></div>
                        <div class="feature-text">
                            <h4>24/7 Emergency Care</h4>
                            <p>Round-the-clock medical assistance</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon"><i class="fas fa-microscope"></i></div>
                        <div class="feature-text">
                            <h4>Advanced Technology</h4>
                            <p>Cutting-edge medical equipment</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon"><i class="fas fa-heartbeat"></i></div>
                        <div class="feature-text">
                            <h4>Specialized Care</h4>
                            <p>Expertise in multiple specialties</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon"><i class="fas fa-stethoscope"></i></div>
                        <div class="feature-text">
                            <h4>Experienced Doctors</h4>
                            <p>20+ specialist physicians</p>
                        </div>
                    </div>
                </div>
                <div class="clinic-stats">
                    <div class="clinic-stat">
                        <div class="clinic-stat-number">10+</div>
                        <div class="clinic-stat-label">Years of Excellence</div>
                    </div>
                    <div class="clinic-stat">
                        <div class="clinic-stat-number">5000+</div>
                        <div class="clinic-stat-label">Happy Patients</div>
                    </div>
                    <div class="clinic-stat">
                        <div class="clinic-stat-number">20+</div>
                        <div class="clinic-stat-label">Specialists</div>
                    </div>
                    <div class="clinic-stat">
                        <div class="clinic-stat-number">98%</div>
                        <div class="clinic-stat-label">Satisfaction Rate</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAppointmentsOnDashboard() {
        const appointments = this.patientManager.getUpcomingAppointments(
            this.currentUser.role === 'doctor' ? this.currentUser.username : null
        );
        const today = new Date().toISOString().split('T')[0];
        
        if (appointments.length === 0) {
            return `
                <div class="appointments-section">
                    <div class="section-header">
                        <h3><i class="fas fa-calendar-check"></i> Upcoming Appointments</h3>
                        <i class="fas fa-smile" style="font-size: 24px; color: var(--success-color);"></i>
                    </div>
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-calendar-alt" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 1rem; display: block;"></i>
                        <p>No upcoming appointments scheduled</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="appointments-section">
                <div class="section-header">
                    <h3><i class="fas fa-calendar-check"></i> Upcoming Appointments (${appointments.length})</h3>
                    <span style="background: var(--primary-color); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                        Next 30 Days
                    </span>
                </div>
                <div class="appointment-cards">
                    ${appointments.slice(0, 4).map(apt => {
                        const daysUntil = Math.ceil((new Date(apt.nextAppointment) - new Date(today)) / (1000 * 60 * 60 * 24));
                        return `
                            <div class="appointment-card ${apt.status === 'critical' ? 'critical' : ''}" onclick="window.viewPatient(${apt.id})">
                                <div class="appointment-header">
                                    <span class="patient-name"><i class="fas fa-user-injured"></i> ${apt.name}</span>
                                    <span class="appointment-date"><i class="far fa-calendar"></i> ${apt.nextAppointment}</span>
                                </div>
                                <div class="appointment-details">
                                    <span><i class="far fa-clock"></i> ${apt.appointmentTime || '10:00 AM'}</span>
                                    <span><i class="fas fa-stethoscope"></i> ${apt.condition}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                                    <span class="condition-badge">
                                        <i class="fas fa-${apt.status === 'critical' ? 'exclamation-triangle' : 'check-circle'}"></i>
                                        ${apt.status === 'critical' ? 'Urgent Care Needed' : 'Regular Checkup'}
                                    </span>
                                    ${daysUntil <= 3 ? '<span style="color: var(--danger-color); font-size: 12px;"><i class="fas fa-bell"></i> Soon</span>' : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                ${appointments.length > 4 ? `
                    <div style="text-align: center; margin-top: 1rem;">
                        <button class="btn-primary" onclick="window.navigateToAppointments()">
                            View All Appointments <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderStats() {
        if (this.currentUser.role === 'admin') {
            const doctorStats = this.userManager.getDoctorStats();
            const patientStats = this.patientManager.getStats();
            return `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-title"><i class="fas fa-user-md"></i> Total Doctors</div>
                        <div class="stat-value">${doctorStats.total}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title"><i class="fas fa-user-check"></i> Active Doctors</div>
                        <div class="stat-value">${doctorStats.active}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title"><i class="fas fa-users"></i> Total Patients</div>
                        <div class="stat-value">${patientStats.total}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title"><i class="fas fa-exclamation-triangle"></i> Critical Patients</div>
                        <div class="stat-value">${patientStats.critical}</div>
                    </div>
                </div>
            `;
        } else {
            const myPatients = this.patientManager.getPatientsByDoctor(this.currentUser.username);
            const activePatients = myPatients.filter(p => p.status === 'active').length;
            const criticalPatients = myPatients.filter(p => p.status === 'critical').length;
            const upcomingAppointments = this.patientManager.getUpcomingAppointments(this.currentUser.username).length;
            return `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-title"><i class="fas fa-users"></i> My Patients</div>
                        <div class="stat-value">${myPatients.length}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title"><i class="fas fa-check-circle"></i> Active Cases</div>
                        <div class="stat-value">${activePatients}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title"><i class="fas fa-exclamation-circle"></i> Critical Cases</div>
                        <div class="stat-value">${criticalPatients}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title"><i class="fas fa-calendar-week"></i> Upcoming</div>
                        <div class="stat-value">${upcomingAppointments}</div>
                    </div>
                </div>
            `;
        }
    }

    renderWelcomeBanner() {
        const hour = new Date().getHours();
        let greeting = "Good Morning";
        if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
        if (hour >= 17) greeting = "Good Evening";
        
        return `
            <div class="welcome-banner">
                <h2>${greeting}, ${this.currentUser.name}!</h2>
                <p><i class="fas fa-calendar-day"></i> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>Welcome to ClinicalHub Dashboard. ${this.currentUser.role === 'admin' ? 'Manage doctors and patients efficiently.' : 'Manage your patients and appointments seamlessly.'}</p>
            </div>
        `;
    }

    renderDoctorsTable() {
        const doctors = this.userManager.getAllDoctors();
        return `
            <div class="form-card">
                <h3><i class="fas fa-user-md"></i> Registered Doctors</h3>
                <input type="text" id="doctorSearch" class="search-box" placeholder="🔍 Search doctors..." onkeyup="window.filterDoctors()">
                <div class="table-container">
                    <table class="data-table" id="doctorsTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${doctors.map(doctor => `
                                <tr>
                                    <td>${doctor.id}</td>
                                    <td><i class="fas fa-user-md"></i> ${doctor.name}</td>
                                    <td>${doctor.specialization}</td>
                                    <td>${doctor.email}</td>
                                    <td>${doctor.phone}</td>
                                    <td><span class="status-badge status-${doctor.status}">${doctor.status}</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn-icon btn-view" onclick="window.viewDoctor(${doctor.id})"><i class="fas fa-eye"></i> View</button>
                                            <button class="btn-icon btn-edit" onclick="window.openEditDoctorModal(${doctor.id})"><i class="fas fa-edit"></i> Edit</button>
                                            <button class="btn-icon btn-delete" onclick="window.deleteDoctor(${doctor.id})"><i class="fas fa-trash"></i> Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderAddDoctorForm() {
        return `
            <div class="form-card">
                <h3><i class="fas fa-user-plus"></i> Add New Doctor</h3>
                <form id="addDoctorForm">
                    <div class="form-grid">
                        <div>
                            <label>Full Name *</label>
                            <input type="text" class="form-input" name="name" required placeholder="Dr. John Doe">
                        </div>
                        <div>
                            <label>Username *</label>
                            <input type="text" class="form-input" name="username" required placeholder="dr.johndoe">
                        </div>
                        <div>
                            <label>Password *</label>
                            <input type="password" class="form-input" name="password" required placeholder="••••••••">
                        </div>
                        <div>
                            <label>Email *</label>
                            <input type="email" class="form-input" name="email" required placeholder="doctor@clinical.com">
                        </div>
                        <div>
                            <label>Specialization *</label>
                            <input type="text" class="form-input" name="specialization" required placeholder="Cardiology">
                        </div>
                        <div>
                            <label>Phone Number *</label>
                            <input type="tel" class="form-input" name="phone" required placeholder="+1 234-567-8900">
                        </div>
                        <div>
                            <label>Avatar Icon</label>
                            <select class="form-input" name="avatar">
                                <option value="👨‍⚕️">👨‍⚕️ Male Doctor</option>
                                <option value="👩‍⚕️">👩‍⚕️ Female Doctor</option>
                                <option value="🩺">🩺 General</option>
                            </select>
                        </div>
                    </div>
                    <div style="margin-top: 20px;">
                        <button type="submit" class="btn-primary"><i class="fas fa-save"></i> Create Doctor Account</button>
                    </div>
                </form>
            </div>
        `;
    }

    renderPatientsTable(patients = null) {
        const patientsToShow = patients || this.patientManager.getAllPatients();
        if (patientsToShow.length === 0) {
            return '<div style="text-align: center; padding: 2rem;"><i class="fas fa-folder-open"></i> No patients found.</div>';
        }
        
        return `
            <div class="form-card">
                <h3><i class="fas fa-users"></i> ${this.currentUser.role === 'admin' ? 'All Patients' : 'My Patients'} (${patientsToShow.length})</h3>
                <input type="text" id="patientSearch" class="search-box" placeholder="🔍 Search patients..." onkeyup="window.filterPatients()">
                <div class="table-container">
                    <table class="patient-table" id="patientsTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Age/Gender</th>
                                <th>Blood Type</th>
                                <th>Condition</th>
                                <th>Status</th>
                                <th>Next Appointment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${patientsToShow.map(patient => `
                                <tr>
                                    <td>${patient.id}</td>
                                    <td><i class="fas fa-user-injured"></i> ${patient.name}</td>
                                    <td>${patient.age} / ${patient.gender}</td>
                                    <td><span style="font-weight: 700;">${patient.bloodType}</span></td>
                                    <td>${patient.condition}</td>
                                    <td><span class="status-badge status-${patient.status}">${patient.status}</span></td>
                                    <td><i class="far fa-calendar"></i> ${patient.nextAppointment || 'Not scheduled'}</td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn-icon btn-view" onclick="window.viewPatient(${patient.id})"><i class="fas fa-eye"></i> View</button>
                                            <button class="btn-icon btn-edit" onclick="window.openEditPatientModal(${patient.id})"><i class="fas fa-edit"></i> Edit</button>
                                            <button class="btn-icon btn-delete" onclick="window.deletePatient(${patient.id})"><i class="fas fa-trash"></i> Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderAddPatientForm() {
        const doctors = this.userManager.getAllDoctors();
        return `
            <div class="form-card">
                <h3><i class="fas fa-user-plus"></i> Add New Patient</h3>
                <form id="addPatientForm">
                    <div class="form-grid">
                        <div>
                            <label>Full Name *</label>
                            <input type="text" class="form-input" name="name" required>
                        </div>
                        <div>
                            <label>Age *</label>
                            <input type="number" class="form-input" name="age" required>
                        </div>
                        <div>
                            <label>Gender *</label>
                            <select class="form-input" name="gender" required>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label>Blood Type *</label>
                            <select class="form-input" name="bloodType" required>
                                <option value="">Select</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>
                        <div>
                            <label>Medical Condition *</label>
                            <input type="text" class="form-input" name="condition" required>
                        </div>
                        <div>
                            <label>Status *</label>
                            <select class="form-input" name="status" required>
                                <option value="active">Active</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label>Phone Number *</label>
                            <input type="tel" class="form-input" name="phone" required>
                        </div>
                        <div>
                            <label>Email *</label>
                            <input type="email" class="form-input" name="email" required>
                        </div>
                        <div>
                            <label>Address</label>
                            <input type="text" class="form-input" name="address">
                        </div>
                        <div>
                            <label>Assign Doctor *</label>
                            <select class="form-input" name="assignedDoctor" required>
                                <option value="">Select Doctor</option>
                                ${doctors.map(doctor => `
                                    <option value="${doctor.username}">${doctor.name} (${doctor.specialization})</option>
                                `).join('')}
                            </select>
                        </div>
                        <div>
                            <label>Next Appointment</label>
                            <input type="date" class="form-input" name="nextAppointment">
                        </div>
                        <div>
                            <label>Appointment Time</label>
                            <input type="time" class="form-input" name="appointmentTime">
                        </div>
                    </div>
                    <div style="margin-top: 20px;">
                        <button type="submit" class="btn-primary"><i class="fas fa-save"></i> Add Patient</button>
                    </div>
                </form>
            </div>
        `;
    }

    renderMyPatients() {
        const myPatients = this.patientManager.getPatientsByDoctor(this.currentUser.username);
        return this.renderPatientsTable(myPatients);
    }

    renderAppointments() {
        const appointments = this.patientManager.getUpcomingAppointments(this.currentUser.username);
        return `
            <div class="form-card">
                <h3><i class="fas fa-calendar-alt"></i> All Appointments</h3>
                ${appointments.length === 0 ? 
                    '<div style="text-align: center; padding: 2rem;"><i class="fas fa-calendar-times"></i> No appointments scheduled</div>' : 
                    this.renderPatientsTable(appointments)
                }
            </div>
        `;
    }

    renderDashboard() {
        return `
            ${this.renderWelcomeBanner()}
            ${this.renderStats()}
            ${this.renderAboutClinic()}
            ${this.renderAppointmentsOnDashboard()}
        `;
    }

    renderPage(page) {
        switch(page) {
            case 'dashboard':
                return this.renderDashboard();
            case 'doctors':
                return this.renderDoctorsTable();
            case 'add-doctor':
                return this.renderAddDoctorForm();
            case 'patients':
                return this.renderPatientsTable();
            case 'my-patients':
                return this.renderMyPatients();
            case 'add-patient':
                return this.renderAddPatientForm();
            case 'appointments':
                return this.renderAppointments();
            default:
                return this.renderDashboard();
        }
    }

    updateContent(page) {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = this.renderPage(page);
        this.currentPage = page;
        
        const pageTitles = {
            'dashboard': 'Dashboard',
            'doctors': 'Manage Doctors',
            'add-doctor': 'Add New Doctor',
            'patients': 'All Patients',
            'my-patients': 'My Patients',
            'add-patient': 'Add New Patient',
            'appointments': 'Appointments Schedule'
        };
        document.getElementById('pageTitle').innerHTML = `<i class="fas fa-${page === 'dashboard' ? 'home' : page === 'doctors' ? 'user-md' : page === 'add-doctor' ? 'plus-circle' : page === 'patients' ? 'users' : page === 'my-patients' ? 'users' : page === 'add-patient' ? 'user-plus' : 'calendar'}"></i> ${pageTitles[page] || 'Dashboard'}`;
        
        if (page === 'add-doctor') {
            const form = document.getElementById('addDoctorForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    const doctorData = Object.fromEntries(formData.entries());
                    this.userManager.addDoctor(doctorData);
                    alert('✅ Doctor account created successfully!');
                    form.reset();
                    this.updateContent('doctors');
                    this.updateNavigation();
                });
            }
        }
        
        if (page === 'add-patient') {
            const form = document.getElementById('addPatientForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    const patientData = Object.fromEntries(formData.entries());
                    if (this.currentUser.role === 'doctor') {
                        patientData.assignedDoctor = this.currentUser.username;
                    }
                    this.patientManager.addPatient(patientData);
                    alert('✅ Patient added successfully!');
                    form.reset();
                    if (this.currentUser.role === 'admin') {
                        this.updateContent('patients');
                    } else {
                        this.updateContent('my-patients');
                    }
                    this.updateNavigation();
                });
            }
        }
    }

    updateNavigation() {
        const navMenu = document.getElementById('navMenu');
        const navigation = this.getNavigation();
        navMenu.innerHTML = navigation.map(item => `
            <li class="nav-item ${this.currentPage === item.page ? 'active' : ''}" data-page="${item.page}">
                ${item.icon} <span>${item.label}</span>
            </li>
        `).join('');
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.updateContent(page);
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    updateUserProfile() {
        document.getElementById('userName').innerText = this.currentUser.name;
        document.getElementById('userAvatar').innerHTML = this.currentUser.avatar || (this.currentUser.role === 'admin' ? '👑' : '👨‍⚕️');
        const badge = document.getElementById('userRoleBadge');
        badge.innerHTML = `<i class="fas fa-${this.currentUser.role === 'admin' ? 'crown' : 'stethoscope'}"></i> ${this.currentUser.role === 'admin' ? 'Administrator' : 'Doctor'}`;
        badge.className = `role-badge role-${this.currentUser.role}`;
    }
}