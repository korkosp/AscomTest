const fetchPatients = async () => {
    try {
        const credentials = btoa('test:TestMePlease!');
        const response = await fetch('https://mobile.digistat.it/CandidateApi/Patient/GetList', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
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
  
  export { fetchPatients };