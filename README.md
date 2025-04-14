# To-Do List Application

## Overview
This is a feature-rich To-Do List application built with HTML, CSS, JavaScript, and Electron. It allows users to manage tasks with various features like priority levels, categories, due dates, filtering, sorting, and dark mode support.

## Features
- **Task Management**: Add, delete, and mark tasks as completed
- **Task Properties**: Set priority levels (Low, Medium, High), categories (Personal, Work, Shopping, Other....), and due dates
- **Filtering**: Filter tasks by status (All, Active, Completed) and categories
- **Sorting**: Sort tasks by priority, due date, or alphabetically
- **Dark Mode**: Toggle between light and dark themes
- **Drag and Drop**: Reorder tasks using drag and drop functionality
- **Persistence**: Tasks are saved to localStorage and persist between sessions
- **Responsive Design**: Works on various screen sizes
- **Visual Indicators**: Overdue tasks and priority levels are visually highlighted

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup
1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### As a Desktop Application (using Electron)
Run the following command in the project directory:
```
npm start
```
This will launch the application as a desktop app using Electron.

### As a Web Application
You can also run this as a simple web application by opening the `index.html` file in a web browser. However, some features might be limited compared to the Electron version.

## Project Structure
- `index.html` - Main HTML structure of the application
- `styles.css` - CSS styling for the application
- `app.js` - Main JavaScript file containing application logic
- `main.js` - Electron configuration for desktop application
- `package.json` - Project dependencies and scripts

## How It Works
- Tasks are stored in the browser's localStorage
- The application uses vanilla JavaScript for DOM manipulation
- SortableJS library is used for drag and drop functionality
- Font Awesome is used for icons
- The application follows a simple MVC-like pattern where:
  - The model is the tasks array
  - The view is handled by the renderTasks function
  - The controllers are the various event listeners

## Dependencies
- Electron - For desktop application functionality
- SortableJS - For drag and drop reordering
- Font Awesome - For icons

## License
