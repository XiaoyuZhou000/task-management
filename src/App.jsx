import React, { useState, useEffect } from 'react';
import Task from './models/Task';
import TaskList from './components/TaskList';
import CompletedTasks from './components/CompletedTasks';
import TaskForm from './components/TaskForm';
import StorageService from './services/StorageService';
import './styles/TaskManagement.css';
const STORAGE_KEY = 'task-manager-data';

const App = () => {
  const [initialized, setInitialized] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCreate, setshowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks 
  useEffect(() => {
    if (!initialized) {
      const { activeTasks, completedTasks } = StorageService.loadTasks();
      setTasks(activeTasks);
      setCompletedTasks(completedTasks);
      setInitialized(true);
      console.log('Initial load:', { activeTasks, completedTasks });
    }
  }, [initialized]);

  // Save tasks when they change (but only after initial load)
  useEffect(() => {
    if (initialized) {
      StorageService.saveTasks(tasks, completedTasks);
      console.log('Saved tasks:', { tasks, completedTasks });
    }
  }, [tasks, completedTasks, initialized]);

  // Temporary debug code
  useEffect(() => {
    console.log('Current localStorage:', localStorage.getItem(STORAGE_KEY));
  }, []);
  useEffect(() => {
    console.log('Tasks state changed:', tasks);
  }, [tasks]);
  useEffect(() => {
    console.log('Completed tasks state changed:', completedTasks);
  }, [completedTasks]);

  const handleCreateTask = (taskData) => {
    const newTask = Task.createNew(
      taskData.title,
      taskData.description,
      taskData.deadline,
      taskData.important
    );
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskData) => {
    setTasks(tasks.map(task => 
      task.id === taskData.id ? taskData : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    // Include only those tasks whose id is not equal to taskId
    setTasks(tasks.filter(task => task.id !== taskId));
    setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
  };

  const toggleComplete = (taskId) => {
    const taskToComplete = tasks.find(task => task.id === taskId);
    if (taskToComplete) {
      // Move to completed
      setTasks(tasks.filter(task => task.id !== taskId));
      setCompletedTasks([...completedTasks, {...taskToComplete, completed: true}]);
    } else {
      // Move back to active
      const taskToReactivate = completedTasks.find(task => task.id === taskId);
      setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
      setTasks([...tasks, {...taskToReactivate, completed: false}]);
    }
  };

  const toggleImportant = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, important: !task.important} : task
    ));
  };

  return (
    <div className="task-management">
      <header>
        <h1>Task Manager</h1>
        <button className="create-btn" onClick={() => setshowCreate(true)}>
          + Create Task
        </button>
      </header>

      <TaskList
        tasks={tasks}
        onToggleComplete={toggleComplete}
        onToggleImportant={toggleImportant}
        onTaskClick={(task) => setEditingTask(task)}
      />

      <CompletedTasks
        completedTasks={completedTasks}
        onToggleComplete={toggleComplete}
      />

      <TaskForm
        isOpen={showCreate}
        onClose={() => setshowCreate(false)}
        onSubmit={handleCreateTask}
      />

      <TaskForm
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        onDelete={handleDeleteTask}
        task={editingTask}
        isEditMode={true}
      />
    </div>
  );
};

export default App;