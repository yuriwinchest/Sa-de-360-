// Acessibilidade
function changeFontSize(action) {
    const body = document.body;
    const currentSize = parseInt(window.getComputedStyle(body).fontSize);

    switch (action) {
        case 'increase':
            body.style.fontSize = `${currentSize + 2}px`;
            break;
        case 'decrease':
            body.style.fontSize = `${currentSize - 2}px`;
            break;
        case 'reset':
            body.style.fontSize = '16px';
            break;
    }
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
}

// Inicializa eventos de acessibilidade
function initializeAccessibility() {
    document
        .querySelectorAll('.control-btn')
        .forEach((btn) =>
            btn.addEventListener('click', () => changeFontSize(btn.dataset.action))
        );

    document
        .querySelector('.action-button[contrast]')
        .addEventListener('click', toggleHighContrast);
}

document.addEventListener('DOMContentLoaded', initializeAccessibility);
