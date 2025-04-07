import React from 'react';
import TaskService from '../services/TaskService';
import '../styles/TaskManagement.css';

const TaskItem = ({ task, onToggleComplete, onToggleImportant, onClick }) => {
  // calculate days left
  const calculateDaysLeft = (deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    const diffTime = dueDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };
  const daysLeft = calculateDaysLeft(task.deadline);
  return (
    <li 
      className={`task-item ${task.important ? 'important' : ''}`}
      onClick={() => onClick(task)}
    >
      <div 
        className="task-checkbox" 
        onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
      >
        {task.completed ? '✓' : ''}
      </div>
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <span className="deadline">
          Due: {TaskService.formatDateTime(task.deadline)}
          {daysLeft >= 0 ? ` (${daysLeft} days left)` : ' (Overdue)'}
        </span>
      </div>
      <div 
        className="star-icon" 
        onClick={(e) => { e.stopPropagation(); onToggleImportant(task.id); }}
      >
        {task.important ? '★' : '☆'}
      </div>
    </li>
  );
};

export default TaskItem;