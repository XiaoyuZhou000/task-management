# Task Manager

![Task Manager Screenshot]()

A React-based task management application with local storage persistence.

## Features

- 🚀 **Create tasks** with title, description, deadline, and priority
- ⭐ **Mark tasks** as important/non-important. Important tasks have an orange border for quick identification
- ✅ **Complete tasks** with one click
- ✏️ **Edit tasks** with full details
- 🗑️ **Delete tasks** when no longer needed
- 💾 **Automatic saving** to browser's localStorage
- 📱 **Responsive design** works on all devices
- 📅 **Date picker** helps select valid deadlines

## Installation

### Dependencies
- react: "^19.0.0"
- react-dom: "^19.0.0"

### Steps
1. Clone the repository:
``` bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```
2. Install dependencies:
``` bash
npm install
```
## Usage

### Running Locally

Start the development server:
``` bash
npm run dev
```
The application will open in your browser at http://localhost:5173

### Building for Production

Create an production build:
``` bash
npm run build
```

## How to Use the Application

### Creating a Task
1. Click the <kbd>+ Create Task</kbd> button in the top-right corner
2. Fill in the task details in the popup modal:
   - **Title** (required) - Your task name
   - **Description** (optional) - Additional details
   - **Deadline** (required) - Click the field to select both date and time
   - **Important** (required) - Toggle the checkbox to mark as high priority
3. Click <kbd>Create Task</kbd> to save or <kbd>Cancel</kbd> to discard

![Create Task]() <!-- Add screenshot if available -->

### Managing Active Tasks
Each task appears as a card with these interactive elements:

- **Complete Task**  
  Click the ○ circle on the left to mark as complete (moves to Completed section)
  
- **Priority Toggle**  
  Click the ☆ star on the right to mark as important (turns to ★)

- **Edit Task**  
  Click anywhere on the task card to open the edit page

### Editing a Task
When you click a task:
1. The edit page appears with all current task details
2. Make any changes needed
3. Choose an action:
   - <kbd>Save Changes</kbd> - Updates the task
   - <kbd>Delete Task</kbd> - Permanently removes the task
   - <kbd>Cancel</kbd> - Closes without saving

![Edit Task]() <!-- Add screenshot if available -->

### Viewing Completed Tasks
Completed tasks appear in the "Completed Tasks" section at the bottom:
- Shows completion date automatically
- Click the ✓ circle to move back to Active Tasks

## Project Structure
```
/src
  /components
    TaskList.jsx            # Active task list
    CompletedTasks.jsx      # Completed tasks section
    TaskForm.jsx       # Create/edit form page
    TaskItem.jsx            # Single task component
  /models
    Task.jsx                # Task data model
  /services
    StorageService.jsx      # LocalStorage handler
    TaskService.jsx         # Time zone handler
  /styles
    TaskManagement.css      # All styles
  App.jsx                   # Root component
  main.jsx                  # React entry point
```

## License
MIT License