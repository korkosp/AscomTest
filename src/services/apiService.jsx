const BASE_URL = 'https://mobile.digistat.it/CandidateApi';
const CREDENTIALS = btoa('test:TestMePlease!');

const fetchPatients = async () => {
    const response = await fetch(`${BASE_URL}/Patient/GetList`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${CREDENTIALS}`,
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status}`);
    }

    const data = await response.json();
    const uniquePatients = Array.from(new Map(data.map(p => [p.id, p])).values());
    return uniquePatients;
};

const fetchPatientDetails = async (patientId) => {
    const patients = await fetchPatients();
    const patient = patients.find(p => p.id === patientId);

    if (!patient) {
        throw new Error('Patient not found');
    }

    return patient;
};

const updatePatient = async (patientId, patientData) => {
    const response = await fetch(`${BASE_URL}/Patient/Update`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${CREDENTIALS}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ id: patientId, ...patientData }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Update failed: ${response.status} - ${errorBody}`);
    }

    const updatedPatient = await response.json().catch(() => null);
    return updatedPatient || { message: 'Update successful' };
};

export { fetchPatients, fetchPatientDetails, updatePatient };
