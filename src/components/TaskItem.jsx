import React from 'react';
import TaskService from '../services/TaskService';
import '../styles/TaskManagement.css';

const TaskItem = ({ task, onToggleComplete, onToggleImportant, onClick }) => {
  // calculate days left normally
  const calculateDaysLeft = (deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    const diffTime = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24))
    console.log(now)
    console.log(dueDate)
    console.log(diffTime)

    if (((dueDate - now) / (1000 * 60 * 60 * 24)) > 0 && ((dueDate - now) / (1000 * 60 * 60 * 24)) < 1) {
      return ", Due Today"
    } else if (((dueDate - now) / (1000 * 60 * 60 * 24))  < 0) {
      return ", Overdue";
    } else {
      return ' ,' + diffTime + ' day(s) left';
    }
  };

  const updateDeadline = () => {
    if (task.recurringDaily === true && calculateDaysLeft(task.deadline) < 0) {
      let deadlineDate = new Date(TaskService.formatDateTime(task.deadline));
      task.deadline = deadlineDate.setDate(deadlineDate.getDate() + 1); 
      task.completed = false;
      return task.deadline;
    } else if (task.recurringDaily === true && calculateDaysLeft(task.deadline) < 0) {
      let deadlineDate = new Date(TaskService.formatDateTime(task.deadline));
      task.deadline = deadlineDate.setDate(deadlineDate.getDate() + 7); 
      task.completed = false;
      return task.deadline;
    } else {
      return task.deadline;
    }
  }


  const checkedDeadline = updateDeadline();
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
          Due: {TaskService.formatDateTime(checkedDeadline)}
          {daysLeft}
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