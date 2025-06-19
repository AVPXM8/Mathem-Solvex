// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const API_URL = 'http://localhost:3001/api/admin/';
// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//     const [token, setToken] = useState(localStorage.getItem('adminToken'));
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const verifyUser = async () => {
//             if (token) {
//                 try {
//                     const config = { headers: { Authorization: `Bearer ${token}` } };
//                     const response = await axios.get(API_URL + 'me', config);
//                     setUser(response.data);
//                 } catch (error) {
//                     console.error("Session token is invalid, logging out.");
//                     logout();
//                 }
//             }
//             setLoading(false);
//         };
//         verifyUser();
//     }, [token]);

//     const login = async (username, password) => {
//         try {
//             const response = await axios.post(API_URL + 'login', { username, password });
//             if (response.data && response.data.token) {
//                 localStorage.setItem('adminToken', response.data.token);
//                 setToken(response.data.token);
//                 setUser(response.data); // Assuming login returns user info
//                 return true;
//             }
//             return false;
//         } catch (err) {
//             throw new Error(err.response?.data?.message || 'Login failed!');
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem('adminToken');
//         setToken(null);
//         setUser(null);
//     };

//     const value = { token, user, login, logout, loading };

//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };
 
// updated code 
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/admin/';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            if (token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const response = await axios.get(API_URL + 'me', config);
                    setUser(response.data);
                } catch (error) {
                    console.error("Auth token is invalid, logging out.", error);
                    logout();
                }
            }
            setLoading(false);
        };
        verifyUser();
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post(API_URL + 'login', { username, password });
            if (response.data && response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                setToken(response.data.token);
                setUser(response.data);
                return true;
            }
            return false;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Login failed!');
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
        setUser(null);
    };

    const value = { token, user, login, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);