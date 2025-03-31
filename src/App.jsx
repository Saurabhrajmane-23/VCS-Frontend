import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

import BranchManage from './pages/BranchManage';
import CommitHistory from './pages/CommitHistory';
import Repository from './pages/Repository';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path='/' element={<Register />} />
        <Route path='/branchManage' element={<BranchManage />} />
        <Route path='/commitHistory' element={<CommitHistory />} />
        <Route path='/repository' element={<Repository />} />
      </Routes>
    </Router>
  );
}

export default App;