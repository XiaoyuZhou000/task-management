import React from 'react';
import Task from '../models/Task';
import TaskService from '../services/TaskService';
import '../styles/TaskManagement.css';

const TaskForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDelete, 
  task = null,
  isEditMode = false 
}) => {
  const [formData, setFormData] = React.useState(
    task || {
      title: '',
      description: '',
      deadline: '',
      important: false,
      recurringWeekly: false,
      recurringDaily: false
    }
  );

  React.useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  // Update the formData state for each field
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Validate the task via TaskService.validateTask. If valid, it calls the onSubmit prop to pass the task data upward, then closes the form (onClose)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (TaskService.validateTask(formData)) {
      onSubmit(formData);
      onClose();
    }
  };

  // The form only appears when isOpen is true
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="task-management">
        <h2>{isEditMode ? 'Edit Task' : 'Create New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title (Required)</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Task title"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Task description"
            />
          </div>
          <div className="form-group">
            <label>Deadline (Required)
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              required
            />
            </label>
            
            <div className='recurring'>
            <input
                type="checkbox"
                name="recurringDaily"
                checked={formData.recurringDaily}
                onChange={handleInputChange}
              />
              Daily
              <input
                type="checkbox"
                name="recurringWeekly"
                checked={formData.recurringWeekly}
                onChange={handleInputChange}
              />
              Weekily
            </div>
            
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="important"
                checked={formData.important}
                onChange={handleInputChange}
              />
              Mark as important
            </label>
          </div>
          <div className="actions">
            {isEditMode && (
              <button 
                type="button"
                className="delete-btn" 
                onClick={() => {
                  onDelete(formData.id);
                  onClose();
                }}
              >
                Delete Task
              </button>
            )}
            <div>
              <button 
                type="button"
                className="cancel-btn" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn">
                {isEditMode ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;