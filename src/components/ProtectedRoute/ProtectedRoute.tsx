import React from 'react'
import useLocalStorage from '../../hooks/useLocalStorage';
import { localStorageKeyName } from '../../constants';
import { Navigate, Outlet } from 'react-router-dom';


export const useAuth = () => {
    const userData = useLocalStorage().getLocalStorage(localStorageKeyName)
    return userData;
};


export const ProtectedRoute = () => {
    const isAuthenticated = useAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
