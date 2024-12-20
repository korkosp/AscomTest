# Patient Tracking Dashboard

## 📋 Overview
A React-based patient tracking dashboard that allows healthcare professionals to view, filter, and manage patient information with an intuitive interface.

## 🚀 Prerequisites
- Node.js (v18.0.0 or later)
- npm (v9.0.0 or later)

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/korkosp/AscomTest.git
cd AscomTest
```

### 2. Install Dependencies
```bash
npm install
```

## 🖥️ Running the Application

### Development Mode
```bash
npm run dev
```

### Access the Application
Open your browser and navigate to:
- http://localhost:5173/

## 🛠️ Features
- Patient list view
- Advanced filtering options
- Patient status tracking
- Responsive design

## 🔍 Filtering Options
- Filter by patient status (Stable/Critical)
- Filter by gender
- Filter by birth date range
- Search by patient name

## 🔢 Sorting Functionality
You can sort the patient list by clicking on the column headers:

- Cognome (Last Name)
- Nome (First Name)
- Sesso (Gender)
- Data di nascita (Birth Date)
- Parametri (Parameters)

Sorting toggles between:

- Ascending order (first click)
- Descending order (second click)

Sorting Indicators

- ▲ Indicates ascending order
- ▼ Indicates descending order

## 📦 Project Structure
- `src/components/`: React components
- `src/services/`: API and data services
- `src/styles/`: CSS stylesheets

## 📝 Notes
- Requires an active internet connection
- Uses basic authentication for API access
- Optimized for modern web browsers

## 🐛 Known Issues
- Potential API connectivity issues
- Limited to current API endpoint
