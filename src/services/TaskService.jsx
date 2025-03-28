export default class TaskService {
    static formatDateTime(dateTimeString) {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      // local timezone and default locale
      return new Date(dateTimeString).toLocaleDateString(undefined, options);
    }
  
    static validateTask(task) {
      return task.title && task.deadline;
    }
}