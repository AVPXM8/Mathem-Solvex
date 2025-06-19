// import React from 'react';
// import { Outlet, NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import styles from './AdminLayout.module.css';

// const AdminLayout = () => {
//     const auth = useAuth();
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         auth.logout();
//         navigate('/login');
//     };

//     return (
//         <div className={styles.layout}>
//             <aside className={styles.sidebar}>
//                 <h2 className={styles.sidebarHeader}>Maarula Admin</h2>
//                 <nav className={styles.sidebarNav}>
//                     <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink>
//                     <NavLink to="/admin/questions" className={({ isActive }) => isActive ? styles.active : ''}>Questions</NavLink>
//                     <NavLink to="/admin/reports" className={({ isActive }) => isActive ? styles.active : ''}>Reports</NavLink>
//                 </nav>
//                 <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
//             </aside>
//             <main className={styles.mainContent}>
//                 <Outlet />
//             </main>
//         </div>
//     );
// };

// export default AdminLayout;
// new updated 
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout();
        navigate('/login');
    };

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <h2 className={styles.sidebarHeader}>Maarula Admin</h2>
                <nav className={styles.sidebarNav}>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink>
                    <NavLink to="/admin/questions" className={({ isActive }) => isActive ? styles.active : ''}>Questions</NavLink>
                    <NavLink to="/admin/reports" className={({ isActive }) => isActive ? styles.active : ''}>Reports</NavLink>
                </nav>
                <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </aside>
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;