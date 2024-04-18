import { useState, useEffect } from 'react';
import { utilService } from '../services/utilService';

// Custom hook for authentication
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
        const loginToken = utilService.getCookie('loginToken');
        if(loginToken){

          try {
            const result = await utilService.ajax('auth/check', 'GET');
            if(result && result.id && !result.err) {
              sessionStorage.setItem('loggedInUser', JSON.stringify(result)) ;
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

  return { isAuthenticated, isLoading };
};

export default useAuth;
