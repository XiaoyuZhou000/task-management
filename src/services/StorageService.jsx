import Task from '../models/Task';

const STORAGE_KEY = 'task-manager-data';

export default class StorageService {
  static saveTasks(activeTasks, completedTasks) {
    try {
      const data = {
        activeTasks: activeTasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          important: task.important,
          completed: task.completed
        })),
        completedTasks: completedTasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          important: task.important,
          completed: task.completed
        })),
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save tasks:', e);
      return false;
    }
  }

  static loadTasks() {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) return { activeTasks: [], completedTasks: [] };

      const parsedData = JSON.parse(rawData);
      
      return {
        activeTasks: (parsedData.activeTasks || []).map(t => new Task(
          t.id,
          t.title,
          t.description,
          t.deadline, 
          t.important,
          t.completed
        )),
        completedTasks: (parsedData.completedTasks || []).map(t => new Task(
          t.id,
          t.title,
          t.description,
          t.deadline,
          t.important,
          t.completed
        ))
      };
    } catch (e) {
      console.error('Failed to load tasks:', e);
      return { activeTasks: [], completedTasks: [] };
    }
  }
}