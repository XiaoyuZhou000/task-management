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
      <div className="task-checkbox">
      <input 
        type="checkbox" 
        id={`cbx-${task.id}`} 
        className="task-checkbox-input"
        checked={task.completed}
        onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
      />
      <label 
        htmlFor={`cbx-${task.id}`} 
        className="check"
        onClick={(e) => e.stopPropagation()}
      >
        <svg width="18px" height="18px" viewBox="0 0 18 18">
          <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
          <polyline points="1 9 7 14 15 4"></polyline>
        </svg>
      </label>
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
      {/* <div 
        className="star-icon" 
        onClick={(e) => { e.stopPropagation(); onToggleImportant(task.id); }}
      >
        {task.important ? '★' : '☆'}
      </div> */}
      <label 
      className="star-container"
      onClick={(e) => { e.stopPropagation(); }}
    >
      <input 
        type="checkbox" 
        checked={task.important}
        onChange={(e) => { e.stopPropagation(); onToggleImportant(task.id); }}
      />
      <svg 
        height="24px" 
        width="24px" 
        viewBox="0 0 24 24" 
        version="1.2" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g>
          <g>
            <path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path>
          </g>
        </g>
      </svg>
    </label>
    </li>
  );
};

export default TaskItem;