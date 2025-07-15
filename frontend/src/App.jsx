import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Import All Page Components ---
import HomePage from './pages/HomePage';
import QuestionLibraryPage from './pages/QuestionLibraryPage';
import SingleQuestionPage from './pages/SingleQuestionPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import QuestionListPage from './pages/QuestionListPage';
import AddQuestionPage from './pages/AddQuestionPage'; 
import ReportsPage from './pages/ReportsPage';
import ReportIssuePage from './pages/ReportIssuePage';
import PostListPage from './pages/PostListPage';
import AddPostPage from './pages/AddPostPage';
import ArticleListPage from './pages/ArticleListPage';
import SinglePostPage from './pages/SinglePostPage';
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
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
            {/* === Public Routes (for students) === */}
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="questions" element={<QuestionLibraryPage />} />
                <Route path="question/:id" element={<SingleQuestionPage />} />
                <Route path="report-issue/:id" element={<ReportIssuePage />} />
                <Route path="articles" element={<ArticleListPage />} />
                <Route path="articles/:slug" element={<SinglePostPage />} />
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
                 <Route path="posts" element={<PostListPage />} />
                 <Route path="posts/add" element={<AddPostPage />} />
                <Route path="posts/edit/:id" element={<AddPostPage />} />
                <Route index element={<Navigate to="dashboard" />} />
            </Route>
             {/* Any other URL that doesn't match will be redirected to the public homepage */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;