// Função de manipulação dos cards
function toggleCard(event, cardElement) {
    const clickedElement = event.target;

    // Previne interação em elementos internos
    if (
        clickedElement.classList.contains('action-button') ||
        clickedElement.closest('.action-button') ||
        clickedElement.tagName === 'SELECT'
    ) {
        event.stopPropagation();
        return;
    }

    const content = cardElement.querySelector('.card-content');
    const isActive = cardElement.classList.contains('active');

    // Fecha outros cards abertos
    document.querySelectorAll('.card.active').forEach((card) => {
        if (card !== cardElement) {
            card.classList.remove('active');
            card.querySelector('.card-content').style.display = 'none';
        }
    });

    // Alterna o estado do card atual
    if (!isActive) {
        cardElement.classList.add('active');
        content.style.display = 'block';
    } else {
        cardElement.classList.remove('active');
        content.style.display = 'none';
    }
}

// Inicializa os eventos para os cards
function initializeCards() {
    document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('click', (event) => toggleCard(event, card));
    });
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', initializeCards);
