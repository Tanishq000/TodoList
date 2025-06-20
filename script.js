
    let tasks = [];
    let filter = 'all';
    let taskIdCounter = 0;

    // Initialize app
    function init() {
      renderTasks();
      updateStats();
      
      // Add enter key support
      document.getElementById('task-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          addTask();
        }
      });
    }

    function updateStats() {
      const total = tasks.length;
      const completed = tasks.filter(task => task.completed).length;
      const pending = total - completed;
      
      document.getElementById('total-count').textContent = total;
      document.getElementById('pending-count').textContent = pending;
      document.getElementById('completed-count').textContent = completed;
    }

    function renderTasks() {
      const container = document.getElementById('tasks-container');
      const emptyState = document.getElementById('empty-state');
      
      const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return filter === 'completed' ? task.completed : !task.completed;
      });

      if (filteredTasks.length === 0) {
        container.innerHTML = '';
        container.appendChild(emptyState);
        return;
      }

      container.innerHTML = '';
      
      filteredTasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        container.appendChild(taskElement);
      });
    }

    function createTaskElement(task) {
      const div = document.createElement('div');
      div.className = `task-item ${task.completed ? 'completed' : ''}`;
      div.innerHTML = `
        <div class="task-checkbox ${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id})">
          ${task.completed ? '<span class="checkmark">✓</span>' : ''}
        </div>
        <div class="task-text" onclick="toggleTask(${task.id})">${task.text}</div>
        <div class="task-actions">
          <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">✕</button>
        </div>
      `;
      return div;
    }

    function addTask() {
      const input = document.getElementById('task-input');
      const text = input.value.trim();
      
      if (text) {
        const newTask = {
          id: taskIdCounter++,
          text: text,
          completed: false,
          createdAt: new Date()
        };
        
        tasks.unshift(newTask);
        input.value = '';
        renderTasks();
        updateStats();
        
        // Add a small delay to trigger animation
        setTimeout(() => {
          const taskElements = document.querySelectorAll('.task-item');
          if (taskElements.length > 0) {
            taskElements[0].style.animation = 'slideIn 0.5s ease-out';
          }
        }, 10);
      }
    }

    function deleteTask(taskId) {
      const taskElement = document.querySelector(`.task-item:has([onclick*="${taskId}"])`);
      if (taskElement) {
        taskElement.classList.add('removing');
        setTimeout(() => {
          tasks = tasks.filter(task => task.id !== taskId);
          renderTasks();
          updateStats();
        }, 300);
      }
    }

    function toggleTask(taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateStats();
      }
    }

    function filterTasks(type) {
      filter = type;
      
      // Update active filter button
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      event.target.classList.add('active');
      
      renderTasks();
    }

    // Initialize the app
    init();
