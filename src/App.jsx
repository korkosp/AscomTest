import React from 'react';
import PatientGrid from './components/PatientsGrid';
import { Container } from '@mui/material';
import './styles/tabella.css'

const App = () => {
  return (
    <Container>
      <PatientGrid />
    </Container>
  );
};

export default App;
