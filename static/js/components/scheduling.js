// Sistema de Agendamento
const appointmentState = {
    region: '',
    specialty: '',
    doctor: '',
    date: '',
    time: '',
    currentStep: 1,
};

function startScheduling() {
    // Lógica de inicialização do sistema de agendamento
}

function selectRegion(region) {
    // Lógica para selecionar a região
}

function selectSpecialty(specialty) {
    // Lógica para selecionar a especialidade
}

function selectDoctor(doctorId) {
    // Lógica para selecionar o médico
}

function selectDate(year, month, day) {
    // Lógica para selecionar a data
}

function selectTime(time) {
    // Lógica para selecionar o horário
}

// Inicializa o sistema de agendamento
function initializeScheduling() {
    document
        .querySelector('.action-button.primary')
        .addEventListener('click', startScheduling);
}

document.addEventListener('DOMContentLoaded', initializeScheduling);
