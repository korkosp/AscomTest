import React, { useState, useEffect } from 'react';
import { fetchPatients } from '../services/apiService.jsx';
import { formatDate, hasAlarmParameter, filterPatients } from '../services/UserDataService.jsx';
import SortButton from './SortButton.jsx';
import PatientTableCell from './PatientTableCell.jsx';
import FilterMenu from './FilterMenu.jsx';
import PatientDetail from './PatientDetail.jsx';
import '../styles/Grid.css';

function PatientGrid() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        showStable: true,
        showCritical: true,
        sexFilter: 'all'
    });
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        const loadPatients = async () => {
            try {
                const data = await fetchPatients();
                setPatients(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadPatients();
    }, []);

    const handleSort = (field) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(direction);
        setSortField(field);

        setPatients((prev) => [...prev].sort((a, b) => {
            const [valA, valB] = [a[field], b[field]];
            return direction === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        }));
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilters({
            showStable: true,
            showCritical: true,
            sexFilter: 'all'
        });
    };

    const handlePatientUpdate = async (updatedPatient) => {
        try {
            const updatedData = await fetchPatients();
            setPatients(updatedData);
            setSelectedPatient(null);
        } catch (err) {
            console.error('refresh errot:', err);
        }
    };

    const renderSortButton = (field, label) => (
        <SortButton
            onClick={() => handleSort(field)}
            active={sortField === field}
            sortDirection={sortField === field ? sortDirection : null}
        >
            {label}
        </SortButton>
    );

    const filteredPatients = filterPatients(patients, searchTerm, filters);

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Caricamento pazienti...</p>
        </div>
    );

    if (error) return <div className="error-container">Errore: {error}</div>;

    return (
        <div className="patient-tracker-container">
            <div className="table-header">
                <h1>Elenco Pazienti</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Cerca pazienti..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FilterMenu
                        onFilterChange={handleFilterChange}
                        onResetFilters={handleResetFilters}
                    />
                </div>
            </div>

            <div className="table-wrapper">
                <table className="patient-table">
                    <thead>
                        <tr>
                            <th>{renderSortButton('familyName', 'Cognome')}</th>
                            <th>{renderSortButton('givenName', 'Nome')}</th>
                            <th>{renderSortButton('sex', 'Sesso')}</th>
                            <th>{renderSortButton('birthDate', 'Data di nascita')}</th>
                            <th>{renderSortButton('parameters', 'Parametri')}</th>
                            <th>Stato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map((patient) => {
                            const patientHasAlarm = hasAlarmParameter(patient.parameters);
                            return (
                                <tr
                                    key={patient.id}
                                    className={patientHasAlarm ? 'patient-alarm' : ''}
                                    onClick={() => setSelectedPatient(patient)}
                                >
                                    <PatientTableCell hasAlarm={patientHasAlarm}>{patient.familyName}</PatientTableCell>
                                    <PatientTableCell hasAlarm={patientHasAlarm}>{patient.givenName}</PatientTableCell>
                                    <PatientTableCell hasAlarm={patientHasAlarm}>{patient.sex}</PatientTableCell>
                                    <PatientTableCell hasAlarm={patientHasAlarm}>{formatDate(patient.birthDate)}</PatientTableCell>
                                    <PatientTableCell hasAlarm={patientHasAlarm}>{patient.parameters ? patient.parameters.length : 0}</PatientTableCell>
                                    <PatientTableCell hasAlarm={patientHasAlarm}>
                                        {patientHasAlarm ? (
                                            <span className="status-critical">Parametri Critici</span>
                                        ) : (
                                            <span className="status status-stable">Parametri Stabili</span>
                                        )}
                                    </PatientTableCell>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="table-footer">
                <div className="pagination">
                    <span>Totale Pazienti: {filteredPatients.length}</span>
                </div>
            </div>

            {selectedPatient && (
                <PatientDetail 
                    patient={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                    onPatientUpdated={handlePatientUpdate}
                />
            )}
        </div>
    );
}

export default PatientGrid;