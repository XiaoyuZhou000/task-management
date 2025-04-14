import TaskService from '../services/TaskService';
import '../styles/TaskManagement.css';
import React, { useState, useEffect } from 'react';

const TaskItem = ({ task, onToggleComplete, onToggleImportant, onClick }) => {



  // calculate days left normally
  const calculateDaysLeft = (deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    const diffTime = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24))


    if (((dueDate - now) / (1000 * 60 * 60 * 24)) > 0 && ((dueDate - now) / (1000 * 60 * 60 * 24)) < 1) {
      return ", Due Today"
    } else if (((dueDate - now) / (1000 * 60 * 60 * 24))  < 0) {
      return ", Overdue";
    } else {
      return ' ,' + diffTime + ' day(s) left';
    }
  };

  const daysLeftNumber = (deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    const diffTime = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
    return diffTime
  };


  const updateDeadline = (task) => {
    if (task.recurringDaily === true && daysLeftNumber(task.deadline) < 0) {
      let deadlineDate = new Date(task.deadline);
      while (deadlineDate < new Date()) {
        deadlineDate.setDate(deadlineDate.getDate() + 1); 
      }
      task.deadline = deadlineDate;
      return task.deadline;

    } else if (task.recurringWeekily === true && daysLeftNumber(task.deadline) < 0) {
      let deadlineDate = new Date(task.deadline);
      while (deadlineDate < new Date()) {
        deadlineDate.setDate(deadlineDate.getDate() + 7); 
      }
      task.deadline = deadlineDate;
      return task.deadline;
    } else {
      return task.deadline;
    }
  }


  const calculateOverDueDays = (deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    const diffTime = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24));
    console.log("difftime:" + diffTime);
    if (diffTime < 0 ) {
      if (task.recurringDaily === true) {
        task.overDueTime = task.overDueTime + Math.abs(diffTime);
        return Math.abs(diffTime);
      } else if (task.recurringWeekily === true) {
        task.overDueTime = task.overDueTime + Math.abs(diffTime / 7);
        return Math.ceil(Math.abs(diffTime / 7));
      }
    }
    return 0
  }

  const [daysLeft, setdaysLeft] = useState(calculateDaysLeft);
  const [overdueTimes, setOverdueTimes] = useState(task.overDueTime);
  const [deadline, setDeadline] = useState(task.deadlilne);

  useEffect(() => {
    console.log("overduetimes state: " + overdueTimes);
    setdaysLeft(calculateDaysLeft(task.deadline));
    setOverdueTimes(calculateOverDueDays(task.deadline));
    setDeadline(updateDeadline(task));
    console.log("new deadline: "+ deadline);
  }, []);



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
          {overdueTimes !== 0 && "Overdue " + overdueTimes + " time(s), "} 
          Due: {TaskService.formatDateTime(deadline)}
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