const SERVER_URL = 'http://localhost:3030/api/';

export const utilService = {  
    getCookie(name) {
        const cookieString = document.cookie;
        const cookies = cookieString.split(';');
        
        for (let cookie of cookies) {
          const [cookieName, cookieValue] = cookie.trim().split('=');
          if (cookieName === name) {
            return decodeURIComponent(cookieValue);
          }
        }
        
        return null;
    },
    async ajax(endpoint, method = 'GET', data = null){
        const options = {
            method,
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include'
        };

        if(method === 'POST' && data) options.body = JSON.stringify(data);

        const res = await fetch(SERVER_URL + endpoint, options);

        return res.json();
    }
    
}