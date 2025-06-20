import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Import All Page Components ---
import HomePage from './pages/HomePage';
import QuestionLibraryPage from './pages/QuestionLibraryPage';
import SingleQuestionPage from './pages/SingleQuestionPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import QuestionListPage from './pages/QuestionListPage';
import AddQuestionPage from './pages/AddQuestionPage'; // Corrected import path
import ReportsPage from './pages/ReportsPage';
import ReportIssuePage from './pages/ReportIssuePage';

// --- Import Layout Components ---
import AdminLayout from './components/AdminLayout';
import PublicLayout from './components/PublicLayout';


// This component protects the admin routes
const ProtectedRoute = () => {
    const { token, loading } = useAuth();
    if (loading) {
        return <div>Loading Application...</div>;
    }
    return token ? <AdminLayout /> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
        <Routes>
            {/* === Public Routes (for students) === */}
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="questions" element={<QuestionLibraryPage />} />
                <Route path="question/:id" element={<SingleQuestionPage />} />
                <Route path="report-issue/:id" element={<ReportIssuePage />} />
            </Route>

            {/* === Authentication Route === */}
            <Route path="/login" element={<LoginPage />} />

            {/* === Protected Admin Routes === */}
            <Route path="/admin" element={<ProtectedRoute />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="questions" element={<QuestionListPage />} />
                <Route path="questions/add" element={<AddQuestionPage />} />
                <Route path="questions/edit/:id" element={<AddQuestionPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route index element={<Navigate to="dashboard" />} />
            </Route>
             {/* Any other URL that doesn't match will be redirected to the public homepage */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;