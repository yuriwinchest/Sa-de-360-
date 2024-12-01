// Função melhorada para manipulação dos cards
function toggleCard(event, cardElement) {
    // Previne que cliques em botões ou elementos interativos fechem o card
    const clickedElement = event.target;
    if (
        clickedElement.classList.contains('action-button') ||
        clickedElement.closest('.action-button') ||
        clickedElement.tagName === 'SELECT' ||
        clickedElement.tagName === 'INPUT' ||
        clickedElement.classList.contains('time-slot') ||
        clickedElement.classList.contains('calendar-day') ||
        clickedElement.classList.contains('region-card') ||
        clickedElement.classList.contains('specialty-card') ||
        clickedElement.classList.contains('doctor-card')
    ) {
        event.stopPropagation();
        return;
    }

    const content = cardElement.querySelector('.card-content');
    const isActive = cardElement.classList.contains('active');

    // Fecha todos os outros cards
    document.querySelectorAll('.card').forEach(card => {
        if (card !== cardElement && card.classList.contains('active')) {
            card.classList.remove('active');
            card.querySelector('.card-content').style.display = 'none';
        }
    });

    // Toggle do card atual
    if (!isActive) {
        cardElement.classList.add('active');
        content.style.display = 'block';
        // Adiciona animação de entrada
        content.style.animation = 'fadeIn 0.3s ease forwards';
    } else {
        content.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            cardElement.classList.remove('active');
            content.style.display = 'none';
        }, 300);
    }
}

// Inicialização dos event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona listeners para todos os cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (event) => toggleCard(event, card));
    });

    // Inicializa os tooltips
    initializeTooltips();

    // Inicializa o sistema de notificações
    initializeNotifications();
});

// Sistema de Notificações
function initializeNotifications() {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

function showNotification(title, message, type = 'info') {
    const notificationContainer = document.getElementById('notification-system');
    
    const notification = document.createElement('div');
    notification.className = notification ${type};
    notification.innerHTML = 
        <strong>${title}</strong>
        <p>${message}</p>
        <button class="close-notification">×</button>
    ;

    notificationContainer.appendChild(notification);

    // Auto-remove após 5 segundos
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Botão de fechar
    notification.querySelector('.close-notification').onclick = () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    };
}

// Sistema de Tooltips
function initializeTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const element = event.target;
    const tooltipText = element.getAttribute('data-tooltip');
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.top = ${rect.top - tooltip.offsetHeight - 10}px;
    tooltip.style.left = ${rect.left + (rect.width - tooltip.offsetWidth) / 2}px;
    
    setTimeout(() => tooltip.classList.add('show'), 10);
}

function hideTooltip(event) {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.classList.remove('show');
        setTimeout(() => tooltip.remove(), 300);
    });
}

// Gerenciamento de Estado Global
const appState = {
    currentUser: null,
    notifications: [],
    activeCards: new Set(),
    currentTheme: 'light',
    fontSize: 'normal',
    highContrast: false
};

// Funções de Acessibilidade
function changeFontSize(action) {
    const body = document.body;
    const currentSize = parseInt(window.getComputedStyle(body).fontSize);
    
    switch(action) {
        case 'increase':
            body.style.fontSize = ${currentSize + 2}px;
            break;
        case 'decrease':
            body.style.fontSize = ${currentSize - 2}px;
            break;
        case 'reset':
            body.style.fontSize = '16px';
            break;
    }
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    appState.highContrast = !appState.highContrast;
}

// Função de Emergência
function handleEmergency() {
    if (confirm('Você está prestes a iniciar um chamado de emergência. Confirma?')) {
        // Obter localização
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const emergency = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: new Date().toISOString(),
                        type: 'emergency'
                    };
                    sendEmergencyAlert(emergency);
                },
                error => {
                    console.error('Erro ao obter localização:', error);
                    sendEmergencyAlert({ type: 'emergency' });
                }
            );
        } else {
            sendEmergencyAlert({ type: 'emergency' });
        }
    }
}

function sendEmergencyAlert(emergency) {
    // Simulação de envio do alerta
    showNotification(
        'Emergência Acionada',
        'Uma equipe será notificada imediatamente.',
        'emergency'
    );
    
    // Em uma implementação real, aqui seria feita uma chamada à API
    console.log('Emergência enviada:', emergency);
}

// Estado do Agendamento
const appointmentState = {
    region: '',
    specialty: '',
    doctor: '',
    date: '',
    time: '',
    currentStep: 1
};

// Iniciar Agendamento
function startScheduling() {
    const schedulingSystem = document.querySelector('.scheduling-system');
    const progressBar = document.querySelector('.scheduling-progress');
    const mainButton = document.querySelector('.action-button.primary');

    schedulingSystem.style.display = 'block';
    progressBar.style.display = 'flex';
    mainButton.style.display = 'none';

    // Reset do estado
    Object.keys(appointmentState).forEach(key => {
        if (key !== 'currentStep') appointmentState[key] = '';
    });
    appointmentState.currentStep = 1;

    showStep(1);
    updateProgress(1);
}

// Gerenciamento de Etapas
function showStep(step) {
    document.querySelectorAll('.scheduling-step').forEach(el => {
        el.style.display = 'none';
    });
    
    const currentStep = document.getElementById(getStepId(step));
    if (currentStep) {
        currentStep.style.display = 'block';
        currentStep.style.animation = 'fadeIn 0.3s ease forwards';
    }
    
    updateProgress(step);
}

function getStepId(step) {
    const steps = {
        1: 'cityStep',
        2: 'specialtyStep',
        3: 'doctorStep',
        4: 'confirmationStep'
    };
    return steps[step];
}

function updateProgress(currentStep) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        if (index + 1 < currentStep) {
            step.classList.remove('active');
            step.classList.add('completed');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// Seleção de Região
function selectRegion(region) {
    appointmentState.region = region;
    document.getElementById('confirmRegion').textContent = region;
    
    // Animação de transição
    const currentStep = document.getElementById('cityStep');
    currentStep.style.animation = 'fadeOut 0.3s ease forwards';
    
    setTimeout(() => {
        showStep(2);
        const nextStep = document.getElementById('specialtyStep');
        nextStep.style.animation = 'fadeIn 0.3s ease forwards';
    }, 300);
}

// Seleção de Especialidade
function selectSpecialty(specialty) {
    appointmentState.specialty = specialty;
    document.getElementById('confirmSpecialty').textContent = specialty;
    
    const currentStep = document.getElementById('specialtyStep');
    currentStep.style.animation = 'fadeOut 0.3s ease forwards';
    
    setTimeout(() => {
        showStep(3);
        loadDoctors(specialty);
        const nextStep = document.getElementById('doctorStep');
        nextStep.style.animation = 'fadeIn 0.3s ease forwards';
    }, 300);
}

// Seleção de Médico
function selectDoctor(doctorId) {
    const doctorName = document.querySelector([onclick="selectDoctor('${doctorId}')"] h4).textContent;
    appointmentState.doctor = doctorName;
    document.getElementById('confirmDoctor').textContent = doctorName;
    
    const scheduleSelection = document.querySelector('.schedule-selection');
    scheduleSelection.style.display = 'block';
    scheduleSelection.style.animation = 'fadeIn 0.3s ease forwards';
    
    initializeCalendar();
}

// Calendário e Seleção de Horário
function initializeCalendar() {
    const today = new Date();
    generateCalendar(today.getFullYear(), today.getMonth());
    updateCalendarHeader(today);
}

function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';

    // Adiciona cabeçalho dos dias da semana
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    weekDays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day weekday';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });

    // Preenche dias vazios no início do mês
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day disabled';
        calendarGrid.appendChild(emptyDay);
    }

    // Preenche os dias do mês
    const today = new Date();
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(year, month, day);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        // Desabilita dias passados
        if (currentDate < today) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.onclick = () => selectDate(year, month, day);
        }

        calendarGrid.appendChild(dayElement);
    }
}

function updateCalendarHeader(date) {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    document.getElementById('currentMonth').
    document.getElementById('currentMonth').textContent = ${months[date.getMonth()]} ${date.getFullYear()};
}

function selectDate(year, month, day) {
    const date = new Date(year, month, day);
    appointmentState.date = date.toLocaleDateString();
    document.getElementById('confirmDate').textContent = appointmentState.date;
    
    // Atualiza visual do calendário
    document.querySelectorAll('.calendar-day').forEach(el => {
        el.classList.remove('selected');
        if (el.textContent == day && !el.classList.contains('disabled')) {
            el.classList.add('selected');
        }
    });

    // Mostra horários disponíveis com animação
    const timeSlots = document.querySelector('.time-slots');
    timeSlots.style.animation = 'fadeIn 0.3s ease forwards';
}

function selectTime(time) {
    appointmentState.time = time;
    document.getElementById('confirmTime').textContent = time;
    
    // Atualiza visual dos horários
    document.querySelectorAll('.time-slot').forEach(el => {
        el.classList.remove('selected');
        if (el.textContent === time) {
            el.classList.add('selected');
        }
    });
    
    // Transição suave para a confirmação
    const doctorStep = document.getElementById('doctorStep');
    doctorStep.style.animation = 'fadeOut 0.3s ease forwards';
    
    setTimeout(() => {
        showStep(4);
        const confirmationStep = document.getElementById('confirmationStep');
        confirmationStep.style.animation = 'fadeIn 0.3s ease forwards';
    }, 300);
}

// Navegação do Calendário
function prevMonth() {
    const currentMonth = document.getElementById('currentMonth').textContent;
    const [month, year] = currentMonth.split(' ');
    const date = new Date(${month} 1, ${year});
    date.setMonth(date.getMonth() - 1);
    updateCalendarHeader(date);
    generateCalendar(date.getFullYear(), date.getMonth());
}

function nextMonth() {
    const currentMonth = document.getElementById('currentMonth').textContent;
    const [month, year] = currentMonth.split(' ');
    const date = new Date(${month} 1, ${year});
    date.setMonth(date.getMonth() + 1);
    updateCalendarHeader(date);
    generateCalendar(date.getFullYear(), date.getMonth());
}

// Funções de Finalização
function editAppointment() {
    showStep(1);
}

function confirmAppointment() {
    // Validação dos dados
    if (!validateAppointmentData()) {
        showNotification('Erro', 'Por favor, preencha todos os dados do agendamento.', 'error');
        return;
    }

    // Simulação de envio para o servidor
    const appointmentData = {
        ...appointmentState,
        patientId: 'current-user-id',
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    // Aqui seria feita a chamada à API
    console.log('Enviando dados do agendamento:', appointmentData);

    // Adiciona a nova consulta à lista
    addAppointmentToList(appointmentData);

    // Feedback visual
    showNotification('Sucesso', 'Consulta agendada com sucesso!', 'success');

    // Reset do sistema de agendamento
    resetSchedulingSystem();
}

function validateAppointmentData() {
    return (
        appointmentState.region &&
        appointmentState.specialty &&
        appointmentState.doctor &&
        appointmentState.date &&
        appointmentState.time
    );
}

function addAppointmentToList(appointmentData) {
    const appointmentList = document.querySelector('.appointment-list');
    const newAppointment = document.createElement('div');
    newAppointment.className = 'appointment-item';
    newAppointment.innerHTML = 
        <div class="appointment-icon">👨‍⚕</div>
        <div class="appointment-info">
            <h4>${appointmentData.doctor} - ${appointmentData.specialty}</h4>
            <p>${appointmentData.date} - ${appointmentData.time}</p>
            <p>${appointmentData.region}</p>
            <span class="status-badge confirmed">Confirmado</span>
        </div>
    ;
    newAppointment.style.animation = 'fadeIn 0.3s ease forwards';
    appointmentList.appendChild(newAppointment);
}

function resetSchedulingSystem() {
    const schedulingSystem = document.querySelector('.scheduling-system');
    const progressBar = document.querySelector('.scheduling-progress');
    const mainButton = document.querySelector('.action-button.primary');

    schedulingSystem.style.animation = 'fadeOut 0.3s ease forwards';
    progressBar.style.animation = 'fadeOut 0.3s ease forwards';

    setTimeout(() => {
        schedulingSystem.style.display = 'none';
        progressBar.style.display = 'none';
        mainButton.style.display = 'block';
        mainButton.style.animation = 'fadeIn 0.3s ease forwards';

        // Reset do estado
        Object.keys(appointmentState).forEach(key => {
            if (key !== 'currentStep') appointmentState[key] = '';
        });
        appointmentState.currentStep = 1;
    }, 300);
}

// Carregamento de Dados
function loadDoctors(specialty) {
    const doctorList = document.querySelector('.doctor-list');
    doctorList.innerHTML = '';

    // Simulação de dados dos médicos
    const doctors = [
        {
            id: '1',
            name: 'Dr. João Silva',
            crm: '12345',
            rating: 4.8,
            photo: '/api/placeholder/60/60'
        },
        {
            id: '2',
            name: 'Dra. Maria Santos',
            crm: '23456',
            rating: 4.9,
            photo: '/api/placeholder/60/60'
        }
    ];

    doctors.forEach(doctor => {
        const doctorCard = createDoctorCard(doctor);
        doctorList.appendChild(doctorCard);
    });
}

function createDoctorCard(doctor) {
    const doctorCard = document.createElement('div');
    doctorCard.className = 'doctor-card';
    doctorCard.onclick = () => selectDoctor(doctor.id);
    doctorCard.innerHTML = 
        <img src="${doctor.photo}" alt="${doctor.name}" class="doctor-photo">
        <div class="doctor-info">
            <h4>${doctor.name}</h4>
            <p>CRM: ${doctor.crm}</p>
            <div class="rating">⭐⭐⭐⭐⭐ (${doctor.rating})</div>
        </div>
    ;
    return doctorCard;
}
// Service Worker
const CACHE_NAME = 'saude-digital-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/perfil.html',
    '/styles.css',
    '/app.js',
    '/images/icons/*'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(response => {
                    // Verifica se a resposta é válida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});

// Sistema de Sincronização em Background
class BackgroundSync {
    constructor() {
        this.syncQueue = [];
        this.isSyncing = false;
    }

    addToQueue(data) {
        this.syncQueue.push({
            data,
            timestamp: new Date().getTime()
        });
        this.attemptSync();
    }

    async attemptSync() {
        if (this.isSyncing || this.syncQueue.length === 0) return;

        this.isSyncing = true;
        const item = this.syncQueue[0];

        try {
            // Simulação de sincronização
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Sincronizando:', item.data);
            
            this.syncQueue.shift();
            showNotification('Sincronização', 'Dados sincronizados com sucesso', 'success');
        } catch (error) {
            console.error('Erro na sincronização:', error);
            showNotification('Erro', 'Falha na sincronização dos dados', 'error');
        } finally {
            this.isSyncing = false;
            if (this.syncQueue.length > 0) {
                this.attemptSync();
            }
        }
    }
}

const backgroundSync = new BackgroundSync();

// Sistema de Cache Local
class LocalCache {
    constructor() {
        this.storage = localStorage;
    }

    set(key, value, expiry = null) {
        const item = {
            value,
            timestamp: new Date().getTime(),
            expiry: expiry ? expiry * 1000 : null
        };
        this.storage.setItem(key, JSON.stringify(item));
    }

    get(key) {
        const item = this.storage.getItem(key);
        if (!item) return null;

        const parsedItem = JSON.parse(item);
        if (parsedItem.expiry && (new Date().getTime() - parsedItem.timestamp) > parsedItem.expiry) {
            this.storage.removeItem(key);
            return null;
        }

        return parsedItem.value;
    }

    remove(key) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }
}

const localCache = new LocalCache();

// Sistema de Logs
class Logger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
    }

    log(message, type = 'info') {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type,
            message
        };

        this.logs.push(logEntry);
        console.log([${type.toUpperCase()}] ${message});

        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Em caso de erro, salva no armazenamento local
        if (type === 'error') {
            this.saveErrorLog(logEntry);
        }
    }

    saveErrorLog(logEntry) {
        const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
        errorLogs.push(logEntry);
        localStorage.setItem('errorLogs', JSON.stringify(errorLogs));
    }

    getLogs(type = null) {
        if (type) {
            return this.logs.filter(log => log.type === type);
        }
        return this.logs;
    }

    clearLogs() {
        this.logs = [];
        localStorage.removeItem('errorLogs');
    }
}

const logger = new Logger();

// Inicialização do Sistema
document.addEventListener('DOMContentLoaded', () => {
    // Registra o Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                logger.log('Service Worker registrado com sucesso');
            })
            .catch(error => {
                logger.log('Erro no registro do Service Worker: ' + error, 'error');
            });
    }

    // Inicializa os sistemas
    initializeEventListeners();
    initializeNotifications();
    checkConnectivity();
});

// Verificação de Conectividade
function checkConnectivity() {
    const updateOnlineStatus = () => {
        const condition = navigator.onLine ? 'online' : 'offline';
        logger.log(Aplicação está ${condition});
        
        if (!navigator.onLine) {
            showNotification(
                'Sem conexão',
                'Você está offline. Algumas funcionalidades podem estar limitadas.',
                'warning'
            );
        }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}
