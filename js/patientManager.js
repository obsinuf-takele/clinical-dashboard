// Patient Data Management
class PatientManager {
    constructor() {
        this.patients = this.loadPatients();
        this.nextId = this.getNextId();
    }

    loadPatients() {
        const saved = localStorage.getItem('clinical_patients');
        if (saved) {
            return JSON.parse(saved);
        }
        return [
            {
                id: 1,
                name: "John Doe",
                age: 45,
                gender: "Male",
                bloodType: "A+",
                condition: "Hypertension",
                status: "active",
                phone: "+1 234-567-8901",
                email: "john.doe@email.com",
                address: "123 Main St, Boston, MA",
                lastVisit: "2024-01-15",
                nextAppointment: "2024-02-15",
                appointmentTime: "10:30 AM",
                assignedDoctor: "dr.smith"
            },
            {
                id: 2,
                name: "Emily Smith",
                age: 32,
                gender: "Female",
                bloodType: "O-",
                condition: "Diabetes Type 2",
                status: "active",
                phone: "+1 234-567-8902",
                email: "emily.smith@email.com",
                address: "456 Oak Ave, New York, NY",
                lastVisit: "2024-01-10",
                nextAppointment: "2024-02-10",
                appointmentTime: "02:00 PM",
                assignedDoctor: "dr.johnson"
            },
            {
                id: 3,
                name: "Robert Brown",
                age: 68,
                gender: "Male",
                bloodType: "B+",
                condition: "Arthritis",
                status: "critical",
                phone: "+1 234-567-8903",
                email: "robert.brown@email.com",
                address: "789 Pine St, Chicago, IL",
                lastVisit: "2024-01-05",
                nextAppointment: "2024-01-25",
                appointmentTime: "09:00 AM",
                assignedDoctor: "dr.smith"
            },
            {
                id: 4,
                name: "Lisa Anderson",
                age: 28,
                gender: "Female",
                bloodType: "AB+",
                condition: "Migraine",
                status: "active",
                phone: "+1 234-567-8904",
                email: "lisa.anderson@email.com",
                address: "321 Elm St, Seattle, WA",
                lastVisit: "2024-01-12",
                nextAppointment: "2024-02-12",
                appointmentTime: "11:15 AM",
                assignedDoctor: "dr.smith"
            },
            {
                id: 5,
                name: "William Taylor",
                age: 52,
                gender: "Male",
                bloodType: "A-",
                condition: "Respiratory Issues",
                status: "critical",
                phone: "+1 234-567-8905",
                email: "william.taylor@email.com",
                address: "654 Maple Dr, Austin, TX",
                lastVisit: "2024-01-08",
                nextAppointment: "2024-01-28",
                appointmentTime: "03:30 PM",
                assignedDoctor: "dr.johnson"
            }
        ];
    }

    getNextId() {
        return this.patients.length > 0 ? Math.max(...this.patients.map(p => p.id)) + 1 : 1;
    }

    savePatients() {
        localStorage.setItem('clinical_patients', JSON.stringify(this.patients));
    }

    addPatient(patientData) {
        const newPatient = {
            id: this.nextId++,
            ...patientData,
            lastVisit: new Date().toISOString().split('T')[0]
        };
        this.patients.push(newPatient);
        this.savePatients();
        return newPatient;
    }

    updatePatient(id, updatedData) {
        const index = this.patients.findIndex(p => p.id === id);
        if (index !== -1) {
            this.patients[index] = { ...this.patients[index], ...updatedData };
            this.savePatients();
            return true;
        }
        return false;
    }

    deletePatient(id) {
        this.patients = this.patients.filter(p => p.id !== id);
        this.savePatients();
    }

    getPatient(id) {
        return this.patients.find(p => p.id === id);
    }

    getAllPatients() {
        return this.patients;
    }

    getPatientsByDoctor(doctorUsername) {
        return this.patients.filter(p => p.assignedDoctor === doctorUsername);
    }

    getUpcomingAppointments(doctorUsername = null) {
        const today = new Date().toISOString().split('T')[0];
        let patients = doctorUsername ? this.getPatientsByDoctor(doctorUsername) : this.patients;
        return patients.filter(p => p.nextAppointment && p.nextAppointment >= today)
            .sort((a, b) => new Date(a.nextAppointment) - new Date(b.nextAppointment));
    }

    getStats() {
        const total = this.patients.length;
        const active = this.patients.filter(p => p.status === 'active').length;
        const critical = this.patients.filter(p => p.status === 'critical').length;
        const avgAge = this.patients.reduce((sum, p) => sum + p.age, 0) / total;
        
        return { total, active, critical, avgAge: Math.round(avgAge) };
    }
}