
const utilService = {  
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
    compareDateTimeStrings(DateTimeString1, DateTimeString2) {
      const date1 = new Date(DateTimeString1);
      const date2 = new Date(DateTimeString2);
  
      // Compare DateTime values
      if (date1 < date2) {
          return -1;
      } else if (date1 > date2) {
          return 1;
      } else {
          return 0;
      }
    },
    getFormattedDate(dateString){
      // Parse the date string
      const date = new Date(dateString);
      // Extract date components
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Month is zero-based, so add 1
      const day = date.getDate();
  
      return `${day}/${month}/${year}`
    },
    formatTime(time){
      const hours = Math.floor(time / (1000 * 60 * 60));
      const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((time % (1000 * 60)) / 1000);
  
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
}

module.exports = utilService;