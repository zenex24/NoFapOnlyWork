class AtomicHabitsApp {
    constructor() {
        this.userData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
    }

    setupEventListeners() {
        // Welcome screen
        document.getElementById('start-btn').addEventListener('click', () => this.handleStart());
        document.getElementById('habit-options').addEventListener('change', (e) => this.handleHabitChange(e.target.value));
        
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Chat
        document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Quick actions
        document.getElementById('log-habit').addEventListener('click', () => this.logHabit());
        document.getElementById('view-history').addEventListener('click', () => this.viewHistory());
        document.getElementById('add-task').addEventListener('click', () => this.addTask());
        document.getElementById('edit-profile').addEventListener('click', () => this.editProfile());
    }

    handleHabitChange(value) {
        const customHabit = document.getElementById('custom-habit');
        if (value === 'other') {
            customHabit.classList.remove('hidden');
        } else {
            customHabit.classList.add('hidden');
        }
    }

    handleStart() {
        const name = document.getElementById('username').value.trim();
        const habitType = document.querySelector('input[name="habit-type"]:checked').value;
        const habitOption = document.getElementById('habit-options').value;
        const customHabit = document.getElementById('custom-habit-input').value.trim();

        if (!name) {
            this.showMessage('Пожалуйста, введите ваше имя');
            return;
        }

        let targetHabit = habitOption;
        if (habitOption === 'other' && customHabit) {
            targetHabit = customHabit;
        } else if (habitOption === 'other' && !customHabit) {
            this.showMessage('Пожалуйста, опишите вашу привычку');
            return;
        }

        this.userData = {
            name: name,
            habitType: habitType,
            targetHabit: targetHabit,
            progress: 0,
            streak: 0,
            totalDays: 0
        };

        this.saveUserData();
        this.showMainApp();
        this.updateUI();
    }

    showMainApp() {
        document.getElementById('welcome-screen').classList.remove('active');
        document.getElementById('main-app').classList.add('active');
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`tab-${tabName}`).classList.add('active');
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addChatMessage(message, 'user');

        // Clear input
        input.value = '';

        // Simulate bot response (in real app this would call API)
        await this.simulateBotResponse(message);
    }

    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async simulateBotResponse(userMessage) {
        // In a real app, this would call the actual bot API
        const responses = [
            `Привет, ${this.userData?.name}! Спасибо за ваше сообщение.`,
            'Это отличный вопрос! Давайте обсудим это подробнее.',
            'Я полностью понимаю ваши чувства. Давайте найдем решение вместе.',
            'Отличная мысль! Вы на правильном пути к формированию привычки.',
            'Спасибо за поделиться! Это очень ценно для нашего общения.'
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.addChatMessage(randomResponse, 'bot');
    }

    logHabit() {
        if (!this.userData) {
            this.showMessage('Сначала настройте свою привычку');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const progress = 100; // Complete

        // Update user data
        this.userData.progress = Math.min(this.userData.progress + progress, 100);
        this.userData.totalDays += 1;
        this.userData.streak += 1;

        // Save data
        this.saveUserData();

        // Update UI
        this.updateUI();

        this.showMessage('Прогресс записан! Отличная работа!', 'success');
    }

    viewHistory() {
        if (!this.userData) {
            this.showMessage('Сначала настройте свою привычку');
            return;
        }

        let history = `История прогресса:\n\n`;
        history += `Привычка: ${this.userData.targetHabit}\n`;
        history += `Тип: ${this.userData.habitType === 'good' ? 'Хорошая' : 'Плохая'}\n\n`;
        history += `Дней подряд: ${this.userData.streak}\n`;
        history += `Всего дней: ${this.userData.totalDays}\n`;
        history += `Прогресс: ${this.userData.progress}%\n`;

        this.showMessage(history, 'info');
    }

    addTask() {
        const task = prompt('Введите задачу:');
        if (!task) return;

        const planList = document.getElementById('plan-list');
        const taskItem = document.createElement('div');
        taskItem.className = 'plan-item';
        taskItem.innerHTML = `
            <input type="checkbox" id="task-${Date.now()}">
            <label for="task-${Date.now()}">${task}</label>
        `;

        planList.appendChild(taskItem);

        taskItem.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            if (e.target.checked) {
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
            }
        });
    }

    editProfile() {
        const newName = prompt('Введите ваше имя:', this.userData?.name || '');
        if (newName) {
            this.userData.name = newName;
            this.saveUserData();
            this.updateUI();
        }
    }

    updateUI() {
        if (!this.userData) return;

        document.getElementById('user-name').textContent = this.userData.name;
        document.getElementById('user-habit').textContent = 
            `Ваша цель: ${this.userData.targetHabit} (${this.userData.habitType === 'good' ? 'Хорошая' : 'Плохая'})`;
        document.getElementById('streak').textContent = this.userData.streak;
        document.getElementById('total').textContent = this.userData.totalDays;
        document.getElementById('progress').textContent = `${this.userData.progress}%`;

        // Update profile tab
        document.getElementById('profile-name').textContent = this.userData.name;
        document.getElementById('profile-goal').textContent = this.userData.targetHabit;
        document.getElementById('profile-type').textContent = 
            this.userData.habitType === 'good' ? 'Хорошая' : 'Плохая';
    }

    loadUserData() {
        try {
            const savedData = localStorage.getItem('atomicHabitsUserData');
            if (savedData) {
                this.userData = JSON.parse(savedData);
                if (this.userData) {
                    this.showMainApp();
                    this.updateUI();
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    saveUserData() {
        try {
            if (this.userData) {
                localStorage.setItem('atomicHabitsUserData', JSON.stringify(this.userData));
            }
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#34a853' : type === 'error' ? '#ea4335' : '#1a73e8'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-width: 300px;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AtomicHabitsApp();
});