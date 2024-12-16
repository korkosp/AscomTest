import React, { useState, useEffect } from 'react';
import { formatDate } from '../services/UserDataService.jsx';
import { updatePatient, fetchPatientDetails } from '../services/apiService.jsx';
import '../styles/PatientDetailModal.css';

const PatientDetailModal = ({ patient, onClose, onPatientUpdated }) => {
    const [editMode, setEditMode] = useState(false);
    const [patientData, setPatientData] = useState({
        familyName: patient.familyName,
        givenName: patient.givenName,
        sex: patient.sex,
        birthDate : patient.birthDate
    });
    const [fullPatientDetails, setFullPatientDetails] = useState(patient);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPatientDetails = async () => {
            try {
                const details = await fetchPatientDetails(patient.id);
                setFullPatientDetails(details);
                setLoading(false);
            } catch (err) {
                console.error('Error in loadPatientDetails:', err);
                setFullPatientDetails(patient);
                setLoading(false);
            }
        };

        loadPatientDetails();
    }, [patient.id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const updatedPatient = await updatePatient(patient.id, patientData);
            onPatientUpdated(updatedPatient);
            onClose(); // Close the modal after successful update
        } catch (err) {
            console.error('Patient update error:', err);
            setError(`Errore durante il salvataggio: ${err.message}`);
        }
    };

    const handleModalClose = (e) => {
        // Check if the click is on the overlay
        if (e.target.classList.contains('patient-detail-modal')) {
            onClose();
        }
    };

    if (loading) return <div className="modal-loading">Caricamento...</div>;
    
    if (error) return (
        <div className="patient-detail-modal" onClick={handleModalClose}>
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <div className="modal-error">
                    <h2>Errore</h2>
                    <p>{error}</p>
                    <button className="filter-button" onClick={() => setError(null)}>Riprova</button>
                    <button className="filter-button" onClick={onClose}>Chiudi</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="patient-detail-modal" onClick={handleModalClose}>
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <div className="modal-header">
                    <h2>Dettagli Paziente</h2>
                    {!editMode ? (
                        <button className="filter-button edit-button" onClick={() => setEditMode(true)}>Modifica</button>
                    ) : null}
                </div>
                
                <div className="patient-info">
                    {!editMode ? (
                        <>
                            <p><strong>Cognome:</strong> {patientData.familyName}</p>
                            <p><strong>Nome:</strong> {patientData.givenName}</p>
                            <p><strong>Sesso:</strong> {patientData.sex}</p>
                            <p><strong>Data di nascita:</strong> {formatDate(patient.birthDate)}</p>
                        </>
                    ) : (
                        <div className="edit-form">
                            <label>
                                Cognome:
                                <input 
                                    type="text" 
                                    name="familyName" 
                                    value={patientData.familyName} 
                                    onChange={handleInputChange} 
                                />
                            </label>
                            <label>
                                Nome:
                                <input 
                                    type="text" 
                                    name="givenName" 
                                    value={patientData.givenName} 
                                    onChange={handleInputChange} 
                                />
                            </label>
                            <label>
                                Sesso:
                                <select 
                                    name="sex" 
                                    value={patientData.sex} 
                                    onChange={handleInputChange}
                                >
                                    <option value="M">Maschio</option>
                                    <option value="F">Femmina</option>
                                </select>
                            </label>
                            
                            <div className="modal-actions">
                                <button className="filter-button" onClick={handleSave}>Salva</button>
                                <button className="filter-button" onClick={() => setEditMode(false)}>Annulla</button>
                            </div>
                        </div>
                    )}
                </div>

                {!editMode && (
                    <div className="patient-parameters">
                        <h3>Parametri</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Valore</th>
                                    <th>Allarme</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fullPatientDetails.parameters && fullPatientDetails.parameters.map(param => (
                                    <tr 
                                        key={param.id} 
                                        className={param.alarm ? 'parameter-alarm' : ''}
                                    >
                                        <td>{param.name}</td>
                                        <td>{param.value}</td>
                                        <td>{param.alarm ? 'Sì' : 'No'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDetailModal;