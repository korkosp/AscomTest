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
  return patients.filter(patient => {
      const nameMatch = patient.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        patient.givenName.toLowerCase().includes(searchTerm.toLowerCase());
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
      return nameMatch && statusMatch && sexMatch && dateMatch;
  });
};

export { formatDate, hasAlarmParameter, filterPatients };