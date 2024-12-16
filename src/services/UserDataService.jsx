const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
  });
};

const hasAlarmParameter = (parameters) => {
  return parameters && parameters.some(param => param.alarm);
};

const filterPatients = (patients, searchTerm, filters) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return patients.filter(patient => {
      const alarmStatus = hasAlarmParameter(patient.parameters);
      const statusMatch = (alarmStatus && filters.showCritical) || 
                          (!alarmStatus && filters.showStable);
      const sexMatch = filters.sexFilter === 'all' || patient.sex === filters.sexFilter;
      let dateMatch = true;
      
      if (filters.dateFilterType === 'range') {
        const birthDate = new Date(patient.birthDate);
        if (filters.minDate) {
          const minDate = new Date(filters.minDate);
          dateMatch = dateMatch && birthDate >= minDate;
        }
        if (filters.maxDate) {
          const maxDate = new Date(filters.maxDate);
          dateMatch = dateMatch && birthDate <= maxDate;
        }
      }
      
      return statusMatch && sexMatch && dateMatch;
    });
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const searchWords = normalizedSearch.split(/\s+/);

  return patients.filter(patient => {
    const fullName = `${patient.familyName} ${patient.givenName}`.toLowerCase();
    const reversedFullName = `${patient.givenName} ${patient.familyName}`.toLowerCase();
    
    const nameMatches = searchWords.every(word => 
      fullName.includes(word) || 
      reversedFullName.includes(word) ||
      patient.familyName.toLowerCase().includes(word) || 
      patient.givenName.toLowerCase().includes(word)
    );

    const alarmStatus = hasAlarmParameter(patient.parameters);
    const statusMatch = (alarmStatus && filters.showCritical) || 
                        (!alarmStatus && filters.showStable);
    const sexMatch = filters.sexFilter === 'all' || patient.sex === filters.sexFilter;
    
    let dateMatch = true;
    if (filters.dateFilterType === 'range') {
      const birthDate = new Date(patient.birthDate);
      if (filters.minDate) {
        const minDate = new Date(filters.minDate);
        dateMatch = dateMatch && birthDate >= minDate;
      }
      if (filters.maxDate) {
        const maxDate = new Date(filters.maxDate);
        dateMatch = dateMatch && birthDate <= maxDate;
      }
    }

    return nameMatches && statusMatch && sexMatch && dateMatch;
  });
};

export { formatDate, hasAlarmParameter, filterPatients };