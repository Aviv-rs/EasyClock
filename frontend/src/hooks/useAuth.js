import { useState, useEffect } from 'react';
import { utilService } from '../services/utilService';

// Custom hook for authentication
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
        const loginToken = utilService.getCookie('loginToken');
        if(loginToken){
          try {
            const result = await utilService.ajax('auth/check', 'GET');
            if(result && result.id && !result.err) {
              setIsAdmin(()=>result.perms === 'admin');
              sessionStorage.setItem('loggedInUser', JSON.stringify(result));
              setIsAuthenticated(true);
              setIsLoading(false);
            }
            
          } catch (err) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        } else {
            setIsAuthenticated(false);
            setIsLoading(false);
        }

    };

    checkAuthentication();
  }, []);

  return { isAuthenticated, isAdmin, isLoading };
};

export default useAuth;
