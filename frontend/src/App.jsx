import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import HostPage from './pages/HostPage';
import JoinPage from './pages/JoinPage';
import QuizPage from './pages/QuizPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen gradient-bg text-slate-100 flex flex-col relative overflow-hidden">
          <div className="glow-mesh" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/host" element={
              <ProtectedRoute>
                <HostPage />
              </ProtectedRoute>
            } />

            <Route path="/join" element={
              <ProtectedRoute>
                <JoinPage />
              </ProtectedRoute>
            } />

            <Route path="/quiz/:roomCode" element={<QuizPage />} />

            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
