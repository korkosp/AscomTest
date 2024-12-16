const BASE_URL = 'https://mobile.digistat.it/CandidateApi';
const CREDENTIALS = btoa('test:TestMePlease!');

const fetchPatients = async () => {
    try {
        const response = await fetch(`${BASE_URL}/Patient/GetList`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${CREDENTIALS}`,
                'Accept': 'application/json'
            }
        });
  
        if (!response.ok) {
            throw new Error('Bad response');
        }
  
        const data = await response.json();
        const uniquePatients = [];
        const seenIds = new Set();
  
        for (const patient of data) {
            if (!seenIds.has(patient.id)) {
                seenIds.add(patient.id);
                uniquePatients.push(patient);
            }
        }
  
        return uniquePatients;
    } catch (error) {
        console.error('Error fetching patients:', error.message);
        throw error;
    }
};

const fetchPatientDetails = async (patientId) => {
    try {
        // Use the existing patient data if possible
        const response = await fetch(`${BASE_URL}/Patient/GetList`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${CREDENTIALS}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching patient list');
        }

        const patients = await response.json();
        const patientDetails = patients.find(p => p.id === patientId);

        if (!patientDetails) {
            throw new Error('Patient not found');
        }

        return patientDetails;
    } catch (error) {
        console.error('Error fetching patient details:', error.message);
        throw error;
    }
};

const updatePatient = async (patientId, patientData) => {
    try {
        console.log('Updating patient - Full payload:', {
            id: patientId,
            ...patientData
        });

        const response = await fetch(`${BASE_URL}/Patient/Update`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${CREDENTIALS}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                id: patientId,
                ...patientData
            })
        });

        const responseText = await response.text();
        console.log('Raw Response Body:', responseText);

        // Check for non-successful response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
        }

        // Attempt to parse JSON, with detailed error handling
        try {
            // If response is empty or truly not JSON, this will throw an error
            const updatedPatient = responseText ? JSON.parse(responseText) : null;
            console.log('Parsed patient update:', updatedPatient);
            return updatedPatient || { message: 'Update successful' };
        } catch (parseError) {
            console.error('JSON Parsing Error:', parseError);
            console.error('Unparseable response:', responseText);
            
            // Throw a more informative error
            throw new Error(`Unable to parse JSON response: ${responseText}`);
        }
    } catch (error) {
        console.error('Complete update error:', error);
        throw error;
    }
};
export { fetchPatients, fetchPatientDetails, updatePatient };