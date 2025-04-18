import React, { useState, useEffect, useRef} from 'react';
import Task from './models/Task';
import TaskList from './components/TaskList';
import CompletedTasks from './components/CompletedTasks';
import TaskForm from './components/TaskForm';
import StorageService from './services/StorageService';
import './styles/TaskManagement.css';
import OverdueModal from './components/OverdueModal';

const STORAGE_KEY = 'task-manager-data';

const App = () => {
  const [initialized, setInitialized] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCreate, setshowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState('deadline'); 
  const [selectedTaskToDelete, setSelectedTaskToDelete] = useState(null);
  const hasShownAlert = useRef(false);
  const [showModal, setShowModal] = useState(false);
  const [overdueTitles, setOverdueTitles] = useState('');
  const [overdueCount, setOverdueCount] = useState(0);

  // Load tasks 
  useEffect(() => {
    if (!initialized) {
      const { activeTasks, completedTasks } = StorageService.loadTasks();
      setTasks(activeTasks);
      setCompletedTasks(completedTasks);
      setInitialized(true);
      console.log('Initial load:', { activeTasks, completedTasks });

      const now = new Date();
      const overdueTasks = activeTasks.filter(task => new Date(task.deadline) < now);
      if (overdueTasks.length > 0 && !hasShownAlert.current) {
        hasShownAlert.current = true;
        setOverdueCount(overdueTasks.length);
        const titles = overdueTasks.map(task => `• ${task.title}`).join('\n');
        setOverdueTitles(titles);
        setShowModal(true);
      }
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

// Show overdue task alert after initial load
// useEffect(() => {
//   if (initialized && tasks.length > 0) {
//     const now = new Date();
//     const overdueTasks = tasks.filter(task => new Date(task.deadline) < now && !task.completed);
//     if (overdueTasks.length > 0) {
//       const taskNames = overdueTasks.map(task => `- ${task.title}`).join('\n');
//       alert(`You have ${overdueTasks.length} overdue task(s):\n${taskNames}`);
//     }
//   }
// }, [initialized, tasks]);


  const handleCreateTask = (taskData) => {
    const newTask = Task.createNew(
      taskData.title,
      taskData.description,
      taskData.deadline,
      taskData.important,
      taskData.recurringDaily,
      taskData.recurringWeekily
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

  const handleReactiveTask = (taskId) => {
    toggleComplete(taskId);
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

  //sort by ddl or priority
  const sortTasks = (tasks, criteria) => {
    return [...tasks].sort((a, b) => {
      if (criteria === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (criteria === 'priority') {
        return b.important - a.important; 
      }
      return 0;
    });
  };

  const sortedTasks = sortTasks(tasks, sortBy);

  return (
    <div className="task-management">
      <header>
        <h1>Task Manager</h1>
        <button className="create-btn" onClick={() => setshowCreate(true)}>
          + Create Task
        </button>
      </header>
      <OverdueModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>📌 You have {overdueCount} overdue tasks:</h2>
        <pre>{overdueTitles}</pre>
      </OverdueModal>
      <div style={{ marginTop: '10px',marginBottom:'10px' }}>
            <label>Sort by: </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
            </select>
      </div>
      <TaskList
        tasks={sortedTasks}
        onToggleComplete={toggleComplete}
        onToggleImportant={toggleImportant}
        onTaskClick={(task) => setEditingTask(task)}
      />

      <CompletedTasks
        completedTasks={completedTasks}
        onToggleComplete={toggleComplete}
        onTaskClick={(task) => setSelectedTaskToDelete(task.id)}
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

      {selectedTaskToDelete !== null && (
        <div className="overlay">
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this task?</p>
            <div className="delete-actions">
              <button className='reactive-btn' onClick={() => {
                handleReactiveTask(selectedTaskToDelete);
                setSelectedTaskToDelete(null);
              }}>Re-active</button>
              <button className="delete-btn" onClick={() => {
                handleDeleteTask(selectedTaskToDelete);
                setSelectedTaskToDelete(null);
              }}>Delete</button>
              <button className="cancel-btn" onClick={() => setSelectedTaskToDelete(null)}>Keep</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;