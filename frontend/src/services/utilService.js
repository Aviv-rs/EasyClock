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
    compareTimeStrings(timeString1, timeString2) {
      const [hours1, minutes1, seconds1] = timeString1.split(':').map(Number);
      const [hours2, minutes2, seconds2] = timeString2.split(':').map(Number);
  
      const date1 = new Date(2000, 0, 1, hours1, minutes1, seconds1);
      const date2 = new Date(2000, 0, 1, hours2, minutes2, seconds2);
  
      // Compare time values
      if (date1 < date2) {
          return -1;
      } else if (date1 > date2) {
          return 1;
      } else {
          return 0;
      }
    },
    async ajax(endpoint, method = 'GET', data = null){
        const options = {
            method,
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include'
        };

        if((method === 'POST' || method === 'PUT') && data) options.body = JSON.stringify(data);
        try {
          const res = await fetch(SERVER_URL + endpoint, options);
          return res.json();
        } catch (error) {
          console.log(error);
          alert(error)
        }

    },
    formatTime(time){
      const hours = Math.floor(time / (1000 * 60 * 60));
      const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((time % (1000 * 60)) / 1000);
  
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
}