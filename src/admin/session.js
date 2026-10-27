import { createContext, useContext } from 'react';

// The logged-in staff member, available to every page.
export const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

export const navigate = (path) => {
  window.location.hash = path;
};

export const canEditClinical = (user) => user.role === 'admin' || user.role === 'therapist';
