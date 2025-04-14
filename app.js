document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const tasksCounter = document.getElementById('tasks-counter');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const themeToggle = document.querySelector('.theme-toggle');
    const sortTasksBtn = document.getElementById('sort-tasks');
    const categoryDropdownItems = document.querySelectorAll('.dropdown-item');
    const taskPrioritySelect = document.getElementById('task-priority');
    const taskCategorySelect = document.getElementById('task-category');
    const taskDueDateInput = document.getElementById('task-due-date');
    
    // App State
    let tasks = [];
    let currentFilter = 'all';
    let currentCategoryFilter = 'all';
    let currentSortMethod = 'default';
    
    // Load tasks from localStorage
    const loadTasks = () => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
    };
    
    // Save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    
    // Update task counter
    const updateTasksCounter = () => {
        const activeTasks = tasks.filter(task => !task.completed).length;
        tasksCounter.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    };
    
    // Create task element
    const createTaskElement = (task) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        taskItem.dataset.id = task.id;
        
        // Set priority attribute for styling
        if (task.priority) {
            taskItem.dataset.priority = task.priority;
        }
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        checkbox.checked = task.completed;
        
        const taskDetails = document.createElement('div');
        taskDetails.classList.add('task-details');
        
        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        taskText.textContent = task.text;
        
        taskDetails.appendChild(taskText);
        
        // Add task metadata if available
        if (task.category || task.dueDate) {
            const taskMeta = document.createElement('div');
            taskMeta.classList.add('task-meta');
            
            if (task.category) {
                const categorySpan = document.createElement('span');
                categorySpan.classList.add('task-category');
                categorySpan.dataset.category = task.category;
                categorySpan.textContent = task.category;
                taskMeta.appendChild(categorySpan);
            }
            
            if (task.dueDate) {
                const dueDateSpan = document.createElement('span');
                dueDateSpan.classList.add('task-due-date');
                
                // Check if task is overdue
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dueDate = new Date(task.dueDate);
                if (dueDate < today) {
                    dueDateSpan.classList.add('overdue');
                }
                
                dueDateSpan.innerHTML = `<i class="far fa-calendar-alt"></i> ${task.dueDate}`;
                taskMeta.appendChild(dueDateSpan);
            }
            
            taskDetails.appendChild(taskMeta);
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskDetails);
        taskItem.appendChild(deleteBtn);
        
        return taskItem;
    };
    
    // Render tasks based on current filter
    const renderTasks = () => {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        
        // Apply status filter (all, active, completed)
        if (currentFilter === 'active') {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.completed);
        }
        
        // Apply category filter
        if (currentCategoryFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.category === currentCategoryFilter);
        }
        
        // Apply sorting
        if (currentSortMethod === 'priority') {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            filteredTasks.sort((a, b) => {
                return (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
            });
        } else if (currentSortMethod === 'dueDate') {
            filteredTasks.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
        } else if (currentSortMethod === 'alphabetical') {
            filteredTasks.sort((a, b) => a.text.localeCompare(b.text));
        }
        
        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
        
        updateTasksCounter();
    };
    
    // Add new task
    const addTask = (text) => {
        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            priority: taskPrioritySelect.value,
            category: taskCategorySelect.value,
            dueDate: taskDueDateInput.value || null
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
    };
    
    // Toggle task completion status
    const toggleTask = (id) => {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
    };
    
    // Delete task
    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };
    
    // Clear completed tasks
    const clearCompleted = () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    };
    
    // Set active filter
    const setFilter = (filter) => {
        currentFilter = filter;
        
        filterBtns.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        renderTasks();
    };
    
    // Set category filter
    const setCategoryFilter = (category) => {
        currentCategoryFilter = category;
        renderTasks();
    };
    
    // Sort tasks
    const sortTasks = () => {
        // Cycle through sort methods
        if (currentSortMethod === 'default') {
            currentSortMethod = 'priority';
        } else if (currentSortMethod === 'priority') {
            currentSortMethod = 'dueDate';
        } else if (currentSortMethod === 'dueDate') {
            currentSortMethod = 'alphabetical';
        } else {
            currentSortMethod = 'default';
        }
        
        // Update sort button text
        const sortIcon = '<i class="fas fa-sort"></i>';
        if (currentSortMethod === 'default') {
            sortTasksBtn.innerHTML = `${sortIcon} Sort`;
        } else if (currentSortMethod === 'priority') {
            sortTasksBtn.innerHTML = `${sortIcon} By Priority`;
        } else if (currentSortMethod === 'dueDate') {
            sortTasksBtn.innerHTML = `${sortIcon} By Due Date`;
        } else if (currentSortMethod === 'alphabetical') {
            sortTasksBtn.innerHTML = `${sortIcon} A-Z`;
        }
        
        renderTasks();
    };
    
    // Toggle dark mode
    const toggleDarkMode = () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    };
    
    // Initialize dark mode from localStorage
    const initDarkMode = () => {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
    };
    
    // Event Listeners
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        
        if (text) {
            addTask(text);
            taskInput.value = '';
            // Reset the form fields to default values
            taskPrioritySelect.value = 'medium';
            taskCategorySelect.value = 'other';
            taskDueDateInput.value = '';
            taskInput.focus();
        }
    });
    
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('task-checkbox')) {
            const taskItem = e.target.closest('.task-item');
            toggleTask(taskItem.dataset.id);
        } else if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
            const taskItem = e.target.closest('.task-item');
            deleteTask(taskItem.dataset.id);
        }
    });
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setFilter(btn.dataset.filter);
        });
    });
    
    // Dark mode toggle event listener
    themeToggle.addEventListener('click', toggleDarkMode);
    
    // Sort button event listener
    sortTasksBtn.addEventListener('click', sortTasks);
    
    // Category dropdown event listeners
    categoryDropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            setCategoryFilter(item.dataset.category);
        });
    });
    
    // Initialize app
    loadTasks();
    initDarkMode();
    renderTasks();
    
    // Initialize Sortable.js for drag and drop reordering
    new Sortable(taskList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function() {
            // Update tasks array based on new order
            const newOrder = [];
            document.querySelectorAll('.task-item').forEach(item => {
                const taskId = item.dataset.id;
                const task = tasks.find(t => t.id === taskId);
                if (task) newOrder.push(task);
            });
            tasks = newOrder;
            saveTasks();
        }
    });
});