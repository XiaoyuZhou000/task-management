import React from 'react';
import TaskItem from './TaskItem';
import TaskService from '../services/TaskService';
import '../styles/TaskManagement.css';

const CompletedTasks = ({ completedTasks, onToggleComplete, onTaskClick }) => {
  return (
    <div className="completed-tasks">
      <h2>Completed Tasks ({completedTasks.length})</h2>
      {completedTasks.length > 0 && (
        <ul className="completed-list">
          {completedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={{...task, completed: true}}
              onToggleComplete={onToggleComplete}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedTasks;