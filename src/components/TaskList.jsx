import React from 'react';
import TaskItem from './TaskItem';
import '../styles/TaskManagement.css';

const TaskList = ({ tasks, onToggleComplete, onToggleImportant, onTaskClick }) => {
  return (
    <div className="tasks-container">
      <h2>Active Tasks ({tasks.length})</h2>
      {tasks.length === 0 ? (
        <p>No active tasks. Create one to get started!</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onToggleImportant={onToggleImportant}
              onClick={onTaskClick}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;